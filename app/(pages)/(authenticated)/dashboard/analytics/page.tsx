"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const STATUS_COLORS: Record<string, string> = {
  willing_to_apply: "#3b82f6",
  applied: "#a855f7",
  in_progress: "#f59e0b",
  rejected: "#ef4444",
};

const STATUS_LABELS: Record<string, string> = {
  willing_to_apply: "Wishlist",
  applied: "Applied",
  in_progress: "In Progress",
  rejected: "Rejected",
};

export default function AnalyticsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/jobs");
        const json = await res.json();
        if (json.success) setJobs(json.data);
      } catch (err) {
        console.error("Failed to fetch jobs");
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (isLoading) {
    return (
      <div style={{ height: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#a1a1aa" }}>
        <Loader2 size={28} className="animate-spin" />
      </div>
    );
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const appliedJobs = jobs.filter((j) => j.status !== "willing_to_apply");
  const todayCount = appliedJobs.filter((j) => new Date(j.createdAt) >= startOfToday).length;
  const weekCount = appliedJobs.filter((j) => new Date(j.createdAt) >= startOfWeek).length;
  const monthCount = appliedJobs.filter((j) => new Date(j.createdAt) >= startOfMonth).length;

  const statusCounts = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(statusCounts)
    .map(([status, value]) => ({
      name: STATUS_LABELS[status] || status,
      value: value as number,
      color: STATUS_COLORS[status] || "#a1a1aa",
    }))
    .filter((d) => d.value > 0);

  const metrics = [
    { label: "Applied Today", value: todayCount, accent: "#18181b" },
    { label: "This Week", value: weekCount, accent: "#18181b" },
    { label: "This Month", value: monthCount, accent: "#18181b" },
    { label: "Total Tracked", value: jobs.length, accent: "#18181b" },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.025em", color: "#18181b", marginBottom: 6 }}>
          Step 5 — Analytics
        </h1>
        <p style={{ fontSize: 14, color: "#71717a" }}>
          Track your application activity and pipeline health.
        </p>
      </div>

      {/* Metric cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 24 }}>
        {metrics.map((m) => (
          <div
            key={m.label}
            style={{
              background: "#fff",
              border: "1px solid #e4e4e7",
              borderRadius: 14,
              padding: "20px 20px 18px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <p style={{ fontSize: 12, color: "#71717a", marginBottom: 8 }}>{m.label}</p>
            <p style={{ fontSize: 36, fontWeight: 800, color: "#18181b", letterSpacing: "-0.025em", lineHeight: 1 }}>
              {m.value}
            </p>
          </div>
        ))}
      </div>

      {/* Pipeline chart */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e4e4e7",
          borderRadius: 14,
          padding: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#18181b", marginBottom: 20 }}>
          Pipeline breakdown
        </h2>
        {pieData.length === 0 ? (
          <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "#a1a1aa", fontSize: 14 }}>
            No applications tracked yet. Start adding jobs in Step 4.
          </div>
        ) : (
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={110}
                  innerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #e4e4e7",
                    borderRadius: 8,
                    fontSize: 12,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span style={{ fontSize: 12, color: "#71717a" }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
