const { validationResult, check } = require("express-validator");

const signupValidator = [
  check("name").trim().not().isEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Email is invalid"),
  check("password")
    .exists()
    .withMessage("Password should not be empty")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/\d/)
    .withMessage("Password must have at least one number"),
];

const categoryValidator = [
  check("name").trim().not().isEmpty().withMessage("Name is required"),
];

const tagValidator = [
  check("name").trim().not().isEmpty().withMessage("Name is required"),
];

const contactFormValidator = [
  check("name").trim().not().isEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Email is invalid"),
  check("message")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Message must be at least 20 characters"),
];

const forgotPasswordValidator = [
  check("email").isEmail().withMessage("Email is invalid"),
];

const resetPasswordValidator = [
  check("password")
    .exists()
    .withMessage("Password should not be empty")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/\d/)
    .withMessage("Password must have at least one number"),
];

const result = (req, res, next) => {
  const result = validationResult(req);
  const hasError = !result.isEmpty();

  if (hasError) {
    const error = result.array()[0].msg;
    res.status(400);
    next(error);
  } else {
    next();
  }
};

module.exports = {
  signupValidator,
  categoryValidator,
  tagValidator,
  contactFormValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  result,
};
