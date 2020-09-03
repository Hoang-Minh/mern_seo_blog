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

router.get("/profile", requireSignin, authMiddleware, read);
router.get("/user/:username", publicProfile);
router.put("/user/update/:username", requireSignin, authMiddleware, update);
router.get("/user/photo/:username", photo);

router.param("username", findUser);

module.exports = router;
