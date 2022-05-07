const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");
const helmet = require("helmet");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const apiRouter = require("./routes/api");

const app = express();

const DEV_DB_URI = "mongodb://localhost:27017/testdb-quiz";

// Set up mongoose connection
const mongoDB = process.env.MONGODB_URI || DEV_DB_URI;
mongoose.connect(mongoDB);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Add passport middleware
require("./passport");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(helmet());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.append("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api", apiRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Render error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
