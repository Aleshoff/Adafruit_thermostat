import React from "react";
import { Card, Button, Col, Container } from "react-bootstrap";

const Welcome = () => (
  <Card >
    <Card.Body className="justify-content-center">
      <Card.Title>Welcome to the Photo Gallery!</Card.Title>
      <Card.Text>
        This is an application that retrieves photos using Unsplash API. Enter
        any search term to start!
      </Card.Text>
      <Container className="col-md-12 text-center">
        <Col >
          <Button variant="secondary" href="http://unsplash.com" target="_blank">
            Visit Unsplash
          </Button>
        </Col>
      </Container>
    </Card.Body>
  </Card>
);
export default Welcome;
