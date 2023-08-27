const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("../config/database");

exports.signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  const emailExists = await new Promise((resolve, reject) => {
    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length > 0);
      }
    });
  });

  if (emailExists) {
    return res.status(409).json({ error: "Email already exists" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = { name, email, password: hashedPassword };

  const insertQuery = "INSERT INTO users SET ?";
  db.query(insertQuery, newUser, (err, result) => {
    if (err) {
      console.error("Error inserting user:", err);
      return res.status(500).json({ error: "An error occurred" });
    }
    const token = jwt.sign(
      { sub: result.insertId, role: "user" },
      process.env.JWT_SECRET,
      {
        expiresIn: "20h",
      }
    );

    res.status(201).json({ message: "User registered successfully", token });
  });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  const userQuery = "SELECT * FROM users WHERE email=?";

  db.query(userQuery, [email], (err, [userRow]) => {
    if (err) {
      console.error("Error during login:", err);
      return res.status(500).json({ error: "An error occurred" });
    }

    if (!userRow || !bcrypt.compareSync(password, userRow.password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { sub: userRow.id, role: userRow.role },
      process.env.JWT_SECRET,
      { expiresIn: "20h" }
    );

    res.json({ token });
  });
};

exports.allowedTo =
  (...roles) =>
  async (req, res, next) => {
    const userId = req.user.id;
    const userRoleQuery = 'SELECT role FROM users WHERE id = ?';

    db.query(userRoleQuery, [userId], (err, results) => {
      if (err) {
        console.error('Error retrieving user role:', err);
        return res.status(500).json({ error: 'An error occurred' });
      }

      const userRole = results[0].role;

      if (!roles.includes(userRole)) {
        return next(new ApiError('You are not allowed to access this route', 403));
      }

      next();
    });
  };
