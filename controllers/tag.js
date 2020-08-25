const Tag = require("../models/tag");
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

exports.read = (req, res) => {
  res.json(req.tagSlug);
};

exports.remove = async (req, res) => {
  const slug = req.tagSlug;
  await Tag.deleteOne(slug);
  res.json({ message: "Tag is removed" });
};
