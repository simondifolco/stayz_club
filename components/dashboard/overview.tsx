"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  {
    name: "Jan",
    views: 2400,
    clicks: 240,
  },
  {
    name: "Feb",
    views: 1398,
    clicks: 139,
  },
  {
    name: "Mar",
    views: 9800,
    clicks: 980,
  },
  {
    name: "Apr",
    views: 3908,
    clicks: 390,
  },
  {
    name: "May",
    views: 4800,
    clicks: 480,
  },
  {
    name: "Jun",
    views: 3800,
    clicks: 380,
  },
  {
    name: "Jul",
    views: 4300,
    clicks: 430,
  },
];

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="views"
          stroke="#8884d8"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="clicks"
          stroke="#82ca9d"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
} 