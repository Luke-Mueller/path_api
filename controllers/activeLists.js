const ActiveList = require("../models/ActiveList");
const User = require("../models/User");

exports.getLists = async (req, res, next) => {
  const arr = req.params.arr.split(",");

  if (arr[0] === "none") {
    return res.status(200).json({
      lists: [],
      message: "Lists retrieved successfully!",
      ok: true,
    });
  }

  try {
    const lists = await ActiveList.find().where("_id").in(arr);
    if (lists) {
      res.status(200).json({
        lists: lists,
        message: "Lists retrieved successfully!",
        ok: true,
      });
    } else {
      const error = new Error();
      error.message = "This user has no lists.";
      error.statusCode = 404;
      error.title = "No lists found...";
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

exports.postList = async (req, res, next) => {
  const list = req.body.list;
  const userId = req.body.userId;

  try {
    // add 'done' property to each list item and subList item
    const newItems = list.items.map((listItem) => {
      listItem.done = false;
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
      };
    });

    // create new ActiveList and get _id
    const newList = new ActiveList({
      items: newItems,
      name: list.name,
      parentId: list._id,
      progress: 0,
    });

    const savedList = await newList.save();

    // findbyid user and push _id to user.activeLists
    try {
      const user = await User.findById(userId);
      user.activeLists.push(savedList._id);
      try {
        const savedUser = await user.save();
        // send res with new list and user
        res.status(201).json({
          message: "List successfully activated!",
          list: savedList,
          user: savedUser,
          ok: true,
        });
      } catch (error) {
        error.message = "Error saving user after activating list.";
        error.title = "User not saved...";
        next(error);
      }
    } catch (error) {
      error.message =
        "The user trying to activate the list was not found in the database.";
      error.title = "User not found...";
      next(error);
    }
  } catch (error) {
    next(error);
  }
};
