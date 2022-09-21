const Student = require("../model/student");

// Middleware for get unique student
async function getStudent(req, res, next) {
  let student;
  try {
    student = await Student.findOne({ indexNumber: req.params.id });
    if (student == null) {
      return res.status(404).json({ message: "Cannot find Student" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.student = student;
  next();
}

module.exports = { getStudent };
