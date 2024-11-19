const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { protect } = require("../auth/authMiddleware");

const crypto = require("crypto");
const nodemailer = require("nodemailer");

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

// Forgot password route
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "No user found with that email" });
  }

  // Generate a reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetToken = resetToken;
  user.resetTokenExpiration = Date.now() + 3600000;
  await user.save();

  // Send reset link via email
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

  const mailOptions = {
    to: email,
    subject: "Password Reset Request",
    text: `You requested a password reset. Click the following link to reset your password: ${resetLink}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return res.status(500).json({ message: "Error sending email" });
    }
    res.json({ message: "Password reset link sent to your email!" });
  });
});
module.exports = router;

// Reset password route
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired reset token" });
  }

  // Hash the new password and update user
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  user.resetToken = undefined;
  user.resetTokenExpiration = undefined;

  await user.save();
  res.json({ message: "Password has been reset successfully!" });
});
