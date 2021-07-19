const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  password: { type: String, required: true },
  username: { type: String, required: true },
  activeLists: [
    {
      _id: { type: Schema.Types.ObjectId, ref: "List" },
      items: [
        {
          itemType: String,
          item: String,
          subItems: [{ item: String }],
          subName: String,
          done: Boolean,
        },
      ],
      progress: { type: Schema.Types.Number },
    },
  ],
  archivedLists: [{ type: Schema.Types.ObjectId, ref: "List" }],
  myLists: [{ type: Schema.Types.ObjectId, ref: "List" }],
  waitingLists: [{ type: Schema.Types.ObjectId, ref: "List" }],
});

module.exports = mongoose.model("User", userSchema);
