const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      minlength: 3,
      maxlength: 160,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    body: {
      type: {},
      minlength: 200,
      maxlength: 2000000, // 2mb in size
    },
    excerpt: {
      type: String,
      maxlength: 1000,
    },
    mtitle: { type: String },
    mdesc: { type: String },
    photo: {
      data: Buffer,
      contentType: String,
    },
    categories: [
      { type: Schema.Types.ObjectId, ref: "category", required: true },
    ],
    tags: [{ type: Schema.Types.ObjectId, ref: "tag", required: true }],
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("blog", blogSchema);
