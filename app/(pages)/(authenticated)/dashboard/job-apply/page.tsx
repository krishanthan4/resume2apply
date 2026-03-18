"use client";

import React, { useState, useEffect } from "react";
import { Plus, Loader2, FileText, Search } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useJobBoardStore } from "@/app/store/useJobBoardStore";
import JobDetailModal from "@/app/components/job-apply/JobDetailModal";
import CoverLetterTemplatesModal from "@/app/components/job-apply/CoverLetterTemplatesModal";
import KanbanColumn from "@/app/components/job-apply/KanbanColumn";
import AddJobModal from "@/app/components/job-apply/AddJobModal";

const COLUMNS = [
  { id: "willing_to_apply", title: "Wishlist", color: "#3b82f6" },
  { id: "applied", title: "Applied", color: "#a855f7" },
  { id: "in_progress", title: "In Progress", color: "#f59e0b" },
  { id: "rejected", title: "Rejected", color: "#ef4444" },
];

export default function JobApplyKanban() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCoverLetterModalOpen, setIsCoverLetterModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [initialJobData, setInitialJobData] = useState<any>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams && searchParams.get("newApplication") === "true") {
      // Delay opening modal slightly to ensure soft-transitions flow correctly
      setTimeout(() => {
        setIsModalOpen(true);
      }, 50);

      // Clean the URL without tracking a new history state.
      router.replace("/dashboard/job-apply", { scroll: false });
    }
  }, [searchParams, router]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/jobs");
        const json = await res.json();
        if (json.success) {
          setJobs(json.data);
          let jobIdToOpen = null;
          if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            jobIdToOpen = params.get("openJob");
          }
          if (jobIdToOpen) {
            const jobToOpen = json.data.find((j: any) => j._id === jobIdToOpen);
            if (jobToOpen) setSelectedJob(jobToOpen);
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }
      } catch (err) {
        console.error("Failed to fetch jobs");
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("jobId", id);
    (e.currentTarget as HTMLElement).style.opacity = "0.5";
  };
  const handleDragEnd = (e: React.DragEvent) => {
    (e.currentTarget as HTMLElement).style.opacity = "1";
  };
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = async (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    const jobId = e.dataTransfer.getData("jobId");
    setJobs((prev) => prev.map((job) => (job._id === jobId ? { ...job, status: columnId } : job)));
    try {
      await fetch(`/api/jobs/${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: columnId }),
      });
    } catch (err) {
      console.error("Failed to update status");
    }
  };

  const filteredJobs = (columnId: string) =>
    jobs.filter((job) => {
      const matchesSearch =
        job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.appliedJobPosition.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch || job.status !== columnId) return false;
      if (dateFilter === "all") return true;
      if (dateFilter === "scheduled") return job.scheduledEmailDate != null;
      const dateToCompare = job.appliedDate ? new Date(job.appliedDate) : new Date(job.createdAt);
      const today = new Date();
      if (dateFilter === "today") return dateToCompare.toDateString() === today.toDateString();
      if (dateFilter === "this_week") {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        return dateToCompare >= startOfWeek;
      }
      return true;
    });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, height: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.025em", color: "#18181b", marginBottom: 4 }}>
            Step 4 — Application Board
          </h1>
          <p style={{ fontSize: 14, color: "#71717a" }}>
            Drag cards across columns to track your applications.
          </p>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          {/* Search */}
          <div style={{ position: "relative" }}>
            <Search
              size={14}
              style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#a1a1aa" }}
            />
            <input
              type="text"
              placeholder="Search jobs…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
              style={{ paddingLeft: 32, width: 200, padding: "8px 12px 8px 30px", fontSize: 13 }}
            />
          </div>

          {/* Date filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="input-field"
            style={{ width: "auto", padding: "8px 12px", fontSize: 13 }}
          >
            <option value="all">All time</option>
            <option value="today">Today</option>
            <option value="this_week">This week</option>
            <option value="scheduled">Scheduled</option>
          </select>

          <button
            className="btn-secondary"
            style={{ fontSize: 13, padding: "8px 14px" }}
            onClick={() => setIsCoverLetterModalOpen(true)}
          >
            <FileText size={14} /> Cover Letters
          </button>

          <button
            className="btn-primary"
            style={{ fontSize: 13, padding: "8px 14px" }}
            onClick={() => { setInitialJobData(null); setIsModalOpen(true); }}
          >
            <Plus size={14} /> New application
          </button>
        </div>
      </div>

      {/* Kanban board */}
      {isLoading ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#a1a1aa" }}>
          <Loader2 size={28} className="animate-spin" />
        </div>
      ) : (
        <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 12, flex: 1 }} className="scrollbar-hide">
          {COLUMNS.map((col) => (
            <div
              key={col.id}
              style={{ minWidth: 240, flex: 1, display: "flex", flexDirection: "column", gap: 0 }}
            >
              {/* Column header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 12px",
                  background: "#fff",
                  border: "1px solid #e4e4e7",
                  borderBottom: "none",
                  borderRadius: "12px 12px 0 0",
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: col.color }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: "#18181b" }}>{col.title}</span>
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#a1a1aa",
                    background: "#f4f4f5",
                    padding: "2px 7px",
                    borderRadius: 99,
                  }}
                >
                  {filteredJobs(col.id).length}
                </span>
              </div>

              {/* Drop zone */}
              <div
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
                style={{
                  flex: 1,
                  background: "#fafafa",
                  border: "1px solid #e4e4e7",
                  borderRadius: "0 0 12px 12px",
                  padding: "10px",
                  minHeight: 300,
                }}
              >
                <KanbanColumn
                  column={{ id: col.id, title: col.title, color: `bg-[${col.color}]` }}
                  jobs={filteredJobs(col.id)}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onCardClick={setSelectedJob}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <AddJobModal
          onClose={() => setIsModalOpen(false)}
          onJobCreated={(newJob) => setJobs([newJob, ...jobs])}
          initialData={initialJobData}
        />
      )}
      {isCoverLetterModalOpen && (
        <CoverLetterTemplatesModal onClose={() => setIsCoverLetterModalOpen(false)} />
      )}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onUpdate={(updatedData) =>
            setJobs((prev) => prev.map((job) => (job._id === updatedData._id ? updatedData : job)))
          }
        />
      )}
    </div>
  );
}
