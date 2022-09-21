// Validate new User on login and registration
const emailRegex = /^[^\s@]+@[^\s@.]+\.[^\s@.]{3}$/;
const passwordRegex = /\S{4,}/;

const loginValidation = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("You must add all fields!");
    }
    if (!emailRegex.test(email)) {
      throw new Error("You must enter valid email address!");
    }
    if (!passwordRegex.test(password)) {
      throw new Error("You must enter valid password!");
    }
    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const registerValidation = async (req, res, next) => {
  try {
    const { password, passwordConfirm } = req.body;
    if (!passwordConfirm) {
      throw new Error("You must add all fields!");
    }
    if (password !== passwordConfirm) {
      throw new Error("Make sure your passwords match!");
    }
    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  loginValidation,
  registerValidation,
};
