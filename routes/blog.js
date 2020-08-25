const express = require("express");
const router = express.Router();
const { test } = require("../controllers/blog");

router.get("/", test);

module.exports = router;
