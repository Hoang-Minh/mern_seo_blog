import { useState, useEffect } from "react";
import Router from "next/router";
import dynamic from "next/dynamic";
import Link from "next/link";
import { withRouter } from "next/router";
import { getCookie, isAuth } from "../../actions/auth";
import { getCategories } from "../../actions/category";
import { getTags } from "../../actions/tag";
import { singleBlog, update } from "../../actions/blog";
import { quillModules, quillFormats } from "../../helpers/quill";
import { API } from "../../config";
import "../../node_modules/react-quill/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const BlogUpdate = ({ router }) => {
  const [body, setBody] = useState({});
  const [values, setValues] = useState({
    error: "",
    success: "",
    formData: "",
    title: "",
    body: "",
  });
  const [categories, setCategories] = useState([]); // load all categories options
  const [tags, setTags] = useState([]); // load all tags options
  const [checked, setChecked] = useState([]); // set category
  const [checkedTag, setCheckedTag] = useState([]); // set tag
  const { slug } = router.query;
  const { error, success, formData, title } = values;
  const token = getCookie("token");

  useEffect(() => {
    setValues({ ...values, formData: new FormData() });
    initBlog();
    initCategories();
    initTags();
  }, [slug]);

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

  const handleToggle = (id) => (event) => {
    console.log(event.target.checked);
    setValues({ ...values, error: "" });

    const clickedCategory = checked.indexOf(id);
    const all = [...checked];

    if (event.target.checked && clickedCategory === -1) {
      all.push(id);
    } else if (!event.target.checked && clickedCategory !== -1) {
      all.splice(clickedCategory, 1);
    }
    console.log(all);
    setChecked(all);
    formData.set("categories", all);

    // const clickedCategory = checked.indexOf(id);
    // const all = [...checked];
    // if (clickedCategory === -1) {
    //   all.push(id);
    // } else {
    //   all.splice(clickedCategory, 1);
    // }
    // console.log(all);
    // setChecked(all);
    // formData.set("categories", all);
  };

  const handleToggleTag = (id) => (event) => {
    setValues({ ...values, error: "" });
    const clickedTag = checkedTag.indexOf(id);
    const all = [...checkedTag];

    if (event.target.checked && clickedTag === -1) {
      all.push(id);
    } else if (!event.target.checked && clickedTag !== -1) {
      all.splice(clickedTag, 1);
    }
    console.log(all);
    setCheckedTag(all);
    formData.set("tags", all);

    // if (clickedTag === -1) {
    //   all.push(id);
    // } else {
    //   all.splice(clickedTag, 1);
    // }
    // console.log(all);
    // setCheckedTag(all);
    // formData.set("tags", all);
  };

  const findOutCategory = (c) => {
    const result = checked.indexOf(c);

    if (result !== -1) {
      return true;
    }

    return false;
  };

  const findOutTag = (t) => {
    const result = checkedTag.indexOf(t);

    if (result !== -1) {
      return true;
    }

    return false;
  };

  const showCategories = () => {
    return (
      categories &&
      categories.map((category, index) => (
        <li key={index} className="list-unstyled">
          <input
            onChange={handleToggle(category._id)}
            checked={findOutCategory(category._id)}
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
            checked={findOutTag(tag._id)}
            type="checkbox"
            className="mr-2"
          ></input>
          <label className="form-check-lable">{tag.name}</label>
        </li>
      ))
    );
  };

  const initBlog = () => {
    if (slug) {
      singleBlog(slug).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          setValues({ ...values, title: data.title });
          setBody(data.body);
          setCategoriesArray(data.categories);
          setTagsArray(data.tags);
        }
      });
    }
  };

  const setCategoriesArray = (blogCategories) => {
    const ca = [];
    blogCategories.map((c, index) => {
      ca.push(c._id);
    });

    setChecked(ca);
  };

  const setTagsArray = (blogTags) => {
    const ta = [];
    blogTags.map((t, index) => {
      ta.push(t._id);
    });

    setCheckedTag(ta);
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
  };

  const editBlog = (event) => {
    event.preventDefault();
    console.log("edit blog", token, router.query.slug);

    update(formData, token, router.query.slug).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          title: "",
          success: `Blog titled "${data.title}" is successfully updated`,
        });

        if (isAuth() && isAuth().role === 1) {
          Router.replace(`/admin/crud/${router.query.slug}`);
        } else {
          Router.replace(`/user/crud/${router.query.slug}`);
        }
      }
    });
  };

  const updateBlogForm = () => {
    return (
      <form onSubmit={editBlog}>
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
            modules={quillModules}
            formats={quillFormats}
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

  const showError = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  const showSuccess = () => (
    <div
      className="alert alert-success"
      style={{ display: success ? "" : "none" }}
    >
      {success}
    </div>
  );

  return (
    <div className="container-fluid pb-5">
      <div className="row">
        <div className="col-md-8">
          {updateBlogForm()}
          <div className="pt-3">
            {showError()}
            {showSuccess()}
          </div>
          {body && (
            <img
              src={`${API}/api/blog/photo/${router.query.slug}`}
              alt={title}
              style={{ width: "100%" }}
            />
          )}
        </div>
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
    </div>
  );
};

export default withRouter(BlogUpdate);
