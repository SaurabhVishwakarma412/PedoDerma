// backend/app.js
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true
// }));

const cors = require("cors");

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://pedo-derma.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/api/patients", require("./routes/authRoutes"));
app.use("/api/cases", require("./routes/caseRoutes"));
app.use("/api/doctors", require("./routes/doctorRoute"));
app.use("/api/messages", require("./routes/messageRoutes"));

module.exports = app;
