const express = require("express");
const orderController = require("./../controllers/orderController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.use(authController.protect);
router.post("/", orderController.createOrder);
router.get("/myOrders", orderController.myOrders);
router.patch("/cancel/:id", orderController.updateMyOrder);

router.use(authController.restrictTo("admin"));
router.get("/", orderController.getAllOrders);
router.delete("/:id", orderController.deleteOrder);
router.patch("/:id", orderController.updateOrder);

router.get("/:id", orderController.getOrder);

module.exports = router;
