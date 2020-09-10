const express = require("express");
const router = express.Router();
const { contactForm, contactBlogAuthorForm } = require("../controllers/form");
const { contactFormValidator, result } = require("../validator");

router.post("/contact", contactFormValidator, result, contactForm);
router.post(
  "/contact-blog-author",
  contactFormValidator,
  result,
  contactBlogAuthorForm
);

module.exports = router;
