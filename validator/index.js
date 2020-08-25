const { validationResult, check } = require("express-validator");
const { rest } = require("lodash");

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

const result = (req, res, next) => {
  const result = validationResult(req);
  const hasError = !result.isEmpty();

  console.log("result", hasError);

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
  result,
};
