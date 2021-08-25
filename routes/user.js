const express = require("express");

const userController = require("../controllers/user");

const router = express.Router();

router.delete("/delete", userController.deleteUser);
router.get("/login/:username", userController.login);
router.post("/signup", userController.signup);
router.put("/restoreList", userController.restoreList);
router.put("/sendList", userController.sendList);

module.exports = router;
