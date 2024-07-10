const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  phonenumber: { type: Number, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model("user",userSchema);
module.exports = User