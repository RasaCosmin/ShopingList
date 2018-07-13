const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

//load user model
const User = require("../../models/User");

//@route GET /api/users/test
//@desc test route
//@access Public
router.get("/test", (req, res) => res.json({ msg: "test" }));

//@route Post /api/users/register
//@desc Register route
//@access Public
router.post("/users/register", (req, res) => {
  console.log(req.body);
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ userExist: "This Email is allready used" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;

          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//@route Post api/users/login
router.post("/users/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then(user => {
    if (!user) {
      res.status(404).json({ email: "no user" });
    } else {
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          const payload = {
            id: user.id,
            name: user.name,
            email: user.email
          };
          jwt.sign(payload, keys.secret, (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          });
        } else {
          res.status(400).json({ password: "Password incorrect" });
        }
      });
    }
  });
});

//@route GET /api/users/search/:search
//@desc Find users which contains {search} route
//@access Public
router.get(
  "/search/:search",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.find({
      name: { $regex: req.params.search, $options: "i" },
      email: { $regex: req.params.search, $options: "i" }
    }).then(users => {
      if (!users.length > 0) {
        res.status(400).json({ noProfile: "We can't find any profile" });
      } else {
        const us = users.map(u => {
          const minUser = {
            _id: u._id,
            name: u.name,
            email: u.email
          };
          return minUser;
        });
        res.json(us);
      }
    });
  }
);

//@route

module.exports = router;
