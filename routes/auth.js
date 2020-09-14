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
  googleLogin,
} = require("../controllers/auth");

router.post("/pre-signup", signupValidator, result, preSignup);
router.post("/signup", signup);
router.post("/signin", signin);
router.get("/signout", signout);
router.put("/forgot-password", forgotPasswordValidator, result, forgotPassword);
router.put("/reset-password", resetPasswordValidator, result, resetPassword);

//google login
router.post("/google-login", googleLogin);

module.exports = router;
