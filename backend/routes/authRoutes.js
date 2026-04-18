const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

console.log("Auth routes loaded");

// REGISTER API
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await user.save();

    res.json("User registered successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json("Error registering user");
  }
});

// LOGIN API
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json("Invalid password");

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.json({ token, role: user.role });

  } catch (error) {
    console.log(error);
    res.status(500).json("Login error");
  }
});

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// PROTECTED ROUTE
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user
  });
});

// ADMIN ONLY ROUTE
router.get("/admin", authMiddleware, roleMiddleware("admin"), (req, res) => {
  res.json("Welcome Admin");
});


// 🔥 NEW API (THIS IS WHAT YOU NEEDED)

// GET ALL EMPLOYEES (Admin only)
router.get("/employees", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).select("-password");
    res.json(employees);
  } catch (error) {
    console.log(error);
    res.status(500).json("Error fetching employees");
  }
});


module.exports = router;