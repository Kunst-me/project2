const mongoose = require("mongoose");
const Event = require("../models/Event");

mongoose.connect("mongodb://localhost/project2", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const events = [
  {
    name: "Techno painting",
    description: "Just wow",
<<<<<<< HEAD
    date: new Date(2020, 07, 11).toDateString(),
=======
    date: new Date(2020, 07, 11),
>>>>>>> eb0c25fb11ebbfb3df78ebbf4f6c0839bfc451df
    time: 2,
    duration: 1,
    location: "Kreuzberg",
    numParticipants: 10,
    price: 30,
    booked: false,
  },
  {
    name: "Disco Moscow",
    description: "Bam",
<<<<<<< HEAD
    date: new Date(2020, 09, 11).toDateString(),
=======
    date: new Date(2020, 09, 11),
>>>>>>> eb0c25fb11ebbfb3df78ebbf4f6c0839bfc451df
    time: 2,
    duration: 1,
    location: "Kreuzberg",
    numParticipants: 10,
    price: 30,
    booked: false,
  },
  {
    name: "Passau boat making",
    description: "Wavy",
<<<<<<< HEAD
    date: new Date(2020, 09, 14).toDateString(),
=======
    date: new Date(2020, 09, 14),
>>>>>>> eb0c25fb11ebbfb3df78ebbf4f6c0839bfc451df
    time: 2,
    duration: 1,
    location: "Lichtenberg",
    numParticipants: 10,
    price: 80,
    booked: false,
  },
];

events.forEach((event) => {
  Event.create(event);
});
