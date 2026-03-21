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
      <div className="h-[60vh] flex items-center justify-center text-zinc-400">
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
    <div className="max-w-[900px] mx-auto">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-[26px] font-extrabold tracking-[-0.025em] text-zinc-900 mb-[6px]">
          Step 5 — Analytics
        </h1>
        <p className="text-sm text-zinc-500">
          Track your application activity and pipeline health.
        </p>
      </div>

  <div className="grid sm:grid-cols-2 grid-cols-1 w-full gap-3">
    {/* Metric cards */}
      <div className="cols-span-1 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-[14px] mb-6">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="bg-white  border text-zinc-500 border-zinc-200 rounded-[14px] px-5 pt-5 pb-[18px] shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
          >
            <p className="text-xs text-zinc-500 mb-2">{m.label}</p>
            <p className="text-4xl font-extrabold text-zinc-900 tracking-[-0.025em] leading-none">
              {m.value}
            </p>
          </div>
        ))}
      </div>

      {/* Pipeline chart */}
      <div className="cols-span-2 bg-white border border-zinc-200 rounded-[14px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <h2 className="text-[15px] font-bold text-zinc-900 mb-5">
          Pipeline breakdown
        </h2>
        {pieData.length === 0 ? (
          <div className="h-[200px] flex items-center justify-center text-zinc-400 text-sm">
            No applications tracked yet. Start adding jobs in Step 4.
          </div>
        ) : (
          <div className="h-[300px]">
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
                    <span className="text-xs text-zinc-500">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
  </div>
    </div>
  );
}
