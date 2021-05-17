const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  password: { type: String, required: true },
  username: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
