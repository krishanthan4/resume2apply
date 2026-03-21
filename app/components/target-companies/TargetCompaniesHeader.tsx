"use client";

import React from "react";
import { Loader2, Plus } from "lucide-react";
import { Button, Input } from "@/app/components/ui";

interface TargetCompaniesHeaderProps {
  newCompanyName: string;
  setNewCompanyName: (val: string) => void;
  isAdding: boolean;
  addCompany: (e: React.FormEvent) => void;
}

export function TargetCompaniesHeader({
  newCompanyName,
  setNewCompanyName,
  isAdding,
  addCompany,
}: TargetCompaniesHeaderProps) {
  return (
    <div className="flex justify-between items-start flex-wrap gap-3.5 mb-7">
      <div>
        <h1 className="text-[26px] font-extrabold tracking-[-0.025em] text-zinc-900 mb-1">
          Step 3 — Target Companies
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
  );
}
