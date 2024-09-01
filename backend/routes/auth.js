const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { protect } = require("../auth/authMiddleware");

/* signup */
router.post("/signup", async (req, res) => {
  const { fullname, email, password, userType } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      fullname,
      email,
      password,
      userType,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        userType: user.userType,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* login */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });

      res.json({
        token,
        user: {
          id: user._id,
          fullname: user.fullname,
          email: user.email,
          userType: user.userType,
        },
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* profile */
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/profile", protect, async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (password) user.password = password; // Ensure to hash password before saving

    await user.save();

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
