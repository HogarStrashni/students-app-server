const express = require("express");
const router = express.Router();
const Student = require("../model/student");
const Exam = require("../model/exam");

// Getting all students
router.get("/students", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );

  try {
    const allStudents = await Student.find();
    res.status(200).json(allStudents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/students", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );

  try {
    const allStudents = await Student.find();
    const filteredStudents = allStudents.filter(
      (item) =>
        item.firstName
          .toString()
          .toLowerCase()
          .includes(req.body.query.toString().toLowerCase()) ||
        item.lastName
          .toString()
          .toLowerCase()
          .includes(req.body.query.toString().toLowerCase()) ||
        item.indexNumber
          .toString()
          .toLowerCase()
          .includes(req.body.query.toString().toLowerCase()) ||
        item.email
          .toString()
          .toLowerCase()
          .includes(req.body.query.toString().toLowerCase()) ||
        item.phone
          .toString()
          .toLowerCase()
          .includes(req.body.query.toString().toLowerCase())
    );

    if (!req.body.query) {
      res.status(200).json(allStudents);
    } else {
      res.status(200).json(filteredStudents);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Creating new student
router.post("/students", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );

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

// Getting one student
router.get("/student/:id", getStudent, (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );

  res.json(res.student);
});

// Updating one student
router.patch("/student/:id", getStudent, async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );

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
});

// Delete one student
router.delete("/student/:id", getStudent, async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );

  try {
    await res.student.remove();
    res.json({ message: "Deleted Student" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getStudent(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );

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
