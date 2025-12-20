const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function createParent() {
  try {
    console.log("Loaded MONGO_URI:", process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    // Check if parent already exists
    const existingParent = await User.findOne({ email: "parent@test.com" });
    if (existingParent) {
      console.log("Parent already exists!");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("password123", 10);

    await User.create({
      name: "John Doe",
      email: "parent@test.com",
      password: hashedPassword,
      childName: "Emma Doe",
    });

    console.log("Parent created successfully!");
    console.log("Email: parent@test.com");
    console.log("Password: password123");
    process.exit(0);
  } catch (error) {
    console.error("ERROR:", error);
    process.exit(1);
  }
}

createParent();
