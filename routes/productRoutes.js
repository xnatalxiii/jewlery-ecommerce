const express = require("express");
const productController = require("./../controllers/productController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProduct);

router.use(authController.protect);
router.use(authController.restrictTo("admin"));

router.post("/", productController.uploadProductImg, productController.createProduct);
router.patch(
	"/:id",
	productController.uploadProductImg,
	// productController.resizeProductImg,
	productController.updateProduct
);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
