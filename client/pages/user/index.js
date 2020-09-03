import Layout from "../../components/Layout";
import Private from "../../components/auth/Private";
import Link from "next/link";

const UserIndex = () => (
  <Layout>
    <Private>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-8 pt-5 pb-5">
            <h2>User Dasboard</h2>
          </div>
          <div className="col-md-8">
            <ul className="list-group">
              <li className="list-group-item">
                <a href="/user/crud/blog">Create Blog</a>
              </li>
            </ul>
          </div>
          <div className="col-md-8">
            <ul className="list-group">
              <li className="list-group-item">
                <Link href="/user/crud/blogs">
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
    </Private>
  </Layout>
);

export default UserIndex;
