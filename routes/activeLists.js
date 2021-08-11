const express = require("express");

const activeListsController = require("../controllers/activeLists");

const router = express.Router();

router.get("/getLists/:arr", activeListsController.getLists);
router.post("/postList", activeListsController.postList);

module.exports = router;