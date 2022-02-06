// Third-party libraries
const async = require("async");
const { body, validationResult } = require("express-validator");
// Imported models
const Quiz = require("../models/quiz");

const index = function (req, res) {
  res.render("index", { title: "Quiz API" });
};

const quizData = function (req, res, next) {
  async.parallel(
    {
      quizCount: function (callback) {
        Quiz.countDocuments({}, callback);
      },
      quizList: function (callback) {
        Quiz.find({}, "title", callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      return res.json(results);
    }
  );
};

const quizDetail = function (req, res, next) {
  Quiz.findById(req.params.id, function (err, quiz) {
    if (err) return next(err);
    return res.json(quiz);
  });
};

const quizCreate = [
  (req, res, next) => {
    // Convert the questions to an array
    if (!Array.isArray(req.body.questions)) {
      if (typeof req.body.questions === "undefined") req.body.questions = [];
      else req.body.questions = [req.body.questions];
    }
    // Convert the types to an array
    if (!Array.isArray(req.body.types)) {
      if (typeof req.body.types === "undefined") req.body.types = [];
      else req.body.types = [req.body.types];
    }
    next();
  },
  // Validate and sanitise fields
  body("title")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Title must be specified."),
  body("description")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Description must be specified."),
  body("questions.*.prompt").escape(),
  body("questions.answers.*").escape(),
  body("types.*.title").escape(),
  body("types.*.description").escape(),
  // Process request after validation and sanitization
  (req, res, next) => {
    const errors = validationResult(req);
    // Create quiz object
    const quiz = new Quiz({
      title: req.body.title,
      description: req.body.description,
      questions: req.body.questions,
      types: req.body.types,
      created_by: req.body.created_by,
    });
    // Check for any validation errors
    if (!errors.isEmpty()) {
      return res.sendStatus(400);
    } else {
      // Data provided is valid. Save quiz to database
      quiz.save(function (err) {
        if (err) return next(err);
        return res.sendStatus(201);
      });
    }
  },
];

const quizUpdate = [
  (req, res, next) => {
    // Convert the questions to an array
    if (!Array.isArray(req.body.questions)) {
      if (typeof req.body.questions === "undefined") req.body.questions = [];
      else req.body.questions = [req.body.questions];
    }
    // Convert the types to an array
    if (!Array.isArray(req.body.types)) {
      if (typeof req.body.types === "undefined") req.body.types = [];
      else req.body.types = [req.body.types];
    }
    next();
  },
  // Validate and sanitise fields
  body("title")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Title must be specified."),
  body("description")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Description must be specified."),
  body("questions.*.prompt").escape(),
  body("questions.answers.*").escape(),
  body("types.*.title").escape(),
  body("types.*.description").escape(),
  // Process request after validation and sanitization
  (req, res, next) => {
    const errors = validationResult(req);
    // Create quiz object
    const quiz = new Quiz({
      _id: req.params.id,
      title: req.body.title,
      description: req.body.description,
      questions: req.body.questions,
      types: req.body.types,
    });
    // Check for any validation errors
    if (!errors.isEmpty()) {
      return res.sendStatus(400);
    } else {
      // Data provided is valid. Save quiz to database
      Quiz.findByIdAndUpdate(req.params.id, quiz, {}, function (err) {
        if (err) return next(err);
        return res.sendStatus(200);
      });
    }
  },
];

const quizDelete = function (req, res, next) {
  // Delete quiz from database
  Quiz.findByIdAndDelete(req.params.id, function deleteQuiz(err) {
    if (err) return next(err);
    return res.sendStatus(200);
  });
};

module.exports = {
  index,
  quizData,
  quizDetail,
  quizCreate,
  quizUpdate,
  quizDelete,
};
