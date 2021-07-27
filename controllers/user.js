const User = require("../models/User");

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (user) {
      res.status(200).json({
        message: "User retrieved successfully!",
        user: user,
      });
    } else {
      const error = new Error();
      error.message = "No user with that name was found.";
      error.statusCode = 404;
      error.title = "This is awkward...";
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

exports.signup = async (req, res, next) => {
  const existingUser = await User.findOne({ username: req.body.username });
  if (!existingUser) {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });
    try {
      const savedUser = await user.save();
      res.status(201).json({
        message: "User created successfully!",
        user: savedUser,
      });
    } catch (error) {
      next(error);
    }
  } else {
    const error = new Error();
    error.message = "Another user already has that username.";
    error.statusCode = 409;
    error.title = "You snooze, you lose...";
    next(error);
  }
};
