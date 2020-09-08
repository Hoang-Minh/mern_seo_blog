import Layout from "../components/Layout";
import { withRouter } from "next/router";
import SigninComponent from "../components/auth/SigninComponent";

const Signin = ({ router }) => {
  const showRedirectMessage = (router) => {
    if (router.query.message) {
      return <div className="alert alert-danger">{router.query.message}</div>;
    }

    return;
  };
  return (
    <Layout>
      <h2 className="text-center pt-4 pb-4">Sign In</h2>

      <div className="row">
        <div className="col-md-6 offset-md-3">
          {showRedirectMessage(router)}
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 offset-md-3">
          <SigninComponent></SigninComponent>
        </div>
      </div>
    </Layout>
  );
};

export default withRouter(Signin);
