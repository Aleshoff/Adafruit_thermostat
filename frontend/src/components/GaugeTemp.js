import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import GaugeComponent from "react-gauge-component";

const GaugeTemp = ({ data }) => {
  return (
    <>
    <Container >
      <Row >
        <Col style={{textAlign:"center", fontFamily:"cursive", fontSize: "1.5rem", color: "green"}}>ACTUAL TEMPERATURE</Col>
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
  value={data}
  minValue={-20}
  maxValue={60}
/>
<div style={{textAlign:"center"}}>
      <Button variant="outline-success" size="lg" style={{textAlign:"center", width: '50%', fontSize:"30px"}} >
        SAVE TO DB
      </Button>
    </div>
</>
  );
};

export default GaugeTemp;