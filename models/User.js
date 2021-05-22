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
          itemId: { type: Schema.Types.ObjectId },
          done: { type: Schema.Types.Boolean },
        },
      ],
      progress: { type: Schema.Types.Number },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
