import { useState, useEffect } from "react";
import Router from "next/router";
import dynamic from "next/dynamic";
import Link from "next/link";
import { withRouter } from "next/router";
import { getCookie, isAuth } from "../../actions/auth";
import { getCategories } from "../../actions/category";
import { getTags } from "../../actions/tag";
import { create } from "../../actions/blog";
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "../../node_modules/react-quill/dist/quill.snow.css";
import { check } from "express-validator";
import { token } from "morgan";

const BlogCreate = ({ router }) => {
  const blogFromLocalStorate = () => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("blog"));
    }
    return {};
  };
  const [body, setBody] = useState(blogFromLocalStorate());
  const [values, setValues] = useState({
    error: "",
    sizeError: "",
    success: "",
    formData: "",
    title: "",
    hidePublishButon: false,
  });

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [checked, setChecked] = useState([]); // category
  const [checkedTag, setCheckedTag] = useState([]); // tag

  const {
    error,
    sizeError,
    success,
    formData,
    title,
    hidePublishButton,
  } = values;

  const token = getCookie("token");

  useEffect(() => {
    setValues({ ...values, formData: new FormData() });
    initCategories();
    initTags();
  }, [router]);

  const publishBlog = (event) => {
    event.preventDefault();
    // console.log("publish");
    create(formData, token).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          title: "",
          error: "",
          success: `A new blog title ${data.title} is created`,
        });
        setBody({});
        setCategories([]);
        setTags([]);
      }
    });
  };

  const initCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setCategories(data);
      }
    });
  };

  const initTags = () => {
    getTags().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setTags(data);
      }
    });
  };

  const handleChange = (name) => (event) => {
    console.log(event.target.value);
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setValues({
      ...values,
      [name]: value,
      formData,
      error: "",
    });
  };

  const handleBody = (event) => {
    setBody(event);
    formData.set("body", event);
    if (typeof window !== "undefined") {
      localStorage.setItem("blog", JSON.stringify(event));
    }
  };

  const handleToggle = (id) => (event) => {
    setValues({ ...values, error: "" });
    const clickedCategory = checked.indexOf(id);
    const all = [...checked];
    if (clickedCategory === -1) {
      all.push(id);
    } else {
      all.splice(clickedCategory, 1);
    }
    console.log(all);
    setChecked(all);
    formData.set("categories", all);
  };

  const handleToggleTag = (id) => (event) => {
    setValues({ ...values, error: "" });
    const clickedTag = checkedTag.indexOf(id);
    const all = [...checkedTag];
    if (clickedTag === -1) {
      all.push(id);
    } else {
      all.splice(clickedTag, 1);
    }
    console.log(all);
    setCheckedTag(all);
    formData.set("tags", all);
  };

  const showCategories = () => {
    return (
      categories &&
      categories.map((category, index) => (
        <li key={index} className="list-unstyled">
          <input
            onChange={handleToggle(category._id)}
            type="checkbox"
            className="mr-2"
          ></input>
          <label className="form-check-lable">{category.name}</label>
        </li>
      ))
    );
  };

  const showTags = () => {
    return (
      tags &&
      tags.map((tag, index) => (
        <li key={index} className="list-unstyled">
          <input
            onChange={handleToggleTag(tag._id)}
            type="checkbox"
            className="mr-2"
          ></input>
          <label className="form-check-lable">{tag.name}</label>
        </li>
      ))
    );
  };

  const createBlogForm = () => {
    return (
      <form onSubmit={publishBlog}>
        <div className="form-group">
          <label className="text-muted">Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={handleChange("title")}
          ></input>
        </div>
        <div className="form-group">
          <ReactQuill
            modules={BlogCreate.modules}
            formats={BlogCreate.formats}
            value={body}
            placeholder="Blog something...."
            onChange={handleBody}
          ></ReactQuill>
        </div>
        <div>
          <button type="submit" className="btn btn-primary">
            Publish
          </button>
        </div>
      </form>
    );
  };
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-8">{createBlogForm()}</div>
        <div className="col-md-4">
          <div>
            <div className="form-group pb-2">
              <h5>Featured Image</h5>
              <hr />
              <small className="text-muted">Max size: 1Mb</small>
              <label className="btn btn-outline-info">
                Upload featured image
                <input
                  onChange={handleChange("photo")}
                  type="file"
                  accept="image/*"
                  hidden
                ></input>
              </label>
            </div>
          </div>
          <h5>Categories</h5>
          <hr />
          <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
            {showCategories()}
          </ul>
          <h5>Tags</h5>
          <hr />
          <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
            {showTags()}
          </ul>
        </div>
      </div>

      {JSON.stringify(categories)}
    </div>
  );
};

BlogCreate.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { header: [3, 4, 5, 6] }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image", "video"],
    ["clean"],
    ["code-block"],
  ],
};

BlogCreate.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "link",
  "image",
  "video",
  "code-block",
];

export default withRouter(BlogCreate);