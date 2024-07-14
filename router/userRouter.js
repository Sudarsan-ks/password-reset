const express = require("express");
const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../email");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, username, phonenumber, password } = req.body;
  try {
    const hasspassword = await bcrypt.hash(password, 10);
    const existUser = await User.find({ email: email });
    if (!existUser) {
      return res.status(404).json({ message: "This user already exist" });
    }
    const newUser = new User({
      email,
      username,
      phonenumber,
      password: hasspassword,
    });
    await newUser.save();
    res.status(201).json({ message: "Registered Sucessfully", newUser });
  } catch (err) {
    res.status(400).json({ message: "Error while registering" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!user || !passwordMatch) {
      res.status(404).json({ message: "Invalid credential" });
    }
    res.status(200).json({ message: "Login successfully", user });
  } catch (err) {
    res.status(400).json({ message: "Error while login" });
  }
});

router.post("/forgotPassword", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const resetToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    const link = `${process.env.CLIENT_URL_NETLIFY}/resetPassword/${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      html: `<p>Click <a href="${link}">here</a> to reset your password</p>`,
    });
    res.status(200).json({ message: "Password reset link sent to email" });
  } catch (err) {
    res.status(400).json({ message: "Error while Reseting the password" });
  }
});

router.post("/resetPassword/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const checkMatching = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(checkMatching.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reseted successfully" });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Token has expired" });
    }
    res
      .status(500)
      .json({ message: "Error while Resetting password", error: err.message });
  }
});

module.exports = router;
