import React, { memo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

const RechartVisualize = ({ data }) => {
  if (!data || !data.dataset || !Array.isArray(data.dataset)) return null;

  const { chartType = "bar", title = "Data Visualization", dataset } = data;

  const renderChart = () => {
    switch (chartType.toLowerCase()) {
      case "line":
        return (
          <LineChart data={dataset}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={12} />
            <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
            <Tooltip 
              contentStyle={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
              itemStyle={{ color: "#fff" }}
            />
            <Legend />
            {Object.keys(dataset[0]).filter(k => k !== "name").map((key, index) => (
              <Line key={key} type="monotone" dataKey={key} stroke={COLORS[index % COLORS.length]} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            ))}
          </LineChart>
        );
      case "area":
        return (
          <AreaChart data={dataset}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={12} />
            <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
            <Tooltip 
              contentStyle={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
              itemStyle={{ color: "#fff" }}
            />
            <Legend />
            {Object.keys(dataset[0]).filter(k => k !== "name").map((key, index) => (
              <Area key={key} type="monotone" dataKey={key} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} fillOpacity={0.3} />
            ))}
          </AreaChart>
        );
      case "pie":
        return (
          <PieChart>
            <Pie
              data={dataset}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {dataset.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
              itemStyle={{ color: "#fff" }}
            />
            <Legend />
          </PieChart>
        );
      case "radar":
        return (
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={dataset}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={10} />
            <PolarRadiusAxis stroke="rgba(255,255,255,0.2)" fontSize={10} />
            {Object.keys(dataset[0]).filter(k => k !== "name").map((key, index) => (
              <Radar key={key} name={key} dataKey={key} stroke={COLORS[index % COLORS.length]} fill={COLORS[index % COLORS.length]} fillOpacity={0.5} />
            ))}
            <Tooltip 
              contentStyle={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
              itemStyle={{ color: "#fff" }}
            />
            <Legend />
          </RadarChart>
        );
      case "bar":
      default:
        return (
          <BarChart data={dataset}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={12} />
            <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
            <Tooltip 
              contentStyle={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
              itemStyle={{ color: "#fff" }}
            />
            <Legend />
            {Object.keys(dataset[0]).filter(k => k !== "name").map((key, index) => (
              <Bar key={key} dataKey={key} fill={COLORS[index % COLORS.length]} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        );
    }
  };

  return (
    <div className="w-full my-6 p-6 rounded-3xl bg-slate-900/50 border border-white/5 backdrop-blur-md shadow-2xl animate-fade-in overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
        <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
          {chartType}
        </div>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default memo(RechartVisualize);
