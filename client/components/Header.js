import { useState, useEffect } from "react";
import Router from "next/router";
import Link from "next/link";
import NProgress from "nprogress";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  NavbarText,
} from "reactstrap";
import { APP_NAME } from "../config";
import Search from "./blog/Search";
import { isAuth, signout } from "../actions/auth";
import "../node_modules/nprogress/nprogress.css";

Router.onRouteChangeStart = (url) => NProgress.start();
Router.onRouteChangeComplete = (url) => NProgress.done();
Router.onRouteChangeError = (url) => NProgress.done();

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [auth, setAuth] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  useEffect(() => {
    setAuth(isAuth());
  }, []);

  const renderContent = () => {
    if (!auth) {
      return (
        <Nav className="mr-auto" navbar>
          <Link href="/signup" passHref>
            <NavLink>Signup</NavLink>
          </Link>
          <Link href="/signin" passHref>
            <NavLink>Signin</NavLink>
          </Link>
          <Link href="/blogs" passHref>
            <NavLink>Blogs</NavLink>
          </Link>
          <Link href="/contact" passHref>
            <NavLink>Contact Form</NavLink>
          </Link>
        </Nav>
      );
    } else {
      return (
        <Nav className="mr-auto" navbar>
          <Link href="/signin" passHref>
            <NavLink onClick={() => signout(() => console.log("sign out"))}>
              Sign Out
            </NavLink>
          </Link>
          <Link href="/user/crud/create" passHref>
            <NavLink className="btn btn-primary text-light">
              Create Blogs
            </NavLink>
          </Link>
          <Link href="/blogs" passHref>
            <NavLink>Blogs</NavLink>
          </Link>
          <Link href={isAuth().role === 1 ? "/admin" : "/user"} passHref>
            <NavLink>Dashboard</NavLink>
          </Link>
          <Link href="/contact" passHref>
            <NavLink>Contact Form</NavLink>
          </Link>
        </Nav>
      );
    }
  };

  return (
    <React.Fragment>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/" className="font-weight-bold">
          {APP_NAME}
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          {renderContent()}
        </Collapse>
      </Navbar>
      <Search></Search>
    </React.Fragment>
  );
};

export default Header;
