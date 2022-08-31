const mongoose = require("mongoose");

const gradeSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
    },
    grade: { type: Number, min: 6, max: 10, default: "" },
    dateExam: { type: Date, default: "" },
  },
  { _id: false }
);

const studentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    indexNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    gradeHistory: {
      type: [gradeSchema],
    },
  },
  { _id: true }
);

module.exports = mongoose.model("student", studentSchema);
