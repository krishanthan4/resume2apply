"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { useJobBoardStore } from "@/app/store/useJobBoardStore";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Button } from "@/app/components/ui";


interface AddJobModalProps {
  onClose: () => void;
  onJobCreated: (job: any) => void;
  initialData?: any;
}

export default function AddJobModal({ onClose, onJobCreated, initialData }: AddJobModalProps) {
  const [formData, setFormData] = useState<any>({
    companyName: initialData?.companyName || "",
    appliedJobPosition: initialData?.appliedJobPosition || "",
    companyEmail: "",
    jobPostedDate: new Date().toISOString().split("T")[0],
    resumeData: initialData?.resumeData || null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData((prev: any) => ({
        ...prev,
        companyName: initialData.companyName || prev.companyName,
        appliedJobPosition: initialData.appliedJobPosition || prev.appliedJobPosition,
        resumeData: initialData.resumeData || prev.resumeData,
      }));
    }

    // 2. Consume from global store if available
    const pendingConfig = useJobBoardStore.getState().pendingResumeConfig;
    
    if (pendingConfig) {
      setFormData((prev: any) => ({
        ...prev,
        companyName: pendingConfig.targetCompany || prev.companyName,
        appliedJobPosition: pendingConfig.targetPosition || prev.appliedJobPosition,
        resumeData: { templateName: pendingConfig.type, customData: pendingConfig },
      }));
      
      const strictModeTimer = setTimeout(() => {
        useJobBoardStore.getState().clearPendingResumeConfig();
      }, 500);
      return () => clearTimeout(strictModeTimer);
    }
  }, [initialData]);

  const set = (field: string, value: string) =>
    setFormData((prev: any) => ({ ...prev, [field]: value }));

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, status: "willing_to_apply" }),
      });
      const json = await res.json();
      if (json.success) { 
        useJobBoardStore.getState().clearPendingResumeConfig();
        onJobCreated(json.data); 
        onClose(); 
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[4px] p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white border border-zinc-200 rounded-[16px] p-6 sm:p-7 w-full max-w-[420px] shadow-[0_20px_60px_rgba(0,0,0,0.12)] relative"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center bg-zinc-100 border border-zinc-200 rounded-[7px] cursor-pointer text-zinc-500 hover:text-zinc-800 transition-colors"
        >
          <X size={14} />
        </button>

        <h2 className="text-[17px] font-bold text-zinc-900 tracking-[-0.02em] mb-[22px]">
          New application
        </h2>

        <form onSubmit={handleCreateJob} className="flex flex-col gap-[14px]">
          <div>
            <Label>Position</Label>
            <Input
              type="text"
              required
              value={formData.appliedJobPosition}
              onChange={(e) => set("appliedJobPosition", e.target.value)}
              placeholder="e.g. Senior Fullstack Engineer"
            />
          </div>
          <div>
            <Label>Company name</Label>
            <Input
              type="text"
              required
              value={formData.companyName}
              onChange={(e) => set("companyName", e.target.value)}
              placeholder="e.g. Acme Corp"
            />
          </div>
          <div>
            <Label>Company email <span className="text-zinc-400 font-normal">(optional)</span></Label>
            <Input
              type="email"
              value={formData.companyEmail}
              onChange={(e) => set("companyEmail", e.target.value)}
              placeholder="careers@company.com"
            />
          </div>
          <div>
            <Label>Job posted date</Label>
            <Input
              type="date"
              required
              value={formData.jobPostedDate}
              onChange={(e) => set("jobPostedDate", e.target.value)}
              style={{ colorScheme: "light" }}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className={`mt-1.5 w-full py-[11px] ${isSubmitting ? "bg-zinc-300 pointer-events-none" : "bg-zinc-900 cursor-pointer"} text-white border-none rounded-[9px] text-[14px] font-semibold flex items-center justify-center gap-2`}
          >
            {isSubmitting && <Loader2 size={15} className="animate-spin" />}
            {isSubmitting ? "Saving…" : "Save application"}
          </Button>
        </form>
      </div>
    </div>
  );
}
