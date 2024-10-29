import React, { useState } from "react";
import { Button, Form, Col, Row, Navbar, Container } from "react-bootstrap";
import PropTypes from "prop-types";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = process.env.REACT_APP_API_URL || "https://alolprojectspace.com";

const logingStyle = { 
  position: "absolute", 
   top: "calc(25%)", 
   left : "calc(50% - 19rem)"
};


const loginUser = async (credentials) => {
  try {
    const result = await axios.post(`${API_URL}/login`, credentials);
    toast.error(result?.data?.error);
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

const showPassword = () => {
  var x = document.getElementById("showPassword");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
};


export default function Login({ setToken, setIsSignUped }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await loginUser({
      username: username,
      password: password,
    });
    if (token?.token) {
      setToken(token);
    }
    console.log(token);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    setIsSignUped(false);
  };

  return (
    <div>
      <br />
      <Navbar  data-bs-theme="light" >
        <Container className="justify-content-end">
          <Button  variant="link" size="lg" onClick={handleSignUp}>Sign Up</Button>
        </Container>
      </Navbar>
      <Form onSubmit={handleSubmit} style={logingStyle}>
        <h3 align="center">Please Log In</h3>
        <br />
        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
          <Form.Label column sm={5}>
            Email
          </Form.Label>
          <Col sm={12}>
            <Form.Control
              type="email"
              placeholder="Email"
              onChange={(e) => setUserName(e.target.value)}
            />
          </Col>
        </Form.Group>

        <Form.Group
          as={Row}
          className="mb-3"
          controlId="formHorizontalPassword"
        >
          <Form.Label column sm={5}>
            Password
          </Form.Label>
          <Col sm={12}>
            <Form.Control
              id="showPassword"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Col>
        </Form.Group>
        <br />

        <Form.Group className="mb-3">
        <Form.Check
          label="Show password"
          onClick={showPassword}
        />
      </Form.Group>

        <Form.Group as={Row} className="col-md-12 text-center">
          <Col sm={{ span: 10, offset: 2 }}>
            <Button type="submit">Sign in</Button>
          </Col>
        </Form.Group>
      </Form>
      <ToastContainer position="bottom-right" />
    </div>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};
