const Tag = require("../models/tag");
const Blog = require("../models/blog");
const slugify = require("slugify");
const { uniqueMessage } = require("../helpers/dbError");

exports.findTagSlug = async (req, res, next, slug) => {
  try {
    const slugInDb = await Tag.findOne({ slug: slug.toLowerCase() });
    req.tagSlug = slugInDb;
    next();
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const slug = slugify(name).toLowerCase();
    const tag = new Tag({ name, slug });
    const tagInDb = await tag.save();
    res.json(tagInDb);
  } catch (error) {
    res.status(400).json({ error: uniqueMessage(error) });
  }
};

exports.list = async (req, res, next) => {
  try {
    const tags = await Tag.find();
    res.json(tags);
  } catch (error) {
    next(error);
  }
};

exports.read = async (req, res, next) => {
  try {
    const blogs = await Blog.find({ tags: req.tagSlug })
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id name")
      .select(
        "_id title slug excerpt categories postedBy tags createdAt updatedAt"
      );
    res.json({ tag: req.tagSlug, blogs });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.remove = async (req, res) => {
  const slug = req.tagSlug;
  await Tag.deleteOne(slug);
  res.json({ message: "Tag is removed" });
};
