import Layout from "../components/Layout";
import BlogCollection from "../components/blog/BlogCollection";

const Index = () => (
  <Layout>
    <article className="overflow-hidden">
      <div className="container">
        <div className="row">
          <div className="col-md-12 text-center">
            <h1 className="display-4 font-weight-bold">
              PROGRAMMING & WEB DEVELOPMENT BLOGS/TUTORIALS
            </h1>
          </div>
        </div>
      </div>
    </article>
    <div className="container">
      <div className="row">
        <div className="col-md-12 text-center pt-4 pb-5">
          <p className="lead">
            Best programming and web development blogs and tutorials on React
            Node NextJs and JavaScript
          </p>
        </div>
      </div>
    </div>
    <div className="container-fluid">
      <BlogCollection></BlogCollection>
    </div>
  </Layout>
);

export default Index;
