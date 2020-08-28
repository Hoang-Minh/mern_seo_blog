import Head from "next/head";
import Link from "next/link";
import { withRouter } from "next/router";
import renderHTML from "react-render-html";
import moment from "moment";
import Layout from "../../components/Layout";
import { useState } from "react";
import { listBlogsWithCategoriesAndTags } from "../../actions/blog";
import Card from "../../components/blog/Card";
import { API, DOMAIN, APP_NAME, FB_APP_ID } from "../../config";

const Blogs = ({ blogs, categories, tags, size, router }) => {
  const head = () => (
    <Head>
      <title>Programming blogs | {APP_NAME}</title>
      <meta
        name="description"
        content="Programming blogs and tutorial on react node next vue php laravel and web development"
      ></meta>
      <link rel="canonical" href={`${DOMAIN}${router.pathname}`}></link>
      <meta
        property="og:title"
        conent={`Latest web development tutorial`}
      ></meta>
      <meta
        property="og:description"
        content="Programming blogs and tutorial on react node next vue php laravel and web development"
      ></meta>
      <meta property="og:type" content="website"></meta>
      <meta property="og:url" content={`${DOMAIN}${router.pathname}`}></meta>
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

  const showAllBlogs = () => {
    return blogs.map((blog, index) => (
      <article key={index}>
        <Card blog={blog}></Card>
        <hr />
      </article>
    ));
  };

  const showAllCategories = () => {
    return categories.map((category, index) => (
      <Link key={index} href={`/categories/${category.slug}`}>
        <a className="btn btn-primary mr-1 ml-1 mt-3">{category.name}</a>
      </Link>
    ));
  };

  const showAllTags = () => {
    return tags.map((tag, index) => (
      <Link key={index} href={`/categories/${tag.slug}`}>
        <a className="btn btn-outline-primary mr-1 ml-1 mt-3">{tag.name}</a>
      </Link>
    ));
  };

  return (
    <React.Fragment>
      {head()}
      <Layout>
        <main>
          <div className="container-fluid">
            <header>
              <div className="col-md-12 pt-3">
                <h1 className="display-4 font-weight-bold text-center">
                  Programming Blogs and Tutorials
                </h1>
              </div>
              <section>
                <div className="pb-5 text-center">
                  {showAllCategories()}
                  <br />
                  {showAllTags()}
                </div>
              </section>
            </header>
          </div>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">{showAllBlogs()}</div>
            </div>
          </div>
        </main>
      </Layout>
    </React.Fragment>
  );
};

Blogs.getInitialProps = () => {
  return listBlogsWithCategoriesAndTags().then((data) => {
    if (data.error) {
      console.log(data.error);
    } else {
      return {
        blogs: data.blogs,
        categories: data.categories,
        tags: data.tags,
        size: data.size,
      };
    }
  });
};

export default withRouter(Blogs);
