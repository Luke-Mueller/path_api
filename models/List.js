const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listSchema = new Schema({
  items: [{ 
    itemType: String, 
    item: String, 
    subName: String, 
    subItems: [{ type: Schema.Types.String }], 
  }],
  name: { type: String, required: true },
  ownerIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("List", listSchema);
