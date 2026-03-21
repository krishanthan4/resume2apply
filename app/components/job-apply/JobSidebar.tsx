"use client";

import React from "react";
import { X, Mail, CalendarClock } from "lucide-react";
import { Label, Select, Input } from "@/app/components/ui";

export default function JobSidebar({
  formData,
  handleChange,
  templates,
  execTemplates,
  scheduleOption,
  setScheduleOption,
  customTime,
  setCustomTime,
  isSending,
  handleSendEmail,
  isCancelling,
  handleCancelEmail,
}: any) {
  return (
    <div className="md:w-[240px] w-full shrink-0 flex flex-col gap-3.5">
      <div className=" border border-zinc-200 rounded-xl p-4 flex flex-col gap-3.5">
        <h3 className="text-[12px] font-semibold text-zinc-500 uppercase tracking-[0.06em]">
          Application
        </h3>

        <div>
          <Label>Cover Letter</Label>
          <Select
            value={formData.coverLetterId || ""}
            onChange={(e) => handleChange("coverLetterId", e.target.value)}
          >
            <option  value="">— None —</option>
            {templates.map((t: any) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label>Executive Summary</Label>
          <Select
            value={formData.execSummaryId || ""}
            onChange={(e) => handleChange("execSummaryId", e.target.value)}
          >
            <option value="">— Default CV —</option>
            {execTemplates.map((t: any) => (
              <option key={t._id} value={t._id}>
                {t.title}
              </option>
            ))}
          </Select>
          {formData.resumeData?.customData && (
            <div className="mt-2 text-[11px] text-zinc-500 flex justify-between items-center bg-zinc-100 px-2.5 py-1.5 rounded-md">
              <span>Custom CV attached</span>
              <button
                type="button"
                onClick={() => handleChange("resumeData", null)}
                className="bg-transparent border-none cursor-pointer text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          )}
        </div>

        <div>
          <Label>Send option</Label>
          <Select
            value={scheduleOption}
            onChange={(e) => setScheduleOption(e.target.value)}
          >
            <option value="smart">Smart schedule</option>
            <option value="immediate">Send immediately</option>
            <option value="custom">Custom date & time</option>
          </Select>
          {scheduleOption === "custom" && (
            <Input
              type="datetime-local"
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
              className="mt-2"
            />
          )}
        </div>

        <button
          onClick={handleSendEmail}
          disabled={
            isSending ||
            !formData.companyEmail ||
            (scheduleOption === "custom" && !customTime)
          }
          className="w-full py-2.5 bg-blue-600 text-white border-none rounded-lg text-[13px] font-semibold cursor-pointer flex items-center justify-center gap-1.5 transition-colors disabled:bg-zinc-300 disabled:cursor-not-allowed hover:bg-blue-700"
        >
          {scheduleOption === "immediate" ? <Mail size={14} /> : <CalendarClock size={14} />}
          {isSending
            ? "Processing…"
            : scheduleOption === "immediate"
            ? "Send now"
            : "Schedule email"}
        </button>

        {formData.scheduledEmailDate && (
          <div className="text-[11px] text-amber-600 bg-amber-50 border border-amber-200 rounded-lg py-2 px-2.5 flex flex-col gap-2">
            <span>
              Scheduled: {new Date(formData.scheduledEmailDate).toLocaleString()}
            </span>
            {formData.resendEmailId && (
              <button
                onClick={handleCancelEmail}
                disabled={isCancelling}
                className="text-[11px] text-red-500 bg-red-50 border border-red-200 rounded-md py-[5px] px-2.5 font-semibold cursor-pointer hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                {isCancelling ? "Stopping…" : "Cancel email"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
