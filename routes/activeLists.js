const express = require("express");

const activeListsController = require("../controllers/activeLists");

const router = express.Router();

// router.delete("/deleteList/:listId/:userId", activeListsController.deleteList);
// router.put("/editList", activeListsController.putList);
router.get("/getLists/:arr", activeListsController.getLists);
router.post("/postList", activeListsController.postList);

module.exports = router;