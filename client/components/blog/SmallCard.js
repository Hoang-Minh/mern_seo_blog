import Link from "next/link";
import moment from "moment";
import renderHTML from "react-render-html";
import { API } from "../../config";

const SmallCard = ({ blog }) => {
  return (
    <div className="card">
      <section>
        <Link href={`/blogs/${blog.slug}`}>
          <a>
            <img
              className="img img-fluid"
              src={`${API}/api/blog/photo/${blog.slug}`}
              alt={blog.title}
              style={{ maxHeight: "auto", width: "100%" }}
            ></img>
          </a>
        </Link>
      </section>

      <div className="card-body">
        <section>
          <Link href={`/blogs/${blog.slug}`}>
            <h5 className="card-title">{blog.title}</h5>
          </Link>
          <p className="card-text">{renderHTML(blog.excerpt)}</p>
        </section>
      </div>

      <div className="card-body">
        <div>
          Posted {moment(blog.updatedAt).fromNow()} by{" "}
          <Link href={`/profile/${blog.postedBy.username}`}>
            <a className="float-right">{blog.postedBy.username}</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SmallCard;
