const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const Event = require("../models/Event");
const Group = require("../models/Group");
const { loginCheck } = require("./middlewares");

router.get("/groups", (req, res, next) => {
  Group.find().then((groupsFromDB) => {
    // console.log("hello:", groupsFromDB);
    res.render("groups/groupsView", { groupsList: groupsFromDB });
  });
});

router.get("/groups/add", (req, res, next) => {
  User.find()
    .then((usersFromDB) => {
      // console.log("This is an :", usersFromDB);
      res.render("groups/add", { users: usersFromDB });
    })
    .catch((error) => {
      next(error);
    });
});

router.get("/groups/:groupId", (req, res, next) => {
  const id = req.params.groupId;
  Group.findById(id)
    .populate("user")
    .then((groupFromDB) => {
      const date = groupFromDB.date.toDateString();
      console.log(groupFromDB);
      res.render("groups/groupDetails", { group: groupFromDB, date });
    });
});

router.post("/groups", loginCheck(), (req, res) => {
  const { name, user, date } = req.body;
  if (!req.isAuthenticated()) {
    res.redirect("/");
  }
  console.log(typeof date);
  Group.create({
    name,
    user,
    date,
  })
    .then((group) => {
      console.log;
      console.log(`New group was created: ${group}`);
      console.log(new Date(date).toDateString());
      Event.find({ date: new Date(date).toDateString() }).then((res) => {
        const events = res.map((elem) => {
          console.log("this is the elem:", elem);
          return { event: elem._id, name: elem.name, votes: 0 };
        });
        // console.log("DANIEL LOOK HERE, THESE ARE THE EVENTS:", events);
        Group.findByIdAndUpdate(group._id, { events: events })
          .then((some) => console.log("this is the some", some))
          .catch((err) => console.log(err));
      });
      res.redirect("/groups");
    })
    .catch((err) => {
      console.log("There was an error: ", err);
    });
});

router.get("/groups/:groupId/events", (req, res, next) => {
  const id = req.params.groupId;
  Group.findById(id).then((groupFromDB) => {
    // console.log(req.params);
    res.render("events/eventsView", {
      groupId: req.params.groupId,
      eventsList: groupFromDB.events,
    });
  });
});

// router.post("/groups/:groupId", (req, res, next) => {
//   const voted = req.body.events;
//   Event.findByIdAndUpdate(
//   .....
//   )
//   console.log(req.body.events)
//   res.send("/groups")
//   })

router.get("/events/:eventId", (req, res, next) => {
  console.log("couch potato", res);
  const id = req.params.eventId;
  Event.findById(id)
    .populate("user")
    .then((eventFromDB) => {
      const date = eventFromDB.date;
      res.render("events/eventDetails", {
        event: { eventFromDB, date },
      });
    });
});

module.exports = router;
