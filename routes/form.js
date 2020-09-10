const express = require("express");
const router = express.Router();
const { contactForm } = require("../controllers/form");
const { contactFormValidator, result } = require("../validator");

router.post("/contact", contactFormValidator, result, contactForm);

module.exports = router;
