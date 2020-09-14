import { useState, useEffect } from "react";
import { withRouter } from "next/router";
import Layout from "../../../../components/Layout";
import { resetPassword } from "../../../../actions/auth";

const ResetPassword = ({ router }) => {
  const [values, setValues] = useState({
    name: "",
    newPassword: "",
    error: "",
    message: "",
    showForm: true,
  });

  const { showForm, name, newPassword, error, message } = values;

  const handleSubmit = (event) => {
    event.preventDefault();
    resetPassword({
      newPassword,
      resetPasswordLink: router.query.id,
    }).then((data) => {
      if (data.error) {
        setValues({
          ...values,
          error: data.error,
          showForm: false,
          newPassword: "",
        });
      } else {
        setValues({
          ...values,
          message: data.message,
          showForm: false,
          error: false,
          newPassword: "",
        });
      }
    });
  };

  const passwordResetForm = () => (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="form-group pt-5">
          <input
            type="password"
            onChange={(event) =>
              setValues({ ...values, newPassword: event.target.value })
            }
            className="form-control"
            value={newPassword}
            placeholder="Type new password"
            required
          ></input>
        </div>
        <div>
          <button className="btn btn-primary">Change password</button>
        </div>
      </form>
    </div>
  );

  const showError = () =>
    error ? <div className="alert alert-danger">{error}</div> : "";

  const showMessage = () =>
    message ? <div className="alert alert-success">{message}</div> : "";

  return (
    <Layout className="container">
      <h2>Reset Password</h2>
      <hr />
      {showError()}
      {showMessage("")}
      {showForm && passwordResetForm()}
    </Layout>
  );
};

export default withRouter(ResetPassword);
