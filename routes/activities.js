const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const Event = require("../models/Event");
const Group = require("../models/Group");
const { loginCheck } = require("./middlewares");

router.get("/groups", (req, res, next) => {
  User.findById(req.user._id)
    .populate("group user")
    .then((user) => {
      res.render("groups/groupsView", { groupsList: user.group });
    });
});

router.get("/events", (req, res, next) => {
  Event.find().then((events) => {
    res.render("events/viewAllEvents", { eventsList: events });
  });
});

router.get("/groups/add", (req, res, next) => {
  User.find()
    .then((usersFromDB) => {
      res.render("groups/add", { users: usersFromDB });
    })
    .catch((error) => {
      next(error);
    });
});
router.get("/groups/:groupId", (req, res, next) => {
  const id = req.params.groupId;
  Group.findById(id)
    .populate("user.User")
    .then((groupFromDB) => {
      const date = groupFromDB.date.toDateString();
      res.render("groups/groupDetails", { group: groupFromDB, date });
    });
});

router.post("/groups", loginCheck(), (req, res) => {
  const { name, user, date } = req.body;
  if (!req.isAuthenticated()) {
    res.redirect("/");
  }
  Group.create({
    name,
    user,
    date,
  })
    .then((group) => {
      User.findByIdAndUpdate(req.user._id, {
        $push: { group: group._id },
      }).then((user) => console.log(user));
      console.log(`New group was created: ${group}`);
      Event.find({ date: new Date(date).toDateString() }).then((res) => {
        const events = res.map((elem) => {
          return { events: elem._id, name: elem.name, votes: 0 };
        });
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
  User.findById(req.user._id)
    .populate("group")
    .then((user) => {
      let groupDate = user.group.find(
        (group) => group._id == req.params.groupId
      ).date;
      console.log(groupDate, "group");
      Event.find({ date: new Date(groupDate).toDateString() }).then(
        (eventsFromDB) => {
          res.render("events/eventsView", {
            eventsList: eventsFromDB,
            groupId: req.params.groupId,
          });
        }
      );
    });
});
router.post("/groups/:groupId", (req, res, next) => {
  console.log(req.body);
  const eventId = req.body.events;
  const groupId = req.params.groupId;
  // const id = req.body;
  Group.findByIdAndUpdate(
    groupId,
    { $push: { events: eventId } },
    { new: true }
  )
    .then((group) => {
      let votes = {};
      console.log(group);
      group.events.forEach((eventID) => {
        if (votes[eventID]) {
          votes[eventID] += 1;
        } else {
          votes[eventID] = 1;
        }
      });
      function returnHighestVote(votes) {
        let arrayVotes = Object.entries(votes);
        let max = [];
        let maax = 0;
        for (let i = 0; i < arrayVotes.length; i++) {
          for (let j = 0; j < arrayVotes[i].length; j++) {
            if (arrayVotes[i][1] > maax) {
              maax = arrayVotes[i][1];
              max = arrayVotes[i];
            }
          }
        }
        return max;
      }
      console.log("these are the votes:", votes);
      console.log("highest vote function", returnHighestVote(votes));
      console.log("this is the group user:", group.user.length);
      Event.findById(returnHighestVote(votes)[0])
        .populate("user")
        .then((eventFromDB) => {
          const date = eventFromDB.date;
          res.render("events/eventDetails", {
            event: { eventFromDB, date },
          });
        });
    })
    .catch((err) => console.log(err));
});

router.get("/events/add", (req, res, next) => {
  Event.find()
    .then((eventsFromDB) => {
      res.render("events/add", { events: eventsFromDB });
    })
    .catch((error) => {
      next(error);
    });
});

router.post("/events", loginCheck(), (req, res) => {
  const {
    name,
    description,
    time,
    date,
    duration,
    location,
    numParticipants,
    price,
  } = req.body;
  if (!req.isAuthenticated()) {
    res.redirect("/");
  }
  Event.create({
    name,
    description,
    time,
    date,
    duration,
    location,
    numParticipants,
    price,
  })
    .then((event) => {
      console.log(event);
      event.date = event;
      // Group.find({ date: new Date(date).toDateString() }).then((res) => {
      //   const events = res.map((elem) => {
      //     return { events: elem._id, name: elem.name, votes: 0 };
      //   });
      //   Group.findByIdAndUpdate(group._id, { events: events })
      //     .then((some) => console.log("this is the some", some))
      //     .catch((err) => console.log(err));
      // });
      res.redirect("/events");
    })
    .catch((err) => {
      console.log("There was an error: ", err);
    });
});

router.get("/events/:eventId", (req, res, next) => {
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
