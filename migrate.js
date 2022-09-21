const mongoose = require("mongoose");
const Student = require("./model/student");

mongoose.connect(process.env.DATABASE_URL);

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => {
  console.log("Connected to Database");
});

const getStudents = async () => {
  const allStudents = await Student.find();
  for (let i = 0; i < allStudents.length; i++) {
    const allGradesList = allStudents[i].gradeHistory
      .map((item) => item.grade)
      .filter((item) => item);

    const numberPassedExam = allGradesList.length;
    allStudents[i].averageGrade =
      numberPassedExam > 0
        ? (
            allGradesList.reduce((acc, item) => (acc += item), 0) /
            numberPassedExam
          ).toFixed(2)
        : "0.00";
    await allStudents[i].save();
  }
};
getStudents();
