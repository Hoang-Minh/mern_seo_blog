import Layout from "../../components/Layout";
import Admin from "../../components/auth/Admin";
import Link from "next/link";
const AdminIndex = () => (
  <Layout>
    <Admin>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-8 pt-5 pb-5">
            <h2>Admin Dasboard</h2>
          </div>
          <div className="col-md-8">
            <ul className="list-group">
              <li className="list-group-item">
                <Link href="/admin/crud/category-tag">
                  <a>Create Category</a>
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-md-8">
            <ul className="list-group">
              <li className="list-group-item">
                <Link href="/admin/crud/category-tag">
                  <a>Create Tag</a>
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-md-8">
            <ul className="list-group">
              <li className="list-group-item">
                <a href="/admin/crud/blog">Create Blog</a>
              </li>
            </ul>
          </div>
          <div className="col-md-8">
            <ul className="list-group">
              <li className="list-group-item">
                <Link href="/admin/crud/blogs">
                  <a>Update/Delete Blog</a>
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-md-8">
            <ul className="list-group">
              <li className="list-group-item">
                <Link href="/user/update">
                  <a>Update Profile</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Admin>
  </Layout>
);

export default AdminIndex;
