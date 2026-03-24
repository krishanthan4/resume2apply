"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Plus, Loader2, FileText, Search } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import JobDetailModal from "@/app/components/job-apply/JobDetailModal";
import CoverLetterTemplatesModal from "@/app/components/job-apply/CoverLetterTemplatesModal";
import KanbanColumn from "@/app/components/job-apply/KanbanColumn";
import AddJobModal from "@/app/components/job-apply/AddJobModal";
import { Button } from "@/app/components/ui/Button";
import { Select } from "@/app/components/ui";

const COLUMNS = [
  { id: "willing_to_apply", title: "Wishlist", color: "#3b82f6" },
  { id: "applied", title: "Applied", color: "#a855f7" },
  { id: "in_progress", title: "In Progress", color: "#f59e0b" },
  { id: "rejected", title: "Rejected", color: "#ef4444" },
];

function JobApplyKanbanContent() {
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
    <div className="flex flex-col gap-5 h-full relative">
      {/* Header */}
      <div className="flex flex-col gap-4 ">
        <div className="">
          <h1 className="text-[26px] font-extrabold tracking-[-0.025em] text-zinc-900 mb-1">
            Step 3 — Application Board
          </h1>
          <p className="text-sm text-zinc-500">
            Drag cards across columns to track your applications.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
          {/* Search */}
          <div className="flex items-center gap-2 py-2 px-3 bg-white border border-zinc-200 rounded-lg">
            <Search size={14} className="text-zinc-400" />
            <input
              type="text"
              placeholder="Search jobs…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-[13px] hover:placeholder:text-zinc-600 focus:placeholder:text-zinc-600 transition-colors w-full sm:w-[180px] outline-none"
            />
          </div>

          <div className="flex gap-2.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
            {/* Date filter */}
            <Select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="input-field w-auto min-w-[110px] py-2 px-3 text-[13px]"
            >
              <option value="all">All time</option>
              <option value="today">Today</option>
              <option value="this_week">This week</option>
              <option value="scheduled">Scheduled</option>
            </Select>

            <Button
              variant="outline"
              className="text-[13px] min-w-max py-2 px-[14px]"
              onClick={() => setIsCoverLetterModalOpen(true)}
            >
              <FileText size={14} /> Cover Letters
            </Button>
          </div>
        </div>
      </div>

      {/* Kanban board */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center text-zinc-400">
          <Loader2 size={28} className="animate-spin" />
        </div>
      ) : (
        <div className="flex gap-[14px] overflow-x-auto pb-3 flex-1 scrollbar-hide">
          {COLUMNS.map((col) => (
            <div
              key={col.id}
              className="min-w-[240px] flex-1 flex flex-col gap-0"
            >
              {/* Column header */}
              <div
                className="flex items-center gap-2 py-2.5 px-3 bg-white border border-zinc-200 border-b-0 rounded-t-xl"
              >
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ background: col.color }} 
                />
                <span className="text-xs font-semibold text-zinc-900">{col.title}</span>
                <span
                  className="ml-auto text-[11px] font-semibold text-zinc-400 bg-zinc-100 py-0.5 px-[7px] rounded-full"
                >
                  {filteredJobs(col.id).length}
                </span>
              </div>

              {/* Drop zone */}
              <div
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
                className="flex-1 bg-zinc-50 border border-zinc-200 rounded-b-xl p-2.5 min-h-[300px]"
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

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-24 right-4 sm:hidden z-40">
        <Button
          className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center p-0"
          onClick={() => { setInitialJobData(null); setIsModalOpen(true); }}
        >
          <Plus size={24} />
        </Button>
      </div>
      
      {/* Desktop Add Button */}
      <div className="absolute top-0 right-0 hidden sm:block">
        <Button
          className="text-[13px] py-2 px-[14px]"
          onClick={() => { setInitialJobData(null); setIsModalOpen(true); }}
        >
          <Plus size={14} /> New application
        </Button>
      </div>

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
            setJobs((prev) => 
              updatedData === null
                ? prev.filter((job) => job._id !== selectedJob._id)
                : prev.map((job) => (job._id === updatedData._id ? updatedData : job))
            )
          }
        />
      )}
    </div>
  );
}

export default function JobApplyKanban() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center text-zinc-400">
        <Loader2 size={28} className="animate-spin" />
      </div>
    }>
      <JobApplyKanbanContent />
    </Suspense>
  );
}

