const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.use(authController.protect); // todo despues de aqui sera con protect

router.patch("/addCartProd", userController.addCartProd);
router.patch("/updateCartProd", userController.updateCartProd);
router.patch("/emptyCartProd", userController.emptyCartProd);

router.patch("/updateData", userController.updateData);
router.patch("/updatePassword", authController.updatePassword);

router.use(authController.restrictTo("admin"));

router.route("/").get(userController.getAllUsers);
router
	.route("/:id")
	.get(userController.getUser)
	.delete(userController.deleteUser)
	.patch(userController.updateUser);

module.exports = router;
