const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const User = require("./models/user");

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, function (err, user) {
      if (err) return done(err);
      if (!user)
        return done(null, false, {
          message: "Incorrect username",
        });
      if (user.password !== password)
        return done(null, false, { message: "Incorrect password" });
      return done(null, user, { message: "Logged In Successfully" });
    });
  })
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "secretkey",
    },
    (jwtPayload, done) => {
      User.findById(jwtPayload._id, function (err, user) {
        if (err) return done(err);
        return done(null, user);
      });
    }
  )
);
