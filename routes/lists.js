const express = require("express");

const listsController = require("../controllers/lists");

const router = express.Router();

router.put("/archiveList", listsController.archiveList);
router.delete("/deleteList/:listId/:userId/:arr", listsController.deleteList);
router.put("/editList", listsController.putList);
router.get("/getLists/:arr", listsController.getLists);
router.post("/postList", listsController.postList);

module.exports = router;
