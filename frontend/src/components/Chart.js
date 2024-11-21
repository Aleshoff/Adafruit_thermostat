import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Label,
} from "recharts";

const gradientOffset = (data) => {
  console.log(data);
  const dataMax = Math.max(...data.map((i) => i.temperature));
  const dataMin = Math.min(...data.map((i) => i.temperature));

  if (dataMax <= 20) {
    return 0;
  }
  if (dataMin >= 20) {
    return 1;
  }

  return dataMax / (dataMax - dataMin);
};


export default function Chart(data) {
  
  const off = gradientOffset(data.data);
  
  return (
    <>
    <Container >
      <Row >
        <Col style={{textAlign:"center", fontFamily:"cursive", fontSize: "1.5rem", color: "blue"}}>LAST 10 MEASUREMENTS</Col>
      </Row>
    </Container>
    <AreaChart
      fontSize={30}
      width={1000}
      height={300}
      data={data.data}
      margin={{
        top: 10,
        right: 30,
        left: 10,
        bottom: 10,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="time" style={{ fontSize: "10px" }} interval={1}>
        <Label position="insideBottomRight" style={{ fontSize: "20px" }}>
          Time
        </Label>
      </XAxis>

      <YAxis style={{ fontSize: "20" }} label={{ fontSize: "20px" }} minTickGap={2} interval={0} ticks={[-20, 0, 20, 40, 60]} >
        <Label position="insideLeft" angle="-90" style={{ fontSize: "20px" }}>
          Temp, gr.C
        </Label>
      </YAxis>
      <Tooltip />
      <defs>
        <linearGradient id="splitColor" x1="0" y1="-1" x2="0" y2="1">
          <stop  offset={off} stopColor="red" stopOpacity={1} />
          <stop  offset={off} stopColor="green" stopOpacity={1} />
        </linearGradient>
      </defs>
      <Area
        type="monotone"
        dataKey="temperature"
        stroke="#19181a"
        fill="url(#splitColor)"
        baseValue={20}
      />
    </AreaChart>
    </>
  );
}
