const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const Event = require("../models/Event");
const Group = require("../models/Group");
const { loginCheck } = require("./middlewares");

router.get("/groups", (req, res, next) => {
  Group.find().then((groupsFromDB) => {
    console.log("hello:", groupsFromDB);
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
      console.log(groupFromDB);
      res.render("groups/groupDetails", { group: groupFromDB });
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
      console.log(`New group was created: ${group}`);
      res.redirect("/groups");
    })
    .catch((err) => {
      console.log("There was an error: ", err);
    });
});

router.get("/events", (req, res, next) => {
  Event.find().then((eventsFromDB) => {
    console.log("hello:", eventsFromDB);
    res.render("events/eventsView", { eventsList: eventsFromDB });
  });
});

module.exports = router;
