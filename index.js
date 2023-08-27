const express = require("express");
const dotenv = require("dotenv");

dotenv.config();
const app = express();


const PORT = process.env.PORT || 7000;

app.use(express.json());
app.use("/api/auth", require("./router/auth"));
app.use("/api/menu", require("./router/food"));

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
