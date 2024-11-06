import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import GaugeComponent from "react-gauge-component";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = process.env.REACT_APP_API_URL || "https://alolprojectspace.com";


const setNewTemperature = async (token, temp, credentials) => {
  try {
    const result = await axios.post(`${API_URL}/dashboard`, credentials, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (result?.data?.changed) {
      toast.success(`The temperature was chenged to ${temp} degree!`);
    }
  } catch (error) {
    toast.error(error.message);
    console.log(error);
  }
};

const GaugeSetTemp = ({ token, temp, setTemperature }) => {

  const minusTemp = () => {
    if (temp === -20)
      return -20;
    return temp - 1;
  };

  const plusTemp = () => {
    if (temp === 60)
      return 60;
    return temp + 1;
  };


  return (
    <>
    <Container >
      <Row >
        <Col style={{textAlign:"center", fontFamily:"cursive", fontSize: "1.5rem", color: "green"}}>SET TEMPERATURE</Col>
      </Row>
    </Container>
    <GaugeComponent
  type="grafana"
  arc={{
    width: 0.22,
    padding: 0.005,
    cornerRadius: 1,
    // gradient: true,
    subArcs: [
      {
        limit: 23,
        color: '#5BE12C',
        showTick: true,
        tooltip: {
          text: 'OK temperature!'
        }
      },
      {
        limit: 30, color: '#F5CD19', showTick: true,
        tooltip: {
          text: 'High temperature!'
        }
      },
      {
        color: '#EA4228',
        tooltip: {
          text: 'Too high temperature!'
        }
      }
    ]
  }}
  pointer={{
    color: '#345243',
    length: 0.80,
    width: 15,
    // elastic: true,
  }}
  labels={{
    valueLabel: { formatTextValue: value => value + 'ºC' },
    tickLabels: {
      type: 'outer',
      defaultTickValueConfig: { 
        formatTextValue: (value) => value + 'ºC' ,
        style: {fontSize: 10}
    },
      ticks: [
        { value: 0 },
        { value: 23 },
        { value: 45 }
      ],
    }
  }}
  value={temp}
  minValue={-20}
  maxValue={60}
/>
<div style={{textAlign:"center"}}>
      <Button variant="outline-success" size="lg" style={{textAlign:"center", width: '20%', fontSize:"30px"}} onClick={() => setTemperature(minusTemp)}>
        -
      </Button>{' '}
      <Button variant="outline-success" size="lg" style={{textAlign:"center", width: '30%', fontSize:"30px"}} onClick={() => setNewTemperature(token, temp, {temperature: temp})}>
        SET
      </Button>{' '}
      <Button variant="outline-success" size="lg" style={{textAlign:"center", width: '20%', fontSize:"30px"}} onClick={() => setTemperature(plusTemp)}>
        +
      </Button>
    </div>
</>
  );
};

export default GaugeSetTemp;
