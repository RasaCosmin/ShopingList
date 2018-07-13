const passportJWT = require("passport-jwt");
const keys = require("./keys");
const mongoose = require("mongoose");
const User = mongoose.model("users");

const JwtStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = keys.secret;

const strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
  User.findById(jwt_payload.id)
    .then(user => {
      if (user) {
        return next(null, user);
      } else {
        return next(null, false);
      }
    })
    .catch(err => console.log(err));
});

module.exports = passport => passport.use(strategy);
