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
    Event.find().then((eventsFromDB) => {
    console.log("hello:", eventsFromDB);
    res.render("events/eventsView", { eventsList: eventsFromDB, groupId:req.params.groupId });
  });
});


router.post("/groups/:groupId", (req, res, next) => {
const eventId = req.body.events;
const groupId = req.params.groupId;
// const id = req.body;
Group.findByIdAndUpdate(groupId, { $push: { events: eventId}}, {new: true}).then(group => {
  let votes = {}
  group.events.forEach(eventID => {
    if(votes[eventID]) {
      votes[eventID] +=1
    } else {
      votes[eventID] = 1
    }
  })
  // const sorVote = votes.sort()
  // console.log(sorVote)
  res.redirect(`/groups/${groupId}/events`)
}).catch(err => console.log(err))
// Group.findByIdAndUpdate({_id:req.body.events})
// .then (events.votes => { return  {events.votes++}};
// console.log(events.votes)
// )
// console.log(id)
// console.log(voted)
// res.send("/groups")
})


// router.post('/groups/:groupId', function (req, res) {
//   Event.collection('groupEvents').save(req.body, function (err, result) {
//     if (err) return console.log(err);
//     console.log('saved to database');
//     res.redirect('/');
//   });
// });




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
