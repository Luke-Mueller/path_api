const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listSchema = new Schema({
  arcOwnerIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
  items: [{ 
    item: String, 
    items: [{ item: String }], 
    name: String, 
    itemType: String 
  }],
  name: { type: String, required: true },
  ownerIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("List", listSchema);
