import React from "react";
import { Nav, NavLink, NavMenu } from "./NavbarElements";

const Navbar = () => {
  return (
    <>
      <Nav>
        <NavMenu>
          <NavLink to="/" activeStyle>
            Homepage
          </NavLink>
          <NavLink to="/movies" activeStyle>
            Movies
          </NavLink>
          <NavLink to="/customers" activeStyle>
            Customers
          </NavLink>
        </NavMenu>
      </Nav>
    </>
  );
};

export default Navbar;
