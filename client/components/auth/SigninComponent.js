import { Fragment, useState, useEffect } from "react";
import { signin, authenticate, isAuth } from "../../actions/auth";
import Router from "next/router";

function SigninComponent({ test }) {
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: false,
    loading: false,
    message: "",
    showForm: true,
  });

  useEffect(() => {
    if (isAuth()) {
      Router.push("/");
    }
  }, []);

  const { email, password, error, loading, message, showForm } = values;

  const handleSubmit = (event) => {
    event.preventDefault();

    setValues({ ...values, loading: true, error: false });
    const user = { email, password };
    signin(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        authenticate(data, () => {
          if (isAuth() && isAuth().role === 1) {
            Router.push("/admin");
          } else {
            Router.push("/user");
          }
        });
      }
    });
  };

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const showLoading = () =>
    loading ? <div className="alert alert-info">Loading...</div> : "";
  const showError = () =>
    error ? <div className="alert alert-danger">{error}</div> : "";
  const showMessage = () =>
    message ? <div className="alert alert-info">{message}</div> : "";

  const signinForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            value={email}
            onChange={handleChange("email")}
            className="form-control"
            type="email"
            placeholder="Type your email"
          ></input>
        </div>
        <div className="form-group">
          <input
            value={password}
            onChange={handleChange("password")}
            className="form-control"
            type="password"
            placeholder="Type your password"
          ></input>
        </div>
        <div>
          <button className="btn btn-primary">Sign In</button>
        </div>
      </form>
    );
  };

  return (
    <Fragment>
      {showError()}
      {showLoading()}
      {showMessage()}
      {showForm && signinForm()}
    </Fragment>
  );
}

export default SigninComponent;
