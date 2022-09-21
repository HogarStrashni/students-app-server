// Validate new and edit Student data
const emailRegex = /^[^\s@]+@[^\s@.]+\.[^\s@.]{3}$/;
const indexRegex = /^\d+-\d{4}$/;
const phoneRegex = /^\+\d{3}\s\d{2}\s\d{3}\s\d{3,4}$/;

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

const indexNumValidation = async (req, res, next) => {
  try {
    const { indexNumber } = req.body;
    if (!indexRegex.test(indexNumber)) {
      throw new Error("You must enter valid index number!");
    }
    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  studentEditValidation,
  indexNumValidation,
};
