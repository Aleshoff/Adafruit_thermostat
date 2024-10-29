import React, { useState } from "react";
import { Button, Form, Col, Row, Navbar, Container } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = process.env.REACT_APP_API_URL || "https://alolprojectspace.com";

const signUpStyle = { 
  position: "absolute", 
  top: "calc(25%)", 
  left : "calc(50% - 22rem)"
};


const signUpUser = async (credentials) => {
  try {
    const result = await axios.post(`${API_URL}/signup`, credentials);
    toast.error(result?.data?.error);
    return result.data;
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
};

const showPassword = () => {
  var x = document.getElementById("showPassword1");
  var y = document.getElementById("showPassword2");
  if (x.type === "password") {
    x.type = "text";
    y.type = "text";
  } else {
    x.type = "password";
    y.type = "password";
  }
};


export default function SignUp({ setIsSignUped }) {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      toast.error("Password is emty!");
      return;
    }
    if (password !== password2) {
      toast.error("Passwords must be the same!");
      return;
    }
    
    const response = await signUpUser({
      username: username,
      password: password,
    });
    if (response?.inserted_id) {
      toast.warn(`User ${username} was registrated!`);
      setIsSignUped(true);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsSignUped(true);
  };

  return (
    <div>
      <br />
      <Navbar  data-bs-theme="light" >
        <Container className="justify-content-end">
          <Button  variant="link" size="lg" onClick={handleLogin}>Login</Button>
        </Container>
      </Navbar>
      <Form onSubmit={handleSubmit} style={signUpStyle}>
        <h3 align="center">Please Sign Up</h3>
        <br />
        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
          <Form.Label column sm={5}>
            Email
          </Form.Label>
          <Col sm={12}>
            <Form.Control
              type="email"
              placeholder="example@mail.com"
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
              id="showPassword1"
              type="password"
              placeholder="at least 1 number and 8 symbols"
              onChange={(e) => setPassword2(e.target.value)}
            />
          </Col>
        </Form.Group>

        <Form.Group
          as={Row}
          className="mb-3"
          controlId="formHorizontalPassword2"
        >
          <Form.Label column sm={8}>
            Password Confirmation
          </Form.Label>
          <Col sm={12}>
            <Form.Control
              id="showPassword2"
              type="password"
              placeholder="Confirm Password"
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
            <Button type="submit">Submit</Button>
          </Col>
        </Form.Group>
      </Form>
      <ToastContainer position="bottom-right" />
    </div>
  );
}
