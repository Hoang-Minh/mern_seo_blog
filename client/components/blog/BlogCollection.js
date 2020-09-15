import { useState, useEffect } from "react";
import { getCategories } from "../../actions/category";
import CardBlog from "./CardBlog";

const BlogCollection = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data);
    });
  }, []);

  const showCardBlog = () => {
    return categories.map((category, index) => (
      <CardBlog category={category} key={index}></CardBlog>
    ));
  };

  return <div className="row">{showCardBlog()}</div>;
};

export default BlogCollection;
