const Blog = require("../models/blog");
const Category = require("../models/category");
const Tag = require("../models/tag");
const formidable = require("formidable");
const stringStripHtml = require("string-strip-html");
const slugify = require("slugify");
const _ = require("lodash");
const keys = require("../config/keys");
const fs = require("fs");

exports.findBlogBySlug = async (req, res, next, slug) => {
  try {
    const blog = await Blog.findOne({ slug: slug.toLowerCase() })
      .populate("categories", "_id slug name")
      .populate("tags", "_id slug name")
      .populate("postedBy", "_id username name")
      .select(
        "_id title slug body photo mtitle mdesc postedBy createdAt updatedAt"
      );
    if (!blog) {
      res.status(400);
      next({ error: "Blog not found" });
    } else {
      req.slugBlog = blog;
      next();
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.create = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (error, fields, files) => {
    if (error) {
      return res.status(400).json({ error: "Image could not upload" });
    }

    // title is missing, content is too short !!! check this !!!!
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

      blog.photo.data = fs.readFileSync(files.photo.path);
      blog.photo.contentType = files.photo.type;
    }

    blog.save((error, result) => {
      if (error) {
        console.log(error);
        res.status(400).json({ error: "Check db error" });
      }

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

exports.listAllBlogsCategoriesTags = async (req, res) => {
  try {
    const limit = req.body.limit ? parseInt(req.body.limit) : 10;
    const skip = req.body.skip ? parseInt(req.body.skip) : 0;

    const blogs = await Blog.find({})
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id name username")
      .sort({ createdAt: -1 }) // asc based on createdAt
      .skip(skip)
      .limit(limit)
      .select(
        "_id title slug excerpt categories tags postedBy createdAt updatedAt"
      );

    const categories = await Category.find({});
    const tags = await Tag.find({});

    res.json({ blogs, categories, tags, size: blogs.length });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Check db error" });
  }
};

exports.read = (req, res) => {
  return res.json(req.slugBlog);
};

exports.update = async (req, res) => {
  let oldBlog = req.slugBlog;

  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (error, fields, files) => {
    if (error) {
      return res.status(400).json({ error: "Image could not upload" });
    }

    let slugBeforeMerge = oldBlog.slug;
    oldBlog = _.merge(oldBlog, fields);
    oldBlog.slug = slugBeforeMerge;

    const { body, desc, categories, tags } = fields;

    if (body) {
      oldBlog.excerpt = body.substring(0, 320);
      oldBlog.mdesc = stringStripHtml(body.substring(0, 160)).result;
    }

    if (categories) {
      oldBlog.categories = categories.replace(/\s/, "").split(",");
    }

    if (tags) {
      oldBlog.tags = tags.replace(/\s/, "").split(",");
    }

    if (files.photo) {
      if (files.photo.size > 10000000) {
        return res
          .status(400)
          .json({ error: "Image should be less thatn 1Mb in size" });
      }

      oldBlog.photo.data = fs.readFileSync(files.photo.path);
      oldBlog.photo.contentType = files.photo.type;
    }

    oldBlog.save((error, result) => {
      if (error) {
        console.log(error);
        res.status(400).json({ error: "Check db error" });
      }

      res.json(result);
    });
  });
};

exports.remove = async (req, res) => {
  try {
    const blog = req.slugBlog;
    await Blog.deleteOne(blog);
    res.json({ message: "Blog removed" });
  } catch (error) {
    console.log(error);
  }
};

exports.photo = async (req, res) => {
  const blog = req.slugBlog;
  const photo = blog.photo;
  res.set("Content-Type", photo.contentType);
  res.send(photo.data);
};

exports.listRelated = async (req, res) => {
  try {
    const limit = req.body.limit ? parseInt(req.body.limit) : 3;
    const { _id, categories } = req.body;

    // find blogs that not including _id, but includes categories
    const blogs = await Blog.find({
      _id: { $ne: _id },
      categories: { $in: categories },
    })
      .limit(limit)
      .populate("postedBy", "_id name username profile")
      .select("title slug excerpt postedBy createdAt updatedAt");

    res.json(blogs);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "check db error" });
  }
};

exports.listSearch = async (req, res, next) => {
  try {
    console.log(req.query);
    const { search } = req.query;

    if (search) {
      const blogs = await Blog.find({
        // search in either title or body with options i - case insensitive
        $or: [
          { title: { $regex: search, $options: "i" } },
          { body: { $regex: search, $options: "i" } },
        ],
      }).select("-photo -body");

      res.json(blogs);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
