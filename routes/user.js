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

router.get("/user/profile", requireSignin, authMiddleware, read);
router.put("/user/profile", requireSignin, authMiddleware, update);
// /user/update

router.get("/user/:username", publicProfile);

router.get("/user/photo/:username", photo);

router.param("username", findUser);

module.exports = router;
