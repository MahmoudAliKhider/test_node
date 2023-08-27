const db = require("../config/database");

exports.getAllFood = (req, res) => {
  db.query("SELECT * FROM food", (err, results) => {
    if (err) {
      console.error("Error fetching food items:", err);
      return res.status(500).json({ error: "An error occurred" });
    }

    res.status(200).json(results);
  });
};

exports.getFoodById = (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM food WHERE id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching food by ID:", err);
      return res.status(500).json({ error: "An error occurred" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Food not found" });
    }

    const food = results[0];
    res.json(food);
  });
};

exports.createFood = (req, res) => {
  const { name, description, price, quentity } = req.body;
  const insertQuery =
    "INSERT INTO food (name, description, price, quentity) VALUES (?, ?, ?, ?)";
  const values = [name, description, price, quentity];

  db.query(insertQuery, values, (err, result) => {
    if (err) {
      console.error("Error creating food:", err);
      return res.status(500).json({ error: "An error occurred" });
    }
    res.status(201).json({
      message: "Food item created successfully",
      foodId: result.id,
    });
  });
};

exports.updateFood = (req, res) => {
  const id = req.params.id;
  const updatedFields = req.body;

  let updateQuery = "UPDATE food SET ";
  const updateValues = [];
  for (const key in updatedFields) {
    if (Object.hasOwnProperty.call(updatedFields, key)) {
      updateQuery += `${key} = ?, `;
      updateValues.push(updatedFields[key]);
    }
  }
  updateQuery = updateQuery.slice(0, -2);
  updateQuery += " WHERE id = ?";

  updateValues.push(id);

  db.query(updateQuery, updateValues, (err, result) => {
    if (err) {
      console.error("Error updating food:", err);
      return res.status(500).json({ error: "An error occurred" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Food not found" });
    }

    res.status(200).json({ message: "Food updated successfully" });
  });
};

exports.deleteFood = (req, res) => {
  const foodId = req.params.id;

  const deleteQuery = "DELETE FROM food WHERE id = ?";

  db.query(deleteQuery, [foodId], (err, result) => {
    if (err) {
      console.error("Error deleting food:", err);
      return res.status(500).json({ error: "An error occurred" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Food not found" });
    }

    res.status(200).json({ message: "Food deleted successfully" });
  });
};
