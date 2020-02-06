const express = require("express");
const contactController = require("./../controllers/contactController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.post("/", contactController.createContact);

router.use(authController.protect);
router.use(authController.restrictTo("admin"));

router.get("/", contactController.getAllContacts);
router.delete("/:id", contactController.deleteContact);

module.exports = router;
