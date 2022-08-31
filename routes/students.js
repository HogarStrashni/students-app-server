const express = require("express");
const router = express.Router();
const Student = require("../model/student");
const Exam = require("../model/exam");

const { authProtect, authAdmin } = require("./authMiddleware");

// Getting all students
router.get("/students", async (req, res) => {
  try {
    const searchParam = req.query.q;
    const pageNum = Number(req.query.page);
    const limitNum = Number(req.query.limit);

    let allStudents;
    if (!searchParam) {
      allStudents = await Student.find();
    } else {
      allStudents = await Student.find({
        $or: [
          { firstName: { $regex: searchParam, $options: "i" } },
          { lastName: { $regex: searchParam, $options: "i" } },
          { indexNumber: { $regex: searchParam, $options: "i" } },
          { email: { $regex: searchParam, $options: "i" } },
          { phone: { $regex: searchParam, $options: "i" } },
        ],
      });
    }

    const startIndexPage = (pageNum - 1) * limitNum;
    const endIndexPage = pageNum * limitNum;

    // Adding an object to store the necessary data
    const studentsPage = {};

    studentsPage.currentPage = pageNum;

    studentsPage.totalPages = Math.ceil(allStudents.length / limitNum);

    studentsPage.resultStudents = allStudents.slice(
      startIndexPage,
      endIndexPage
    );

    res.status(200).json(studentsPage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Creating new student
router.post("/students", authProtect, authAdmin, async (req, res) => {
  try {
    const exams = await Exam.find();
    const allGrades = exams.map((item) => {
      return {
        subject: item.name,
        grade: "",
        dateExam: "",
      };
    });
    const student = new Student({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      indexNumber: req.body.indexNumber,
      email: req.body.email,
      phone: req.body.phone,
      gradeHistory: allGrades,
    });
    if (!(await Student.findOne({ indexNumber: student.indexNumber }))) {
      const newStudent = await student.save();
      res.status(201).json(newStudent);
    } else {
      throw new Error(
        "Added index number already exists... Change index number!"
      );
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Getting one student
router.get("/student/:id", getStudent, authProtect, (req, res) => {
  res.json(res.student);
});

// Updating one student
router.patch(
  "/student/:id",
  getStudent,
  authProtect,
  authAdmin,
  async (req, res) => {
    try {
      if (req.body.firstName != null) {
        res.student.firstName = req.body.firstName;
      }
      if (req.body.lastName != null) {
        res.student.lastName = req.body.lastName;
      }
      if (req.body.indexNumber != null) {
        res.student.indexNumber = req.body.indexNumber;
      }
      if (req.body.email != null) {
        res.student.email = req.body.email;
      }
      if (req.body.phone != null) {
        res.student.phone = req.body.phone;
      }
      if (req.body.gradeHistory != null) {
        res.student.gradeHistory = req.body.gradeHistory;
      }

      const updatedStudent = await res.student.save();
      res.json(updatedStudent);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// Delete one student
router.delete(
  "/student/:id",
  getStudent,
  authProtect,
  authAdmin,
  async (req, res) => {
    try {
      await res.student.remove();
      res.json({ message: "Deleted Student" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

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

module.exports = router;
