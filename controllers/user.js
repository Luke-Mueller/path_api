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

exports.restoreList = async (req, res, next) => {
  const listId = req.body.listId;
  const userId = req.body.userId;

  try {
    const user = await User.findById(userId);
  
    // remove listId from user.archivedLists
    const newArchivedLists = user.archivedLists.filter(
      (list) => list._id.toString() !== listId.toString()
    );
    user.archivedLists = newArchivedLists;
  
    // push listId to user.myLists
    const newMyLists = [...user.myLists];
    newMyLists.push(listId);
    user.myLists = newMyLists;
  
    // save user
    const returnedUser = await user.save();
    // return user in res
    res.status(200).json({
      message: "List retored!",
      user: returnedUser,
    });
  } catch (error) {
    next(error)
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
