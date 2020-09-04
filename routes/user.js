const express = require("express");
const router = express.Router();
const {
  requireSignin,
  authMiddleware,
  adminMiddleware,
} = require("../controllers/auth");
const {
  read,
  publicProfile,
  findUser,
  update,
  photo,
} = require("../controllers/user");

router.get("/user/profile", requireSignin, authMiddleware, read); // view in order to update
router.put("/user/profile", requireSignin, authMiddleware, update);
router.get("/user/photo/:username", photo);
router.get("/user/:username", publicProfile); // view profile - without modification

router.param("username", findUser);

module.exports = router;
