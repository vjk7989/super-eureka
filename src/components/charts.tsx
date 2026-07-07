"use client";

import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function DiseaseStageChart({ data }: { data: Array<{ name: string; value: number }> }) {
  const colors = ["#16a34a", "#facc15", "#fb923c", "#ea580c", "#dc2626"];
  return (
    <div className="h-72 rounded-lg border border-border bg-card p-4">
      <h2 className="text-sm font-semibold">Disease Stage Mix</h2>
      <ResponsiveContainer width="100%" height="88%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
            {data.map((entry, index) => <Cell key={entry.name} fill={colors[index % colors.length]} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TrendChart() {
  const data = [
    { month: "Feb", affected: 142, inspections: 88 },
    { month: "Mar", affected: 188, inspections: 132 },
    { month: "Apr", affected: 214, inspections: 176 },
    { month: "May", affected: 260, inspections: 210 },
    { month: "Jun", affected: 319, inspections: 284 },
    { month: "Jul", affected: 342, inspections: 301 }
  ];
  return (
    <div className="h-72 rounded-lg border border-border bg-card p-4">
      <h2 className="text-sm font-semibold">Disease And Inspection Trend</h2>
      <ResponsiveContainer width="100%" height="88%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line dataKey="affected" stroke="#dc2626" strokeWidth={2} />
          <Line dataKey="inspections" stroke="#0f766e" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ConfidenceChart() {
  const data = [
    { band: "50-60", count: 11 },
    { band: "60-70", count: 24 },
    { band: "70-80", count: 42 },
    { band: "80-90", count: 55 },
    { band: "90-100", count: 31 }
  ];
  return (
    <div className="h-72 rounded-lg border border-border bg-card p-4">
      <h2 className="text-sm font-semibold">Confidence Distribution</h2>
      <ResponsiveContainer width="100%" height="88%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="band" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#0f766e" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
