// Validate new User on registration
const emailRegex = /^[^\s@]+@[^\s@.]+\.[^\s@.]{3}$/;
const passwordRegex = /\S{4,}/;

// Validate new Student data
const indexRegex = /^\d+-\d{4}$/;
const phoneRegex = /^\+\d{3}\s\d{2}\s\d{3}\s\d{3,4}$/;

const userValidation = async (req, res, next) => {
  try {
    const { email, password, passwordConfirm } = req.body;
    if (!email || !password || !passwordConfirm) {
      throw new Error("You must add all fields!");
    }
    if (!emailRegex.test(email)) {
      throw new Error("You must enter valid email address!");
    }
    if (!passwordRegex.test(password)) {
      throw new Error("You must enter valid password!");
    }
    if (password !== passwordConfirm) {
      throw new Error("Make sure your passwords match!");
    }
    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const studentAddValidation = async (req, res, next) => {
  try {
    const { indexNumber, email, phone } = req.body;
    if (!indexRegex.test(indexNumber)) {
      throw new Error("You must enter valid index number!");
    }
    if (!emailRegex.test(email)) {
      throw new Error("You must enter valid email address!");
    }
    if (!phoneRegex.test(phone)) {
      throw new Error("You must enter valid phone number!");
    }
    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const studentEditValidation = async (req, res, next) => {
  try {
    const { email, phone } = req.body;
    if (!emailRegex.test(email)) {
      throw new Error("You must enter valid email address!");
    }
    if (!phoneRegex.test(phone)) {
      throw new Error("You must enter valid phone number!");
    }
    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  userValidation,
  studentAddValidation,
  studentEditValidation,
};
