const Category = require("../models/category");
const Blog = require("../models/blog");
const slugify = require("slugify");
const { uniqueMessage } = require("../helpers/dbError");

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const slug = slugify(name).toLowerCase();
    const category = new Category({ name, slug });
    const createdCategory = await category.save();
    return res.json(createdCategory);
  } catch (error) {
    return res.status(400).json({ error: uniqueMessage(error) });
  }
};

exports.list = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

exports.read = async (req, res, next) => {
  try {
    const blogs = await Blog.find({ categories: req.slugCategory })
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id name")
      .select(
        "_id title slug excerpt categories postedBy tags createdAt updatedAt"
      );

    return res.json({ category: req.slugCategory, blogs });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res) => {
  try {
    const slug = req.slugCategory;
    await Category.deleteOne(slug);
    res.json({ message: "Category removed" });
  } catch (error) {
    console.log(error);
  }
};

exports.findCategorySlug = async (req, res, next, slug) => {
  try {
    const slugTagInDb = await Category.findOne({ slug: slug.toLowerCase() });
    req.slugCategory = slugTagInDb;
    next();
  } catch (error) {
    next(error);
  }
};
