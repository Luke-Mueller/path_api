const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const activeListSchema = new Schema({
  items: [
    {
      itemType: String,
      item: String,
      subItems: Array,
      subName: String,
      done: Boolean,
    },
  ],
  name: { type: Schema.Types.String },
  parentId: { type: Schema.Types.ObjectId, ref: "List" },
  progress: { type: Schema.Types.Number },
});

module.exports = mongoose.model("ActiveList", activeListSchema);
