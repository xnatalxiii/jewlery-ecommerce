const express = require("express");
const adminController = require("./../controllers/adminController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.use(authController.isLoggedIn);
router.use(authController.protect);
router.use(authController.restrictTo("admin"));
// router.use(authController.restrictTo("admin"));

router.get("/users", adminController.getUsersView);
router.get("/products", adminController.getProductsView);
router.get("/orders", adminController.getOrdersView);
router.get("/contacts", adminController.getContactsView);

router.patch(
	"/updateBanner",
	adminController.uploadBannerImg,
	adminController.resizeBannerImg,
	adminController.updateBanner
);

module.exports = router;
