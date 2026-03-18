"use client";

import React from "react";
import { GripVertical, Building, Clock, Mail } from "lucide-react";

interface KanbanCardProps {
  job: any;
  onClick: () => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
}

export default function KanbanCard({ job, onClick, onDragStart, onDragEnd }: KanbanCardProps) {
  return (
    <div
      draggable
      onClick={onClick}
      onDragStart={(e) => onDragStart(e, job._id)}
      onDragEnd={onDragEnd}
      style={{
        background: "#ffffff",
        border: "1px solid #e4e4e7",
        borderRadius: 10,
        padding: "12px 14px",
        cursor: "pointer",
        transition: "box-shadow 0.15s, border-color 0.15s, transform 0.1s",
        position: "relative",
        userSelect: "none",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
        (e.currentTarget as HTMLElement).style.borderColor = "#d4d4d8";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
        (e.currentTarget as HTMLElement).style.borderColor = "#e4e4e7";
      }}
    >
      {/* Drag handle */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          color: "#d4d4d8",
          opacity: 0,
          transition: "opacity 0.15s",
        }}
        className="drag-handle"
      >
        <GripVertical size={14} />
      </div>

      {/* Role + company */}
      <div style={{ marginBottom: 8, paddingRight: 20 }}>
        <h3 style={{ fontSize: 13, fontWeight: 600, color: "#18181b", lineHeight: 1.35, marginBottom: 4 }}>
          {job.appliedJobPosition}
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <Building size={12} color="#a1a1aa" />
          <span style={{ fontSize: 12, color: "#71717a" }}>{job.companyName}</span>
        </div>
      </div>

      {/* Badges */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {job.jobPostedDate && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 10,
              color: "#71717a",
              background: "#f4f4f5",
              border: "1px solid #e4e4e7",
              padding: "3px 7px",
              borderRadius: 5,
            }}
          >
            <Clock size={10} />
            {new Date(job.jobPostedDate).toLocaleDateString()}
          </div>
        )}
        {job.scheduledEmailDate && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 10,
              color: "#f59e0b",
              background: "#fef9ec",
              border: "1px solid #fde68a",
              padding: "3px 7px",
              borderRadius: 5,
            }}
          >
            <Mail size={10} />
            Scheduled
          </div>
        )}
      </div>
    </div>
  );
}
