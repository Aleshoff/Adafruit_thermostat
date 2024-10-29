import React from "react";
import { Card, Button, Nav } from "react-bootstrap";

const ImageCard = ({ image, deleteImage, saveImage }) => {
    return (
        <Card style={{ width: '18rem' }}>
          <Card.Img variant="top" src={image.urls.small} />
          <Card.Body>
            <Card.Title>{image.title?.toUpperCase()}</Card.Title>
            <Card.Text>
              {image.description || image.alt_description}
            </Card.Text>
            <Button variant="primary" onClick={() => deleteImage(image.id)}>
              Delete
            </Button>{" "}
            {!image.saved && <Button variant="primary" onClick={() => saveImage(image.id)}>
              Save
            </Button>}
          </Card.Body>
          <Card.Footer className="text-center">{
            image.user.portfolio_url && image.user.name ?
              (<Nav.Link className="link-primary" href={image.user.portfolio_url} target="_blank">{image.user.name}</Nav.Link>
              ) : (image.user.name || "No author name")            
            }
            </Card.Footer>
        </Card>
      );
};

export default ImageCard;