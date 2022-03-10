const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const apiRouter = require("./routes/api");

require("dotenv").config();

const app = express();

// Set up mongoose connection
const mongoDB = process.env.DB_URL;
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
