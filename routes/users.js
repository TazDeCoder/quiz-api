const express = require("express");
const passport = require("passport");

const router = express.Router();

const usersController = require("../controllers/usersController");

// GET request for Users listing
router.get("/", usersController.usersData);
// GET request for current User profile
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  usersController.userDetail
);

module.exports = router;
