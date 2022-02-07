// Third-party libraries
const async = require("async");
const jwt = require("jsonwebtoken");
// Imported models
const User = require("../models/user");

const usersData = function (req, res, next) {
  async.parallel(
    {
      usersCount: function (callback) {
        User.countDocuments({}, callback);
      },
      usersList: function (callback) {
        User.find({}, { username: 1, _id: 0 }, callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      return res.json(results);
    }
  );
};

const userDetail = function (req, res) {
  res.send(req.user);
};

module.exports = {
  usersData,
  userDetail,
};
