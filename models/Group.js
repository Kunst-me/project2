const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const groupSchema = new Schema({
  name: {
    type: String,
    default: "Friends",
  },
  user: {
    type: [Schema.Types.ObjectId],
    ref: "User",
  },
  events: [
    { event: { type: Schema.Types.ObjectId, ref: "Event" }, name: String },
  ],
  date: {
    type: Date,
    // required: true,
  },
});

const Group = mongoose.model("Group", groupSchema);
module.exports = Group;
