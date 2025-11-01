
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const SclAttd = ({ data }) => {
  // Fallback example data if none provided
  const sampleData = [
    { day: "Mon", value: 85 },
    { day: "Tue", value: 92 },
    { day: "Wed", value: 78 },
    { day: "Thu", value: 88 },
    { day: "Fri", value: 95 },
  ];

  const chartData = data || sampleData;

  return (
    <div className="w-full h-79 ">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis
            dataKey="day"
            stroke="#111827" /* gray-900 */
            tick={{ fill: "#111827", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            hide={true}
            domain={[0, 100]}
          />
          <Tooltip
            cursor={{ fill: "rgba(0,0,0,0.05)" }}
            contentStyle={{
              background: "rgba(255,255,255,0.9)",
              border: "1px solid #9ca3af", // gray-400
              borderRadius: "8px",
              color: "#111827",
              fontSize: "12px",
            }}
          />
          <Bar
            dataKey="value"
            radius={[6, 6, 0, 0]}
            fill="url(#barGradient)"
            barSize={18}
          />
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1f2937" /> {/* gray-800 top */}
              <stop offset="100%" stopColor="#9ca3af" /> {/* gray-400 bottom */}
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SclAttd;
