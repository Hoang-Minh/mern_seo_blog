const express = require("express");
const router = express.Router();
const { signupValidator, result } = require("../validator");
const {
  signup,
  signin,
  requireSignin,
  signout,
} = require("../controllers/auth");

router.post("/signup", signupValidator, result, signup);
router.post("/signin", signin);
router.get("/signout", signout);

module.exports = router;
