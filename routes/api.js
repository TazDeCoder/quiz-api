const express = require("express");
const router = express.Router();

const apiController = require("../controllers/apiController");

router.get("/", apiController.index);
// GET request for quizzes
router.get("/quizzes", apiController.quizData);
// GET request for one Quiz
router.get("/quiz/:id", apiController.quizDetail);
// POST request for creating Quiz
router.post("/quiz", apiController.quizCreate);
// PUT request to update Quiz
router.put("/quiz/:id", apiController.quizUpdate);
// DELETE request to delete Quiz
router.delete("/quiz/:id", apiController.quizDelete);

module.exports = router;
