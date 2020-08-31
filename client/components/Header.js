import { useState } from "react";
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
import { isAuth, signout } from "../actions/auth";
import "../node_modules/nprogress/nprogress.css";

Router.onRouteChangeStart = (url) => NProgress.start();
Router.onRouteChangeComplete = (url) => NProgress.done();
Router.onRouteChangeError = (url) => NProgress.done();

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const renderContent = () => {
    if (!isAuth()) {
      return (
        <React.Fragment>
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
          </Nav>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <React.Fragment>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <Link href="/signin" passHref>
                  <NavLink
                    onClick={() => signout(() => console.log("sign out"))}
                  >
                    Sign Out
                  </NavLink>
                </Link>
              </NavItem>
              <Link href="/blogs" passHref>
                <NavLink>Blogs</NavLink>
              </Link>
              <NavItem>
                <Link href={isAuth().role === 1 ? "/admin" : "/user"} passHref>
                  <NavLink>Dashboard</NavLink>
                </Link>
              </NavItem>
            </Nav>
          </React.Fragment>
        </React.Fragment>
      );
    }
  };

  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/" className="font-weight-bold">
          {APP_NAME}
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          {renderContent()}
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
