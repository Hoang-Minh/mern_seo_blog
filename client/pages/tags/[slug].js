import Head from "next/head";
import Link from "next/link";
import renderHTML from "react-render-html";
import moment from "moment";
import Layout from "../../components/Layout";
import { useState, useEffect } from "react";
import { getTag } from "../../actions/tag";
import { API, DOMAIN, APP_NAME, FB_APP_ID } from "../../config";
import Card from "../../components/blog/Card";

const Tag = ({ tag, blogs, query }) => {
  const head = () => (
    <Head>
      <title>
        {tag.name} | {APP_NAME}
      </title>
      <meta
        name="description"
        content={`Best programming tutorials on ${tag.name}`}
      ></meta>
      <link rel="canonical" href={`${DOMAIN}/tags/${query.slug}`}></link>
      <meta property="og:title" conent={`${tag.name} | ${APP_NAME}`}></meta>
      <meta
        property="og:description"
        content={`Best programming tutorials on ${tag.name}`}
      ></meta>
      <meta property="og:type" content="website"></meta>
      <meta property="og:url" content={`${DOMAIN}/tags/${query.slug}`}></meta>
      <meta property="og:site_name" content={`${APP_NAME}`}></meta>
      <meta property="og:image" content="/static/images/seoblog.jfif"></meta>
      <meta
        property="og:image:secure_url"
        content="/static/images/seoblog.jfif"
      ></meta>
      <meta property="og:image:type" content="image/jfif"></meta>
      <meta property="fb:app_id" content={`${FB_APP_ID}`}></meta>
    </Head>
  );

  return (
    <React.Fragment>
      {head()}
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
      return { tag: data.tag, blogs: data.blogs, query };
    }
  });
};

export default Tag;
