const { Op } = require("sequelize");
const db = require("../config/db");
const User = require("../models/user");
const { validationResult } = require("express-validator");

// Get users with pagination
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;
    const CreatedBy = req.query.createdBy || "System";
    let gender = req.query.gender;
    const whereClause = { CreatedBy }; // base filter

    // Apply gender filter only if it exists
    if (gender !== undefined) {
      if (gender.toLowerCase() === "female") {
        whereClause.Gender = 1;
      } else if (gender.toLowerCase() === "male") {
        whereClause.Gender = 0;
      }
    }

    const { count: totalRecords, rows: data } = await User.findAndCountAll({
      where: whereClause,
      offset,
      limit: pageSize,
    });

    res.json({
      data,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalRecords / pageSize),
        totalRecords,
        pageSize,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users", details: err });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user", details: err });
  }
};

// Create user
exports.createUser = async (req, res) => {
  try {
    const {
      FirstName,
      LastName,
      Email,
      Gender,
      MaritalStatus,
      Birthday,
      Hobbies,
      Salary,
      Address,
      Password,
      Country,
      State,
      City,
      ZipCode,
    } = req.body;

    const Photo = req.file
      ? `http://localhost:5000/uploads/${req.file.filename}`
      : null;

    if (Birthday) {
      const dob = new Date(Birthday);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      const is18OrOlder = age > 18 || (age === 18 && m >= 0);
      if (!is18OrOlder)
        return res
          .status(400)
          .json({ error: "User must be at least 18 years old." });
    }

    if (Salary) {
      const salaryNum = Number(Salary);
      if (isNaN(salaryNum) || salaryNum < 5000) {
        return res
          .status(400)
          .json({ error: "Salary must be greater than 5000." });
      }
    }

    const existing = await User.findOne({ where: { Email } });
    if (existing)
      return res
        .status(409)
        .json({ error: "Duplicate email. Use another email." });

    const newUser = await User.create({
      FirstName,
      LastName,
      Email,
      Gender: Gender == "Male" ? 0 : 1,
      MaritalStatus: MaritalStatus == "false" ? 0 : 1,
      Birthday,
      Hobbies,
      Photo,
      Salary,
      Address,
      Country,
      State,
      Password,
      City,
      ZipCode,
      CreateDate: new Date(),
      CreatedBy: "System",
    });

    res.status(201).json({ message: "User add successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to create user", details: err });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const {
      FirstName,
      LastName,
      Email,
      Gender,
      MaritalStatus,
      Birthday,
      Hobbies,
      Salary,
      Address,
      Country,
      Password,
      State,
      City,
      ZipCode,
    } = req.body;

    const Photo = req.file
      ? `http://localhost:5000/uploads/${req.file.filename}`
      : req.body.Photo;

    if (Birthday) {
      const dob = new Date(Birthday);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      const is18OrOlder = age > 18 || (age === 18 && m >= 0);
      if (!is18OrOlder)
        return res
          .status(400)
          .json({ error: "User must be at least 18 years old." });
    }

    if (Salary) {
      const salaryNum = Number(Salary);
      if (isNaN(salaryNum) || salaryNum < 5000) {
        return res
          .status(400)
          .json({ error: "Salary must be greater than 5000." });
      }
    }

    await user.update({
      FirstName,
      LastName,
      Email,
      Gender: Gender == "Male" ? 0 : 1,
      MaritalStatus: MaritalStatus == "false" ? 0 : 1,
      Birthday,
      Hobbies,
      Photo,
      Salary,
      Address,
      Password,
      Country,
      State,
      City,
      ZipCode,
    });

    res.json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update user", details: err });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    await user.destroy();
    res.json({ message: "User deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user", details: err });
  }
};

exports.checkEmail = async (req, res) => {
  try {
    console.log(req.body);
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    const existing = await User.findOne({ where: { email } });

    if (existing) {
      return res
        .status(200)
        .json({ exists: true, message: "Email already exists." });
    } else {
      return res
        .status(200)
        .json({ exists: false, message: "Email is available." });
    }
  } catch (error) {
    console.error("Error checking email:", error);
    return res
      .status(500)
      .json({ message: "Server error while checking email." });
  }
};
