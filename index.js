//configure cors for using axios
const cors = require("cors");

//adding access to .env file
require("dotenv").config();

const express = require("express");
const app = express();

const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL);

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.use(express.json());
app.use(cors());

const studentsRouter = require("./routes/students");
app.use("/api", studentsRouter);

app.listen(process.env.PORT || 3000, () => console.log("Server Started"));

module.exports = app;
