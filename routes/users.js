var express = require("express");
var router = express.Router();
require("../models/connection");
const User = require("../models/user");
const { checkBody } = require("../modules/checkbody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");


//route pour se signup
router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ["firstname", "username", "password"])) {
    res.json({
      result: false,
      error: "remplis les champs obligatoires avant de cliquer sur sign up",
    });
    return;
  }

  User.findOne({
    firstname: req.body.firstname,
    username: req.body.username,
  }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        firstname: req.body.firstname,
        username: req.body.username,
        password: hash,
        token: uid2(32),
      });

      newUser.save().then((user) => {
        res.json({ result: true, user: user });
      });
    } else {
      res.json({ result: false, error: "tu es déjà inscrit!" });
    }
  });
});

//route pour se sign in
router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["username", "password"])) {
    res.json({ result: false, error: "faut remplir les espaces vides" });
    return;
  }

  User.findOne({ username: req.body.username }).then((data) => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, user: {token: data.token,firstname: data.firstname }});
    } else {
      res.json({ result: false, error: "essaie encore" });
    }
  });
});

module.exports = router;
