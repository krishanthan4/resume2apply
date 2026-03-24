"use client";

import React from "react";
import { Loader2, Plus } from "lucide-react";
import { Button, Input } from "@/app/components/ui";

interface TargetCompaniesHeaderProps {
  newCompanyName: string;
  setNewCompanyName: (val: string) => void;
  isAdding: boolean;
  addCompany: (e: React.FormEvent) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  viewMode: "detailed" | "short";
  setViewMode: (val: "detailed" | "short") => void;
}

export function TargetCompaniesHeader({
  newCompanyName,
  setNewCompanyName,
  isAdding,
  addCompany,
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
}: TargetCompaniesHeaderProps) {
  return (
    <div className="flex flex-col gap-4 w-full mb-7">
      <div className="flex justify-between items-start flex-wrap gap-3.5">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-[-0.025em] text-zinc-900 mb-1">
            Step 5 — Target Companies
          </h1>
          <p className="text-sm text-zinc-500">
            Organise companies you want to work at and track your connections.
          </p>
        </div>

        <form onSubmit={addCompany} className="flex gap-2">
          <Input
            type="text"
            placeholder="Company name…"
            value={newCompanyName}
            onChange={(e) => setNewCompanyName(e.target.value)}
            className="input-field w-[200px] text-[13px]"
          />
          <Button
            type="submit"
            disabled={isAdding || !newCompanyName.trim()}
            className="btn-primary text-[13px]"
          >
            {isAdding ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            Add
          </Button>
        </form>
      </div>

      <div className="flex justify-between items-center gap-3">
        <Input
          type="text"
          placeholder="Search by company, details, contact names..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field max-w-[400px] w-full text-[13px] bg-white"
        />

        <div className="flex bg-zinc-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode("detailed")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewMode === "detailed"
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            Detailed
          </button>
          <button
            onClick={() => setViewMode("short")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewMode === "short"
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            Short
          </button>
        </div>
      </div>
    </div>
  );
}
