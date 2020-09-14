const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const Event = require("../models/Event");
const Group = require("../models/Group");

router.get("/groups", (req, res, next) => {
  res.render("groups/groupsView");
});

router.get("/groups/:groupId", (req, res, next) => {
  const id = req.params.groupId;
  Group.findById(id).then((groupFromDB) => {
    console.log(groupFromDB);
    res.render("groups/groupDetails", { group: groupFromDB });
  });
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
    })
    .catch((err) => {
      console.log(error);
    });
});

module.exports = router;
