const express = require("express");

const userController = require("../controllers/user");

const router = express.Router();

router.get("/login/:username", userController.login);
router.post("/signup", userController.signup);
router.put("/restoreList", userController.restoreList);

module.exports = router;
