"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { month: "Oca", revenue: 1200 },
  { month: "Şub", revenue: 1500 },
  { month: "Mar", revenue: 1800 },
  { month: "Nis", revenue: 2200 },
  { month: "May", revenue: 2400 }
];

/** Admin analytics page with revenue trend chart. */
export default function AdminAnalyticsPage() {
  return (
    <section>
      <h1 className="font-heading text-4xl text-secondary">Analitik</h1>
      <div className="mt-6 h-96 rounded-lg border bg-white p-4 shadow-sm">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#C0392B" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
