const express = require("express");
const router = express.Router();
const User = require("../model/user");

const {
  loginValidation,
  registerValidation,
} = require("../middlewares/userValidation");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.post(
  "/register",
  loginValidation,
  registerValidation,
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const userExists = await User.findOne({ email });
      if (userExists) {
        throw new Error("User already exists! Try again!");
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
          role: user.role,
          token: tokenGenerator(user._id, user.email, user.role),
        });
      } else {
        throw new Error("Invalid user Data!");
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

router.post("/login", loginValidation, async (req, res) => {
  try {
    const { email, password } = req.body;
    //Checking for existing mail
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        email: user.email,
        role: user.role,
        token: tokenGenerator(user._id, user.email, user.role),
      });
    } else {
      throw new Error("Invalid Email or Password... Try Again!");
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Generate Token
const tokenGenerator = (id, email, role) =>
  jwt.sign({ id, email, role }, process.env.JWT_SECRET, { expiresIn: "12h" });

module.exports = router;
