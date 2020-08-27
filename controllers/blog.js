const Blog = require("../models/blog");
const Category = require("../models/category");
const Tag = require("../models/tag");
const formidable = require("formidable");
const stringStripHtml = require("string-strip-html");
const slugify = require("slugify");
const _ = require("lodash");
const keys = require("../config/keys");
const fs = require("fs");

exports.create = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (error, fields, files) => {
    if (error) {
      return res.status(400).json({ error: "Image could not upload" });
    }

    const { title, body, categories, tags } = fields;

    if (!title || !title.length)
      return res.status(400).json({ error: "Title is required" });

    if (!body || body.length < 200)
      return res.status(400).json({ error: "Content is too shorteee" });

    if (!categories || !categories.length === 0)
      return res
        .status(400)
        .json({ error: "At least one category is required" });

    if (!tags || !tags.length === 0)
      return res.status(400).json({ error: "At least one tag is required" });

    const arrayOfCategories = categories.replace(/\s/, "").split(",");
    const arrayOfTags = tags.replace(/\s/, "").split(",");

    const blog = new Blog({
      title,
      body,
      excerpt: `${body.substring(0, 320)}....`,
      slug: slugify(title).toLowerCase(),
      mtitle: `${title} | ${keys.APP_NAME}`,
      mdesc: stringStripHtml(body.substring(0, 160)).result,
      postedBy: req.profile._id, // req.profile ???
      categories: arrayOfCategories,
      tags: arrayOfTags,
    });

    if (files.photo) {
      if (files.photo.size > 10000000) {
        return res
          .status(400)
          .json({ error: "Image should be less thatn 1Mb in size" });
      }
    }

    blog.photo.data = fs.readFileSync(files.photo.path);
    blog.photo.contentType = files.photo.type;

    blog.save((error, result) => {
      if (error) {
        console.log(error);
        res.status(400).json({ error: "Check db error" });
      }

      // // res.json(result);
      // Blog.findByIdAndUpdate(
      //   result._id,
      //   {
      //     $push: { categories: arrayOfCategories, tags: arrayOfTags },
      //   },
      //   { new: true }
      // ).exec((error, result) => {
      //   if (error) return res.status(400).json({ error: "check db error" });

      //   res.json(result);
      // });

      res.json(result);
    });
  });
};

exports.list = async (req, res) => {
  try {
    const blogs = await Blog.find({})
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id name username")
      .select(
        "_id title slug excerpt categories tags postedBy createdAt updatedAt"
      );

    res.json(blogs);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Check db error" });
  }
};

exports.listAllBlogsCategoriesTags = (req, res) => {};

exports.read = (req, res) => {};
exports.update = (req, res) => {};
exports.remove = (req, res) => {};
