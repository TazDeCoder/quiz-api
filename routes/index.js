const express = require("express");

const router = express.Router();

/* GET redirects to api */
router.get("/", function (req, res, next) {
  res.redirect("/api");
});
/* POST request for login */
router.post("/login", indexController.authUser);
/* POST request for signup */
router.post("/signup", indexController.createUser);

module.exports = router;
