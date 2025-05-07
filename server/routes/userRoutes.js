const express = require("express");
const { body } = require("express-validator");
const userController = require("../controllers/userController");
const upload = require("../middleware/uploadMiddleware");
const router = express.Router();

const userValidation = [
  body("FirstName").notEmpty().withMessage("First name is required"),
  body("LastName").notEmpty().withMessage("Last name is required"),
  body("Email").notEmpty().isEmail().withMessage("Valid email is required"),
  body("Gender").isInt({ min: 0, max: 1 }).withMessage("Gender must be 0 or 1"),
  body("MaritalStatus")
    .isInt({ min: 0, max: 1 })
    .withMessage("MaritalStatus must be 0 or 1"),
  body("Birthday").isISO8601().withMessage("Valid date required for Birthday"),
  body("Salary").isNumeric().withMessage("Salary must be a number"),
  body("ZipCode").isPostalCode("any").withMessage("Invalid ZipCode"),
];

// Routes
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post(
  "/",
  upload.single("Photo"),
  userValidation,
  userController.createUser
);
router.put(
  "/:id",
  upload.single("Photo"),
  userValidation,
  userController.updateUser
);
router.delete("/:id", userController.deleteUser);

module.exports = router;
