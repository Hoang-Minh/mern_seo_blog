const User = require("../models/user");
const Blog = require("../models/blog");
const shortId = require("shortid");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const keys = require("../config/keys");

exports.signup = async (req, res) => {
  console.log("controller signup", req.body.email);
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      console.log("user exist, sending eror");
      return res.status(400).json({ error: "Email is taken" });
    }

    const { name, email, password } = req.body;
    const username = shortId.generate();
    console.log("username", username);

    const profile = `${keys.CLIENT_URL}/profile/${username}`;
    const newUer = new User({ name, email, password, profile, username });
    await newUer.save();
    res.json({ message: "Signup success! Please sign in" });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email" });

    if (!user.authenticate(password)) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ _id: user._id }, keys.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, { expiresIn: "1d" });

    const { _id, name, username, role } = user;
    res.json({ token, user: { _id, name, username, email, role } });
  } catch (error) {
    console.log(error);
  }
};

exports.requireSignin = expressJwt({
  secret: keys.JWT_SECRET,
  algorithms: ["HS256"], // added later
  userProperty: "auth",
});

exports.authMiddleware = async (req, res, next) => {
  try {
    const authUserId = req.auth._id;
    const user = await User.findById(authUserId);
    if (!user) return res.status(400).json({ error: "User not found" });

    req.profile = user;
    next();
  } catch (error) {
    console.log(error);
  }
};

exports.adminMiddleware = async (req, res, next) => {
  console.log("admin middleware");
  try {
    const adminUserId = req.auth._id;
    const user = await User.findById(adminUserId);
    if (!user) return res.status(400).json({ error: "Admin user not found" });

    if (user.role !== 1)
      return res.status(400).json({ error: "Admin resource. Access denied" });

    req.profile = user;
    next();
  } catch (error) {
    console.log(error);
  }
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Signout successfully" });
};

exports.canUpdateDeleteBlog = async (req, res, next) => {
  try {
    const slug = req.params.slug.toLowerCase();
    const blog = await Blog.findOne({ slug });

    const authorizedUser =
      blog.postedBy._id.toString() === req.profile._id.toString();

    if (!authorizedUser) {
      res.status(400);
      next({ error: "You are not authorized" });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
