const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../model/user");

const express = require("express");
const router = express.Router();

//Generate Token
const tokenGenerator = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "12h" });

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("You must add all fields!");
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists!");
  }
  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  //Create user
  const user = await User.create({
    email,
    password: hashedPassword,
  });
  if (user) {
    res.status(201).json({
      _id: user.id,
      email: user.email,
      token: tokenGenerator(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user Data!");
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  //Checking for existing mail
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      email: user.email,
      token: tokenGenerator(user._id),
    });
  } else {
    throw new Error("Invalid Email or Password... Try Again!");
  }
});

module.exports = router;
