const express = require("express");
const router = express.Router();
const {
  requireSignin,
  authMiddleware,
  adminMiddleware,
  canUpdateDeleteBlog,
} = require("../controllers/auth");
const {
  list,
  listAllBlogsCategoriesTags,
  create,
  read,
  remove,
  update,
  photo,
  findBlogBySlug,
  findBlogsByUser,
  listRelated,
  listSearch,
  listByUser,
} = require("../controllers/blog");

router.post("/blog", requireSignin, adminMiddleware, create);
router.get("/blogs", list);
router.post("/blogs-categories-tags", listAllBlogsCategoriesTags);
router.get("/blog/:slug", read);
router.delete("/blog/:slug", requireSignin, adminMiddleware, remove);
router.put("/blog/:slug", requireSignin, adminMiddleware, update);
router.get("/blog/photo/:slug", photo);
router.post("/blogs/related", listRelated);
router.get("/blogs/search", listSearch);

//auth user blog crud
router.post("/user/blog", requireSignin, authMiddleware, create);
router.get("/:username/blogs", listByUser);
router.delete(
  "/user/blog/:slug",
  requireSignin,
  authMiddleware,
  canUpdateDeleteBlog,
  remove
);
router.put(
  "/user/blog/:slug",
  requireSignin,
  authMiddleware,
  canUpdateDeleteBlog,
  update
);

router.param("slug", findBlogBySlug);
router.param("username", findBlogsByUser);

module.exports = router;
