import React from "react";
import { Spinner as Loader} from "react-bootstrap";

const loaderStyle = { 
    position: "absolute", 
    top: "calc(50% - 1rem)", 
    left : "calc(50% - 1rem)"
};

function Spinner() {
    return (
      <Loader style={loaderStyle} animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Loader>
    );
  }
  
  export default Spinner;