import React from "react";
import { Navbar } from "react-bootstrap";
import { Container } from "react-bootstrap";
import { ReactComponent as Author } from "../images/author.svg";

const navbarStyle = {
  backgroundColor: "white",
  position: "absolute",
  bottom: "0",
  left: "calc(0%)",
  right: "calc(0%)",
};

const Footer = ({ title }) => {
  return (
    <div>
      <Navbar style={navbarStyle} data-bs-theme="light" fixed="bottom">
        <Container fluid>
          <Author
            alt={title}
            style={{ maxWidth: "20rem", maxHeight: "4rem" }}
          />
        </Container>
      </Navbar>
    </div>
  );
};

export default Footer;
