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
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(4px)",
        padding: 16,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "#fff",
          border: "1px solid #e4e4e7",
          borderRadius: 16,
          padding: "28px 28px 24px",
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
          position: "relative",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f4f4f5",
            border: "1px solid #e4e4e7",
            borderRadius: 7,
            cursor: "pointer",
            color: "#71717a",
          }}
        >
          <X size={14} />
        </button>

        <h2 style={{ fontSize: 17, fontWeight: 700, color: "#18181b", letterSpacing: "-0.02em", marginBottom: 22 }}>
          New application
        </h2>

        <form onSubmit={handleCreateJob} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
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
            <Label>Company email <span style={{ color: "#a1a1aa", fontWeight: 400 }}>(optional)</span></Label>
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
            style={{
              marginTop: 6,
              width: "100%",
              padding: "11px 0",
              background: isSubmitting ? "#d4d4d8" : "#18181b",
              color: "#fff",
              border: "none",
              borderRadius: 9,
              fontSize: 14,
              fontWeight: 600,
              cursor: isSubmitting ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {isSubmitting && <Loader2 size={15} className="animate-spin" />}
            {isSubmitting ? "Saving…" : "Save application"}
          </Button>
        </form>
      </div>
    </div>
  );
}
