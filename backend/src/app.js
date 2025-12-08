const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(`/${process.env.UPLOAD_PATH}`, express.static(path.join(process.cwd(), process.env.UPLOAD_PATH)));

app.use("/api/patients", require("./routes/authRoutes"));
app.use("/api/cases", require("./routes/caseRoutes"));
app.use("/api/doctors", require("./routes/doctorRoutes"));

module.exports = app;
