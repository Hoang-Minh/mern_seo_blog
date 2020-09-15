import Link from "next/link";

const CardBlog = ({ category }) => {
  return (
    <div className="col-md-4">
      <div className="flip flip-horizontal">
        <div
          className="front"
          style={{
            backgroundImage:
              "url(" +
              "https://images.pexels.com/photos/540518/pexels-photo-540518.jpeg" +
              ")",
          }}
        >
          <h2 className="text-shadow text-center h1">{category.name}</h2>
        </div>
        <div className="back text-center">
          <Link href="/categories/react">
            <a>
              <h3 className="h1">{category.name}</h3>
            </a>
          </Link>
          <p className="lead">
            The world's most popular web development library
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardBlog;
