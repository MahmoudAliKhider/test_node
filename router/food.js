const express = require("express");
const router = express.Router();
const authMiddleware = require("../middelware/auth.middelware");
const foodController = require("../services/food");
const authServices = require("../services/auth");

router.get("/food", foodController.getAllFood);
router.get("/food/:id", foodController.getFoodById);

router.post(
  "/food",
  authMiddleware,
  authServices.allowedTo("admin"),
  foodController.createFood
);
router.put(
  "/food/:id",
  authMiddleware,
  authServices.allowedTo("admin"),
  foodController.updateFood
);
router.delete(
  "/food/:id",
  authMiddleware,
  authServices.allowedTo("admin"),
  foodController.deleteFood
);

module.exports = router;
