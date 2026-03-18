"use client";

import React from "react";
import KanbanCard from "./KanbanCard";

interface KanbanColumnProps {
  column: {
    id: string;
    title: string;
    color: string;
  };
  jobs: any[];
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, columnId: string) => void;
  onCardClick: (job: any) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
}

export default function KanbanColumn({
  column,
  jobs,
  onDragOver,
  onDrop,
  onCardClick,
  onDragStart,
  onDragEnd,
}: KanbanColumnProps) {
  // The parent job-apply page now handles the column header + drop zone wrapper.
  // This component renders just the card list inside the drop zone.
  return (
    <div
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, column.id)}
      style={{ display: "flex", flexDirection: "column", gap: 8, minHeight: 100 }}
    >
      {jobs.map((job) => (
        <KanbanCard
          key={job._id}
          job={job}
          onClick={() => onCardClick(job)}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />
      ))}
      {jobs.length === 0 && (
        <div
          style={{
            border: "1.5px dashed #e4e4e7",
            borderRadius: 10,
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            color: "#d4d4d8",
          }}
        >
          Drop here
        </div>
      )}
    </div>
  );
}
