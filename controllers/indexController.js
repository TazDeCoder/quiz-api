// Third-party libraries
const jwt = require("jsonwebtoken");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
// Imported models
const User = require("../models/user");

const authUser = [
  passport.authenticate("local", { session: false }),
  (req, res) => {
    req.login(req.user, { session: false }, (err) => {
      if (err) res.sendStatus(400);
      const accessToken = jwt.sign(
        req.user.toJSON(),
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "1h",
        }
      );
      return res.json({ token: accessToken });
    });
  },
];

const createUser = [
  // Validate and sanitise fields
  body("username").trim().isLength({ min: 1 }).escape(),
  body("password").trim().isLength({ min: 1 }).escape(),
  // Process request after validation and sanitization
  (req, res, next) => {
    const errors = validationResult(req);
    // Hash password
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) return next(err);
      // Create user object
      const user = new User({
        username: req.body.username,
        password: hash,
      });
      // Check for any validation errors
      if (!errors.isEmpty()) {
        return res.json({ errors, user });
      } else {
        // Data provided is valid. Save user to database
        user.save((err) => {
          if (err) return next(err);
          return res.sendStatus(201);
        });
      }
    });
  },
];

module.exports = {
  authUser,
  createUser,
};
