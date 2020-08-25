import Layout from "../components/Layout";
import Link from "next/link";
import SigninComponent from "../components/auth/SigninComponent";
const Signin = () => (
  <Layout>
    <h2 className="text-center pt-4 pb-4">Sign In</h2>
    <div className="row">
      <div className="col-md-6 offset-md-3">
        <SigninComponent></SigninComponent>
      </div>
    </div>
  </Layout>
);

export default Signin;
