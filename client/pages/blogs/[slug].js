import Head from "next/head";
import Link from "next/link";
import { withRouter } from "next/router";
import renderHTML from "react-render-html";
import moment from "moment";
import Layout from "../../components/Layout";
import { useState, useEffect } from "react";
import { singleBlog, listRelated } from "../../actions/blog";
import { API, DOMAIN, APP_NAME, FB_APP_ID } from "../../config";
import SmallCard from "../../components/blog/SmallCard";

const SingleBlog = ({ blog, query }) => {
  const [related, setRelated] = useState([]);

  const head = () => (
    <Head>
      <title>
        {blog.title} | {APP_NAME}
      </title>
      <meta name="description" content={blog.mdesc}></meta>
      <link rel="canonical" href={`${DOMAIN}/blogs/${query.slug}`}></link>
      <meta property="og:title" conent={`${blog.title} | ${APP_NAME}`}></meta>
      <meta property="og:description" content={blog.mdesc}></meta>
      <meta property="og:type" content="website"></meta>
      <meta property="og:url" content={`${DOMAIN}/blogs/${query.slug}`}></meta>
      <meta property="og:site_name" content={`${APP_NAME}`}></meta>
      <meta
        property="og:image"
        content={`${API}/api/blog/photo/${blog.slug}`}
      ></meta>
      <meta
        property="og:image:secure_url"
        content={`${API}/api/blog/photo/${blog.slug}`}
      ></meta>
      <meta property="og:image:type" content="image/jfif"></meta>
      <meta property="fb:app_id" content={`${FB_APP_ID}`}></meta>
    </Head>
  );

  useEffect(() => {
    loadRelated();
  }, []);

  const loadRelated = () => {
    console.log(blog);
    listRelated(blog).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setRelated(data);
      }
    });
  };

  const showBlogCategories = (blog) => {
    return blog.categories.map((category, index) => (
      <Link key={index} href={`/categories/${category.slug}`}>
        <a className="btn btn-primary mr-1 ml-1 mt-3">{category.name}</a>
      </Link>
    ));
  };

  const showBlogTags = (blog) => {
    return blog.tags.map((tag, index) => (
      <Link key={index} href={`/categories/${tag.slug}`}>
        <a className="btn btn-outline-primary mr-1 ml-1 mt-3">{tag.name}</a>
      </Link>
    ));
  };

  const showRelatedBlogs = () => {
    return related.map((blog, index) => (
      <div className="col-md-4" key={index}>
        <article>
          <SmallCard blog={blog}></SmallCard>
        </article>
      </div>
    ));
  };

  return (
    <React.Fragment>
      {head()}
      <Layout>
        <main>
          <article>
            <div className="container-fluid">
              <section>
                <div className="row" style={{ marginTop: "-30px" }}>
                  <img
                    src={`${API}/api/blog/photo/${blog.slug}`}
                    alt={blog.title}
                    className="img img-fluid featured-imaged"
                  ></img>
                </div>
              </section>
              <section>
                <div className="container">
                  <h1 className="display-2 pb-3 pt-3 text-center font-weight-bold">
                    {blog.title}
                  </h1>
                  <p className="lead mt-3 mark">
                    Written by {blog.postedBy.name} | Published{" "}
                    {moment(blog.updatedAt).fromNow()}
                  </p>
                  <div className="pb-3">
                    {showBlogCategories(blog)}
                    {showBlogTags(blog)}
                    <br />
                    <br />
                  </div>
                </div>
              </section>
            </div>

            <div className="container">
              <section>
                <div className="col-md-12 lead">{renderHTML(blog.body)}</div>
              </section>
            </div>

            <div className="container pb-5">
              <h4 className="text-center pt-5 pb-5 h2">Related blogs</h4>
              <div className="row">{showRelatedBlogs()}</div>
            </div>

            <div className="container pb-5">
              <p>Show comments</p>
            </div>
          </article>
        </main>
      </Layout>
    </React.Fragment>
  );
};

SingleBlog.getInitialProps = ({ query }) => {
  return singleBlog(query.slug).then((data) => {
    if (data.error) {
      console.log(data.error);
    } else {
      return { blog: data, query };
    }
  });
};

export default SingleBlog;
