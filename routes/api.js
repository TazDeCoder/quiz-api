const express = require("express");
const passport = require("passport");

const router = express.Router();

const apiController = require("../controllers/apiController");

router.get("/", apiController.index);
// GET request for quizzes
router.get("/quizzes", apiController.quizData);
// GET request for one Quiz
router.get("/quiz/:id", apiController.quizDetail);
// POST request for creating Quiz
router.post(
  "/quiz",
  passport.authenticate("jwt", { session: false }),
  apiController.quizCreate
);
// PUT request to update Quiz
router.put(
  "/quiz/:id",
  passport.authenticate("jwt", { session: false }),
  apiController.quizUpdate
);
// DELETE request to delete Quiz
router.delete(
  "/quiz/:id",
  passport.authenticate("jwt", { session: false }),
  apiController.quizDelete
);

module.exports = router;
