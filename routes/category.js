const express = require("express");
const router = express.Router();
const { requireSignin, adminMiddleware } = require("../controllers/auth");
const { categoryValidator, result } = require("../validator");
const {
  create,
  list,
  read,
  remove,
  findCategorySlug,
} = require("../controllers/category");

router.post(
  "/category",
  categoryValidator,
  requireSignin,
  adminMiddleware,
  create
);

router.get("/categories", list);
router.get("/category/:slug", read);
router.delete("/category/:slug", requireSignin, adminMiddleware, remove);

router.param("slug", findCategorySlug);

module.exports = router;
