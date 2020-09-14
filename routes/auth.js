const express = require("express");
const router = express.Router();
const {
  signupValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  result,
} = require("../validator");
const {
  signup,
  signin,
  signout,
  forgotPassword,
  resetPassword,
  preSignup,
} = require("../controllers/auth");

router.post("/pre-signup", signupValidator, result, preSignup);
router.post("/signup", signupValidator, result, signup);
router.post("/signin", signin);
router.get("/signout", signout);
router.put("/forgot-password", forgotPasswordValidator, result, forgotPassword);
router.put("/reset-password", resetPasswordValidator, result, resetPassword);

module.exports = router;
