const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Doctor = require("./models/Doctor");

async function createDoctor() {
  try {
    console.log("Loaded MONGO_URI:", process.env.MONGO_URI); // Debug print

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    const hashedPassword = await bcrypt.hash("saurabh", 10);

    await Doctor.create({
      name: "Dr. Saurabh Sharma",
      email: "saurabh@gmail.com",
      password: hashedPassword,
      specialization: "Dermatology",
    });

    console.log("Doctor created successfully!");
    process.exit();
  } catch (error) {
    console.error("ERROR:", error);
    process.exit(1);
  }
}

createDoctor();


// 1...................
// name: "Dr. Sharma",
// email: "doctor@test.com",
// password: password123,
// specialization: "Dermatology"
// 2.......................
// name: "Dr. Saurabh Sharma",
// email: "saurabh@gmail.com",
// password: saurabh,
// specialization: "Dermatology"

