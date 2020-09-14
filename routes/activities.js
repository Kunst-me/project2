const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const Event = require("../models/Event");
const Group = require("../models/Group");

router.get("/groups", (req, res, next) => {
  res.render("groups/groupsView");
});

router.get("/groups/add", (req, res) => {
  res.render("groups/add");
});

router.post("/groups", (req, res) => {
  const { name, user, event, date } = req.body;
  Group.create({
    name,
    user,
    event,
    date,
  })
    .then((group) => {
      console.log(`New group was created: ${group}`);
      res.render("groups/groupsView");
    })
    .catch((err) => {
      console.log("There was an error: ", error);
    });
});

module.exports = router;
