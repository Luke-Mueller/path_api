const ActiveList = require("../models/ActiveList");
const List = require("../models/List");
const User = require("../models/User");

exports.acceptList = async (req, res, next) => {
  const listId = req.body.listId;
  const userId = req.body.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error();
      error.message = "No user with that name was found.";
      error.statusCode = 404;
      error.title = "This is awkward...";
      next(error);
    }
    const list = await List.findById(listId);
    if (!list) {
      const error = new Error();
      error.message =
        "No list was found. Likely, it was deleted by the sender before it was accepted.";
      error.statusCode = 404;
      error.title = "No list found...";
      next(error);
    }

    const newMyLists = user.myLists;
    newMyLists.push(listId);

    const newInviteLists = user.inviteLists.filter(
      (list) => list._id.toString() !== listId.toString()
    );

    user.inviteLists = newInviteLists;
    const savedUser = await user.save();

    const newOwnerIds = list.ownerIds;
    newOwnerIds.push(userId);

    list.ownerIds = newOwnerIds;

    await list.save();

    res.status(200).json({
      message: `You add ${list.name} to your lists.`,
      user: savedUser,
    });
  } catch (error) {
    next(error);
  }
};

exports.declineList = async (req, res, next) => {
  const listId = req.body.listId;
  const userId = req.body.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error();
      error.message = "No user with that name was found.";
      error.statusCode = 404;
      error.title = "This is awkward...";
      next(error);
    }
    const newInviteLists = user.inviteLists.filter(
      (list) => list._id.toString() !== listId.toString()
    );
    user.inviteLists = newInviteLists;
    const savedUser = await user.save();
    res.status(200).json({
      message: "List declined",
      user: savedUser,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  const activeArr = req.params.activeArr.split(",");
  const archivedArr = req.params.archivedArr.split(",");
  const listArr = req.params.listArr.split(",");
  const userId = req.params.userId;

  try {
    if (activeArr[0] !== "none") {
      const activeLists = await ActiveList.find().where("_id").in(activeArr);
      for (const list of activeLists) {
        if (list.ownerIds.length > 1) {
          const newOwnerIds = list.ownerIds.filter(
            (id) => id.toString() !== userId.toString()
          );
          list.ownerIds = newOwnerIds;
          await list.save();
        } else {
          await ActiveList.findByIdAndDelete(list._id);
        }
      }
    }
    let myLists = [];
    let archivedLists = [];
    if (listArr[0] !== "none")
      myLists = await List.find().where("_id").in(listArr);
    if (archivedArr[0] !== "none")
      archivedLists = await List.find().where("_id").in(archivedArr);
    const lists = [...myLists, ...archivedLists];
    for (const list of lists) {
      if (list.ownerIds.length > 1) {
        const newOwnerIds = list.ownerIds.filter(
          (id) => id.toString() !== userId.toString()
        );
        list.ownerIds = newOwnerIds;
        await list.save();
      } else {
        await List.findByIdAndDelete(list._id);
      }
    }
    await User.findByIdAndDelete(userId);
    res.status(200).json({
      message: "User deleted successfully!",
      done: true,
    });
  } catch (error) {
    next(error);
  }
};

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
    const newArchivedLists = user.archivedLists.filter(
      (list) => list._id.toString() !== listId.toString()
    );

    user.archivedLists = newArchivedLists;

    const newMyLists = [...user.myLists];
    newMyLists.push(listId);
    user.myLists = newMyLists;

    const returnedUser = await user.save();
    res.status(200).json({
      message: "List restored!",
      user: returnedUser,
    });
  } catch (error) {
    next(error);
  }
};

exports.sendList = async (req, res, next) => {
  const listId = req.body.listId;
  const username = req.body.username;

  try {
    const existingUser = await User.findOne({ username: username });
    if (!existingUser) {
      const error = new Error();
      error.message = "No user with that name was found.";
      error.statusCode = 404;
      error.title = "This is awkward...";
      next(error);
    } else {
      const newInviteLists = existingUser.inviteLists;
      newInviteLists.push(listId);
      existingUser.inviteLists = newInviteLists;
      await existingUser.save();
      res.status(200).json({
        message: "List sent!",
        done: true,
      });
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
