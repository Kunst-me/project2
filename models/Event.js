const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const eventSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  numParticipants: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  booked: {
    type: Boolean,
    required: true,
  },
});

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
