import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import patientRoutes from "./routes/patientRoutes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/patients", patientRoutes);

app.get("/", (req, res) => {
  res.send("Pediatric Teledermatology API Working");
});

export default app;
