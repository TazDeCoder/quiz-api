const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TypeSchema = new Schema({
  title: String,
  description: String,
});

const AnswerSchema = new Schema({
  text: String,
  types: [String],
});

const QuestionSchema = new Schema({
  prompt: String,
  answers: [
    {
      type: AnswerSchema,
    },
  ],
});

const QuizSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxLength: 64,
  },
  description: {
    type: String,
    required: true,
    maxLength: 128,
  },
  questions: [
    {
      type: QuestionSchema,
      required: true,
    },
  ],
  types: [
    {
      type: TypeSchema,
      required: true,
    },
  ],
  created_by: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Quiz", QuizSchema);
