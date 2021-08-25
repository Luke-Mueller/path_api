import { findById, findByIdAndDelete, findOneAndReplace } from "../models/ActiveList";
import List, { findById as _findById, findByIdAndDelete as _findByIdAndDelete, find, findOneAndReplace as _findOneAndReplace } from "../models/List";
import { findById as __findById } from "../models/User";

export async function archiveList(req, res, next) {
  const listId = req.body.listId;
  const userId = req.body.userId;

  try {
    const user = await __findById(userId);
    user.archivedLists.push(listId);
    const newMyLists = user.myLists.filter(
      (list) => list._id.toString() !== listId.toString()
    );
    user.myLists = newMyLists;
    const savedUser = await user.save();
    const list = await _findById(listId);

    res.status(201).json({
      message: "List successfully archived!",
      list,
      user: savedUser,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteList(req, res, next) {
  //    1.  Define vars / find list and user
  const listId = req.params.listId;
  const userId = req.params.userId;
  // "activeLists" : "archivedLists" : "myLists"
  const arr = req.params.arr;

  try {
    let list;
    if (arr === "activeLists") {
      list = await findById(listId);
    } else {
      list = await _findById(listId);
    }
    const user = await __findById(userId);

    let result;
    if (!list) {
      const error = new Error();
      error.message = "The list you are looking for does not exist.";
      error.statusCode = 404;
      error.title = "No list found...";
      throw error;
    }
    //    2.  Remove userId from list if list.ownerIds.length > 1
    if (list.ownerIds.length > 1) {
      const ownerIds = list.ownerIds.filter((id) => id !== userId);
      list.ownerIds = ownerIds;
      result = await list.save();
    } else {
      //    3.  Delete list if list.ownerIds.length !> 1
      result =
        arr === "activeLists"
          ? await findByIdAndDelete(listId)
          : await _findByIdAndDelete(listId);
    }
    //    4.  Remove list from user.myLists
    if (result) {
      let lists;
      if (arr === "activeLists") lists = user.activeLists;
      else if (arr === "archivedLists") lists = user.archivedLists;
      else if (arr === "myLists") lists = user.myLists;
      const newLists = lists.filter(
        (l) => l._id.toString() !== listId.toString()
      );
      user[arr] = newLists;
      const newUser = await user.save();
      //    5.  Return user
      res.status(200).json({
        message: `${list.name} was deleted successfully!`,
        user: newUser,
        ok: true,
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function getLists(req, res, next) {
  const arr = req.params.arr.split(",");

  if (arr[0] === "none") {
    return res.status(200).json({
      lists: [],
      message: "Lists retrieved successfully!",
      ok: true,
    });
  }

  try {
    const lists = await find().where("_id").in(arr);
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
}

export async function postList(req, res, next) {
  const list = new List({
    items: req.body.items,
    name: req.body.name,
    ownerIds: req.body.ownerIds,
  });

  try {
    const savedList = await list.save();
    const user = await __findById(req.body.ownerIds[0]);
    if (savedList && user) {
      user.myLists.push(savedList._id);
      user.save();
      res.status(201).json({
        list: savedList,
        message: `${savedList.name} was created successfully!`,
        ok: true,
      });
    }
  } catch (error) {
    console.log("POSTLIST ERROR: ", error.message);
    error.message =
      "Our server was not able to create the list.  Please try again later.";
    error.statusCode = 404;
    error.title = "List not created...";
    next(error);
  }
}

export async function putList(req, res, next) {
  const { list, listType } = req.body;
  try {
    let result;

    if (listType === "lists") {
      result = await _findOneAndReplace({ _id: list._id }, list, {
        new: true,
      });
    } else if (listType === "activeLists") {
      result = await findOneAndReplace({ _id: list._id }, list, {
        new: true,
      });
    }

    if (!result) {
      const error = new Error();
      error.message = "The list you are trying to edit does not exist.";
      error.statusCode = 404;
      error.title = "No list found...";
      throw error;
    }
    res.status(200).json({
      returnedList: result,
      message: `${result.name} was updated successfully!`,
      ok: true,
    });
  } catch (error) {
    next(error);
  }
}
