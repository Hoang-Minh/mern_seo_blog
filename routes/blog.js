const express = require("express");
const router = express.Router();
const {
  requireSignin,
  authMiddleware,
  adminMiddleware,
} = require("../controllers/auth");
const { test, create } = require("../controllers/blog");

router.get("/", test);
router.post("/blog", requireSignin, adminMiddleware, create);

module.exports = router;
