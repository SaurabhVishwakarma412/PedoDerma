const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || "saurabhkv412@gmail.com";
  const password = process.env.ADMIN_PASSWORD || "12345678";
  const name = process.env.ADMIN_NAME || "Platform Admin";

  if (!email || !password) throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env");
  await mongoose.connect(process.env.MONGO_URI);

  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { name, email: email.toLowerCase(), password: passwordHash, role: "admin" },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log(`Admin ready: ${admin.email}`);
  await mongoose.disconnect();
}

seedAdmin().catch(async (error) => {
  console.error("Admin seed failed:", error.message);
  await mongoose.disconnect().catch(() => {});
  process.exitCode = 1;
});
