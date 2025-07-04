import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

interface RevenueDay {
  year: number;
  month: number;
  date: number;
  total: number;
}

interface RevenueBarChartProps {
  data: RevenueDay[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "white", border: "1px solid #eee", borderRadius: 8, padding: 10, boxShadow: "0 2px 8px #0001" }}>
        <div><b>Ngày:</b> {label}</div>
        <div><b>Doanh thu:</b> {payload[0].value.toLocaleString()} VND</div>
      </div>
    );
  }
  return null;
};

const RevenueBarChart: React.FC<RevenueBarChartProps> = ({ data }) => {
  // Format lại nhãn ngày cho trục X
  const chartData = data.map(item => ({
    name: `${item.date}/${item.month}`,
    total: item.total
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={chartData} margin={{ top: 24, right: 32, left: 8, bottom: 24 }}>
        <defs>
          <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#222222" stopOpacity={1}/>
            <stop offset="100%" stopColor="#b0b0b0" stopOpacity={1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey="name" fontSize={14} tickLine={false} axisLine={false} />
        <YAxis fontSize={14} tickLine={false} axisLine={false} tickFormatter={v => v.toLocaleString()} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f3f3' }} />
        <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ color: '#222222', fontWeight: 600, fontSize: 18 }} />
        <Bar dataKey="total" fill="url(#colorBar)" radius={[8, 8, 0, 0]} barSize={36} name="Doanh thu" isAnimationActive={true} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RevenueBarChart;
