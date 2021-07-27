const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  activeLists: [{type: Schema.Types.ObjectId, ref: "ActiveList"}],
  archivedLists: [{ type: Schema.Types.ObjectId, ref: "List" }],
  inviteLists: [{ type: Schema.Types.ObjectId, ref: "List" }],
  myLists: [{ type: Schema.Types.ObjectId, ref: "List" }],
});

module.exports = mongoose.model("User", userSchema);
