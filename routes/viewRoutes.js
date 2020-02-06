const express = require("express");
const viewsController = require("./../controllers/viewsController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.use(authController.isLoggedIn);

router.get("/", viewsController.getPrincipalView);

router.get("/cart", viewsController.getCartView);
router.get("/checkout", viewsController.getCheckoutView);

router.get("/contact", viewsController.getContactView);
router.get("/orders", authController.protect, viewsController.getOrdersView);

router.get("/products", viewsController.getProductsView);

router.get("/products/:slug", viewsController.getProductView);
router.get("/login", viewsController.getLoginView);
router.get("/signup", viewsController.getSignupView);
router.get("/account", authController.protect, viewsController.getAccountView);

router.get("/forgotPass", viewsController.getForgotPassView);
router.get("/resetPass/:token", viewsController.getResetPassView);

module.exports = router;
