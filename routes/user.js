const express = require("express");

const userController = require("../controllers/user");

const router = express.Router();

router.put("/activateList", userController.activateList);
router.put("/deactivateList", userController.deactivateList);
router.get("/login/:username", userController.login);
router.post("/signup", userController.signup);

module.exports = router;
