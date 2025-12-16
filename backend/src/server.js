require("dotenv").config();
const connectDB = require("./config/db.js");
const app = require("./app");

connectDB();

app.listen(process.env.PORT, () =>
  console.log(`Server running on http://localhost:${process.env.PORT}`)
);
