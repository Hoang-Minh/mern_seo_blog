import Link from "next/link";
import moment from "moment";
import renderHTML from "react-render-html";
import { API } from "../../config";

const Card = ({ blog }) => {
  console.log(blog);
  const showBlogCategories = (blog) => {
    return blog.categories.map((category, index) => (
      <Link key={index} href={`/categories/${category.slug}`}>
        <a className="btn btn-outline-primary mr-1 ml-1 mt-3">
          {category.name}
        </a>
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

  return (
    <div className="lead pb-4">
      <header>
        <Link href={`/blogs/${blog.slug}`}>
          <a>
            <h2 className="pt-3 pb-3 font-weight-bold">{blog.title}</h2>
          </a>
        </Link>
      </header>
      <section>
        <p className="mark ml-1 pt-2 pb-2">
          Written by {blog.postedBy.name} | Published{" "}
          {moment(blog.updatedAt).fromNow()}
        </p>
      </section>
      <section>
        {showBlogCategories(blog)}
        {showBlogTags(blog)}
      </section>
      <div className="row">
        <div className="col-md-4">image</div>
        <div className="col-md-8">
          <section>
            <div className="pb-3">
              {blog.excerpt === undefined ? "" : renderHTML(blog.excerpt)}
            </div>
            <Link href={`/blogs/${blog.slug}`}>
              <a className="btn btn-primary pt-2">Read more</a>
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Card;
