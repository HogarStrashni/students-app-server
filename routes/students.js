const express = require("express");
const router = express.Router();
const Student = require("../model/student");
const Exam = require("../model/exam");

//Getting all students
router.get("/students", async (req, res) => {
  try {
    const allStudents = await Student.find();
    res.status(200).json(allStudents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Getting one student
router.get("/student/:id", (req, res) => {});

//Creating new student
router.post("/students", async (req, res) => {
  try {
    const exams = await Exam.find();
    const student = new Student({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      indexNumber: req.body.indexNumber,
      email: req.body.email,
      phone: req.body.phone,
      gradeHistory: exams.map((item) => {
        return {
          subject: item.name,
          grade: req.body.grade,
          dateExam: req.body.dateExam,
        };
      }),
    });
    const newStudent = await student.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Updating one student
router.patch("/student/:id", (req, res) => {});

//Delete one student
router.delete("/student/:id", (req, res) => {});

module.exports = router;
