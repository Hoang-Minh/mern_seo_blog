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
  const { slug } = router.query;
  const { error, success, formData, title } = values;

  useEffect(() => {
    setValues({ ...values, formData: new FormData() });
    initBlog();
  }, [slug]);

  const initBlog = () => {
    if (slug) {
      singleBlog(slug).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          setValues({ ...values, title: data.title });
          setBody(data.body);
        }
      });
    }
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

  const editBlog = () => {
    console.log("update blog");
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

  return (
    <div className="container-fluid pb-5">
      <div className="row">
        <div className="col-md-8">
          {updateBlogForm()}
          <div className="pt-3">show success and error msg</div>
        </div>
        <div className="col-md-4">
          <div>
            <div className="form-group pb-2">
              <h5>Featured Image</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(BlogUpdate);
