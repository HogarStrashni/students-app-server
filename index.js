const express = require("express");
const app = express();

// Adding access to .env file
require("dotenv").config();

// Configure cors for using axios
const cors = require("cors");

app.use(cors());
app.use(express.json());

const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL);

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

const studentsRouter = require("./routes/students");
app.use("/api", studentsRouter);
const usersRouter = require("./routes/users");
app.use("/api", usersRouter);

app.listen(process.env.PORT || 3000, () => console.log("Server Started"));

module.exports = app;
