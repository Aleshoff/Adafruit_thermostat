import React from "react";
import { ReactComponent as Logo } from "../images/logo.svg";


const Header = ({ title }) => {
  return (
    <div style={{ textAlign: "center" }}>
      <Logo alt={title} style={{ maxWidth: "55rem", maxHeight: "6rem" }} />
    </div>
  );
};

export default Header;
