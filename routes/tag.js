const express = require("express");
const router = express.Router();
const { requireSignin, adminMiddleware } = require("../controllers/auth");
const { tagValidator, result } = require("../validator");
const {
  create,
  list,
  read,
  remove,
  findTagSlug,
} = require("../controllers/tag");

router.post(
  "/tag",
  tagValidator,
  result,
  requireSignin,
  adminMiddleware,
  create,
  read
);
router.get("/tags", list);
router.get("/tag/:slug", read);
router.delete("/tag/:slug", requireSignin, adminMiddleware, remove);

router.param("slug", findTagSlug);

module.exports = router;
