import { useState, useEffect } from "react";
import Router from "next/router";
import dynamic from "next/dynamic";
import Link from "next/link";
import { withRouter } from "next/router";
import { getCookie, isAuth } from "../../actions/auth";
import { getCategories } from "../../actions/category";
import { getTags } from "../../actions/tag";
import { create } from "../../actions/blog";
import { quillModules, quillFormats } from "../../helpers/quill";
import "../../node_modules/react-quill/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const BlogUpdate = ({ router }) => {
  return (
    <div className="container-fluid pb-5">
      <div className="row">
        <div className="col-md-8">
          <p>Create bog form</p>
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
