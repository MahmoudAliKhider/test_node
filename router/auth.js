const router = require("express").Router();

const { signup, login } = require("../services/auth");

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
