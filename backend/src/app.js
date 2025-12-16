// backend/app.js
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/api/patients", require("./routes/authRoutes"));
app.use("/api/cases", require("./routes/caseRoutes")); // ✅ FILE NAME FIXED
app.use("/api/doctors", require("./routes/doctorRoute"));

module.exports = app;
