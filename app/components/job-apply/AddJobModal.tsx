"use client";

import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";

interface AddJobModalProps {
  onClose: () => void;
  onJobCreated: (job: any) => void;
  initialData?: any;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  background: "#fff",
  border: "1px solid #e4e4e7",
  borderRadius: 8,
  fontSize: 13,
  color: "#18181b",
  outline: "none",
  fontFamily: "inherit",
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 500,
  color: "#52525b",
  marginBottom: 5,
  display: "block",
};

export default function AddJobModal({ onClose, onJobCreated, initialData }: AddJobModalProps) {
  const [formData, setFormData] = useState<any>({
    companyName: initialData?.companyName || "",
    appliedJobPosition: initialData?.appliedJobPosition || "",
    companyEmail: "",
    jobPostedDate: new Date().toISOString().split("T")[0],
    resumeData: initialData?.resumeData || null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      if (json.success) { onJobCreated(json.data); onClose(); }
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
            <label style={labelStyle}>Position</label>
            <input
              type="text"
              required
              value={formData.appliedJobPosition}
              onChange={(e) => set("appliedJobPosition", e.target.value)}
              placeholder="e.g. Senior Fullstack Engineer"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#d4d4d8")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#e4e4e7")}
            />
          </div>
          <div>
            <label style={labelStyle}>Company name</label>
            <input
              type="text"
              required
              value={formData.companyName}
              onChange={(e) => set("companyName", e.target.value)}
              placeholder="e.g. Acme Corp"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#d4d4d8")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#e4e4e7")}
            />
          </div>
          <div>
            <label style={labelStyle}>Company email <span style={{ color: "#a1a1aa", fontWeight: 400 }}>(optional)</span></label>
            <input
              type="email"
              value={formData.companyEmail}
              onChange={(e) => set("companyEmail", e.target.value)}
              placeholder="careers@company.com"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#d4d4d8")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#e4e4e7")}
            />
          </div>
          <div>
            <label style={labelStyle}>Job posted date</label>
            <input
              type="date"
              required
              value={formData.jobPostedDate}
              onChange={(e) => set("jobPostedDate", e.target.value)}
              style={{ ...inputStyle, colorScheme: "light" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#d4d4d8")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#e4e4e7")}
            />
          </div>

          <button
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
          </button>
        </form>
      </div>
    </div>
  );
}
