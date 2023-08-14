import React from "react";
import brandLogo from "../../../assets/brand.png";
const Navbar = () => {
  return (
    <nav
      className="navbar navbar-light bg-light fixed-top col-8 mx-auto"
      style={{ height: "10vh" }}
    >
      <img
        src={brandLogo}
        className="col-2 mx-auto"
        alt=""
        style={{ borderRadius: "12px" }}
      />
    </nav>
  );
};

export default Navbar;
