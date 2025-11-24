import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    parentEmail: { type: String, required: true },
    skinIssue: { type: String },
    imageURL: { type: String }, // for uploaded image
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
