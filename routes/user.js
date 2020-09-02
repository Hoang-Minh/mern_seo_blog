const express = require("express");
const router = express.Router();
const {
  requireSignin,
  authMiddleware,
  adminMiddleware,
} = require("../controllers/auth");
const { read, publicProfile, findUser } = require("../controllers/user");

router.get("/profile", requireSignin, authMiddleware, read);
router.get("/user/:username", publicProfile);

router.param("username", findUser);

module.exports = router;
