const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const Event = require("../models/Event");
const Group = require("../models/Group");
const { loginCheck } = require("./middlewares");

router.get("/groups", (req, res, next) => {
  User.findById(req.user._id).populate("group").then(user => {

    // Group.find().then((groupsFromDB) => {
      // console.log("hello:", groupsFromDB);
    res.render("groups/groupsView", { groupsList: user.group });
  })
  // });
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

// TO FIX
// router.get("/groups/:groupId", (req, res, next) => {
//   const id = req.params.groupId;
//   Group.findById(id)
//     .populate("user")
//     .then((groupFromDB) => {
//       const date = groupFromDB.date.toDateString();
//       const user = groupFromDB.user
//       console.log(user);
//       res.render("groups/groupDetails", { group: groupFromDB, date, user});
//     });
// });

router.get("/groups/:groupId", (req, res, next) => {
  console.log(req.params.groupId);
  Group.findById(req.params.groupId)
  .populate("user")
  .then(group => {
    const date = group.date.toDateString();
    console.log(group)
  res.render("groups/groupDetails", { group: group, date});
    });
  })

router.post("/groups", loginCheck(), (req, res) => {
  const { name, user, date } = req.body;
  if (!req.isAuthenticated()) {
    res.redirect("/");
  }
  // console.log(typeof date);
  Group.create({
    name,
    user,
    date,
  })
    .then((group) => {
      User.findByIdAndUpdate(req.user._id, {$push: {group: group._id}}).then(user => console.log(user))
      // console.log;
      console.log(`New group was created: ${group}`);
      // console.log(new Date(date).toDateString());
      Event.find({ date: new Date(date).toDateString() }).then((res) => {
        console.log(res, "RES")
        const events = res.map((elem) => {
          console.log("this is the elem:", elem);
          return { events: elem._id, name: elem.name, votes: 0 };
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
    User.findById(req.user._id).populate("group").then(user => {
      let groupDate = user.group.find(group => group._id == req.params.groupId).date
      console.log(groupDate, "group")
      Event.find({ date: new Date(groupDate).toDateString() }).then((eventsFromDB) => {
        
        
        // Event.find().then((eventsFromDB) => {
          // console.log("hello:", eventsFromDB);
          res.render("events/eventsView", { eventsList: eventsFromDB, groupId:req.params.groupId });
        });
      })
});


router.post("/groups/:groupId", (req, res, next) => {
  console.log(req.body)
const eventId = req.body.events;
const groupId = req.params.groupId;
// const id = req.body;
Group.findByIdAndUpdate(groupId, { $push: { events: eventId}}, {new: true}).then(group => {
  let votes = {}
  console.log(group)
  group.events.forEach(eventID => {
    if(votes[eventID]) {
      votes[eventID] +=1
    } else {
      votes[eventID] = 1
    }
  })
  const highestVote = Math.max(...Object.values(votes))
  console.log('these are the highest votes',highestVote)

  res.redirect(`/groups/${groupId}`)


}).catch(err => console.log(err))

})





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
