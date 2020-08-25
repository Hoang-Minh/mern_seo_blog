import Layout from "../../../components/Layout";
import Admin from "../../../components/auth/Admin";
import Category from "../../../components/crud/Category";
import Link from "next/link";

const CategoryTag = () => (
  <Layout>
    <Admin>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12 pt-5 pb-5">
            <h2>Manage Category and Tags</h2>
          </div>
          <div className="col-md-6">
            <Category></Category>
          </div>
          <div className="col-md-6">Tag</div>
        </div>
      </div>
    </Admin>
  </Layout>
);

export default CategoryTag;
