const _ = require("lodash");
const fs = require("fs");
const formidable = require("formidable");
const User = require("../models/user");
const Blog = require("../models/blog");
const user = require("../models/user");

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

exports.update = (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req.body, (error, fields, files) => {
    if (error) {
      return res.status(400).json({ error: "Photo cannot be uploaded" });
    }

    const user = _.extend(req.profile, fields);

    if (files.photo) {
      if (files.photo.size > 10000000) {
        return res
          .status(400)
          .json({ error: "Photo cannot be greater than 1mb" });
      }

      user.photo.data = fs.readFileSync(files.photo.path);
      user.photo.contentType = files.photo.type;

      user.save((error, result) => {
        if (error) {
          return res.status(400).json({ error: "check db error" });
        }
      });

      user.hashed_password = undefined;
      res.json(user);
    }
  });
};

exports.photo = (req, res) => {
  const user = req.publicProfile;

  if (user.photo.data) {
    res.set("Content-Type", user.photo.contentType);
  }

  res.send(user.photo.data);
};
