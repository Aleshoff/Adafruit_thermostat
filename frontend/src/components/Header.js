import React from 'react';
import { Navbar } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import { ReactComponent as Logo} from "../images/logo.svg";

const navbarStyle = {
backgroundColor: "lightblue"
};

const Header = ({title}) => {
    return (
        <Navbar style={navbarStyle} data-bs-theme="light">
        <Container>
          <Logo alt={title} style={{ maxWidth: "25rem", maxHeight: "6rem" }}/>
        </Container>
      </Navbar>
    );
};

export default Header;