import React from "react";
import { ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Line, Scatter, ComposedChart } from "recharts";

interface TopRoute {
  route: string;
  totalRevenue: number;
  count: number;
}

interface LollipopChartProps {
  data: TopRoute[];
  language: "vi" | "en";
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "white", border: "1px solid #eee", borderRadius: 8, padding: 10, boxShadow: "0 2px 8px #0001" }}>
        <div><b>Route:</b> {payload[0].payload.route}</div>
        <div><b>Revenue:</b> {payload[0].payload.totalRevenue.toLocaleString()} VND</div>
        <div><b>Tickets:</b> {payload[0].payload.count}</div>
      </div>
    );
  }
  return null;
};

const LollipopChart: React.FC<LollipopChartProps> = ({ data, language }) => {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart
        layout="vertical"
        data={data}
        margin={{ top: 24, right: 32, left: 8, bottom: 24 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis type="number" fontSize={14} tickLine={false} axisLine={false} tickFormatter={v => v.toLocaleString()} />
        <YAxis dataKey="route" type="category" fontSize={14} tickLine={false} axisLine={false} width={180} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f3f3' }} />
        {/* Lollipop: line + circle */}
        <Line dataKey="totalRevenue" stroke="#222" strokeWidth={3} dot={false} />
        <Scatter dataKey="totalRevenue" fill="#1976d2" shape="circle" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default LollipopChart;
