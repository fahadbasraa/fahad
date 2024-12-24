const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email is unique
    lowercase: true, // Convert email to lowercase for consistency
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["admin", "editor", "user"],
    default: "user",
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
