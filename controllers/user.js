const User = require("../models/user");
const Blog = require("../models/blog");

exports.findUser = async (req, res, next, username) => {
  try {
    const user = await User.findOne({ username });
    req.publicProfile = user;
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.read = (req, res) => {
  req.profile.hashed_password = undefined;
  return res.json(req.profile);
};

exports.publicProfile = async (req, res, next) => {
  try {
    const userId = req.publicProfile._id;
    const blogs = await Blog.find({ postedBy: userId })
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id name")
      .limit(10)
      .select(
        "_id title slug excerpt categories tags postedBy createdAt updatedAt"
      );
    req.publicProfile.hashed_password = undefined;
    req.publicProfile.photo = undefined;
    res.json({ user: req.publicProfile, blogs });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
