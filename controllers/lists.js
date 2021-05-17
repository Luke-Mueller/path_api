const List = require("../models/List");

exports.activateList = async (req, res, next) => {

}

exports.archiveList = async (req, res, next) => {
  const listId = req.body.list._id;
  const userId = req.body.userId;
  const arcOwnerIds = req.body.list.arcOwnerIds;
  const ownerIds = req.body.list.ownerIds.filter((id) => id !== userId);

  try {
    arcOwnerIds.push(userId);
    const list = await List.findOneAndUpdate(
      { _id: listId },
      { arcOwnerIds: arcOwnerIds, ownerIds: ownerIds }
    );
    if (!list) {
      const error = new Error();
      error.message = "The list you are trying to archive does not exist.";
      error.statusCode = 404;
      error.title = "No list found...";
      throw error;
    } else {
      res.status(200).json({
        message: `${list.name} has been archived successfully!`,
        ok: true,
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.deactivateList = async (req, res, next) => {
  
}

exports.deleteList = async (req, res, next) => {
  const listId = req.params.listId;
  const userId = req.params.userId;
  try {
    const list = await List.findById(listId);
    if (!list) {
      const error = new Error();
      error.message = "The list you are looking for does not exist.";
      error.statusCode = 404;
      error.title = "No list found...";
      throw error;
    }
    if (list.ownerIds.length > 1 || list.arcOwnerIds.length > 1) {
      const arcOwnerIds = list.arcOwnerIds.filter((id) => id !== userId);
      const ownerIds = list.ownerIds.filter((id) => id !== userId);
      list.arcOwnerIds = arcOwnerIds;
      list.ownerIds = ownerIds;
      list.save();
      res
        .status(200)
        .json({ message: `${list.name} was deleted successfully!`, ok: true });
    } else {
      const result = await List.deleteOne({ _id: listId });
      if (result.ok) {
        res.status(200).json({
          message: `${list.name} was deleted successfully!`,
          ok: true,
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

exports.getLists = async (req, res, next) => {
  const userId = req.params.userId;
  const arr = req.params.arr;
  try {
    const lists = await List.find().where(arr).in([userId]);
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
  const list = new List({
    arcOwnerIds: [],
    items: req.body.list.items,
    name: req.body.list.name,
    ownerIds: [req.body.userId],
  });

  try {
    const savedList = await list.save();
    res.status(201).json({
      list: savedList,
      message: `${savedList.name} was created successfully!`,
      ok: true,
    });
  } catch (error) {
    console.log("POSTLIST ERROR: ", error.message)
    error.message = "Our server was not able to create the list.  Please try again later."
    error.statusCode = 404;
    error.title = "List not created..."
    next(error);
  }
};

exports.putList = async (req, res, next) => {
  const reqList = req.body;
  try {
    const list = await List.findOneAndReplace({ _id: reqList._id }, reqList);
    if (!list) {
      const error = new Error();
      error.message = "The list you are trying to edit does not exist.";
      error.statusCode = 404;
      error.title = "No list found...";
      throw error;
    }
    res.status(200).json({
      list: list,
      message: `${list.name} was updated successfully!`,
      ok: true,
    });
  } catch (error) {
    next(error);
  }
};
