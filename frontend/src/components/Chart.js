import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Label,
} from "recharts";

const data = [
  {
    name: "Page A",
    uv: -20,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 0,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 10,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 23,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 60,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 15,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 21,
    pv: 4300,
    amt: 2100,
  },
];

export default function Chart() {
  return (
    
    <AreaChart
      fontSize={30}
        width={1000}
      height={300}
      data={data}
      margin={{
        top: 10,
        right: 30,
        left: 10,
        bottom: 10,
      }
    }
      
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" style={{ fontSize: "10px" }} >
        <Label position='insideBottomRight' style={{ fontSize: "20px"}} >
            Time
        </Label>
      </XAxis>

      <YAxis style={{ fontSize: "20" }} label={{ fontSize: "20px" }}>
        <Label position='insideLeft' angle="-90" style={{ fontSize: "20px"}}>
            Temp, gr.C
        </Label>
      </YAxis>
      <Tooltip />
      <Area type="monotone" dataKey="uv" stroke="#19181a" fill="#3bed47" baseValue={20} />
    </AreaChart>
  );
}