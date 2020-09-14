const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const Event = require("../models/Event");
const Group = require("../models/Group");

router.get("/groups", (req, res, next) => {
  Group.find().then((groupsFromDB) => {
    console.log("hello:", groupsFromDB);
    res.render("groups/groupsView", { groupsList: groupsFromDB });
  });
});

router.get("/groups/add", (req, res, next) => {
  console.log("happiness");
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

router.post("/groups", (req, res) => {
  const { name, user, date } = req.body;
  Group.create({
    name,
    user,
    date,
  })
    .then((group) => {
      console.log(`New group was created: ${group}`);
      res.render("groups/groupsView");
    })
    .catch((err) => {
      console.log("There was an error: ", err);
    });
});

module.exports = router;
