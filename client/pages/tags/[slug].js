import Head from "next/head";
import Link from "next/link";
import renderHTML from "react-render-html";
import moment from "moment";
import Layout from "../../components/Layout";
import { useState, useEffect } from "react";
import { getTag } from "../../actions/tag";
import { API, DOMAIN, APP_NAME, FB_APP_ID } from "../../config";
import Card from "../../components/blog/Card";

const Tag = ({ tag, blogs }) => {
  console.log(tag);
  return (
    <React.Fragment>
      <Layout>
        <main>
          <div className="container-fluid text-center">
            <header>
              <div className="col-md-12 pt-3">
                <h1 className="display-4 font-weight-bold">Tag name</h1>
                {blogs.map((blog, index) => (
                  <Card key={index} blog={blog}></Card>
                ))}
              </div>
            </header>
          </div>
        </main>
      </Layout>
    </React.Fragment>
  );
};

Tag.getInitialProps = ({ query }) => {
  return getTag(query.slug).then((data) => {
    if (data.error) {
      console.log(data.error);
    } else {
      return { tag: data.tag, blogs: data.blogs };
    }
  });
};

export default Tag;
