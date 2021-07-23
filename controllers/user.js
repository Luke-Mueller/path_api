const User = require("../models/User");

exports.activateList = async (req, res, next) => {
  const list = req.body.list;
  const userId = req.body.userId;

  try {
    const user = await User.findById(userId);
    if (user) {
      if (!user.activeLists.find((el) => el._id.toString() === list._id)) {
        const newItems = list.items.map((listItem) => {
          if (listItem.itemType === "sublist") {
            const newSubItems = listItem.subItems.map((subItem) => {
              return {
                item: subItem,
                done: false,
              };
            });
            listItem.subItems = newSubItems;
          }
          return {
            ...listItem,
            done: false,
          };
        });
        const newActiveList = {
          _id: list._id,
          items: newItems,
          progress: 0,
        };
        user.activeLists.push(newActiveList);
        const savedUser = await user.save();
        res.status(200).json({
          message: "The list was added to active lists successfully!",
          user: savedUser,
        });
      }
    } else {
      const error = new Error();
      error.message = "The user trying to start a list does not exist.";
      error.statusCode = 404;
      error.title = "No user found...";
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

exports.deactivateList = async (req, res, next) => {};

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
