const Category = require("../models/category");
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

exports.read = async (req, res) => {
  return res.json(req.slugCategory);
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
