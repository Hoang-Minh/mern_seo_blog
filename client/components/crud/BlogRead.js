import { useState, useEffect } from "react";
import Router from "next/router";
import Link from "next/link";
import { getCookie, isAuth } from "../../actions/auth";
import { list, remove } from "../../actions/blog";

const BlogRead = () => {
  return (
    <React.Fragment>
      <p>Update Delete Blog</p>
    </React.Fragment>
  );
};

export default BlogRead;
