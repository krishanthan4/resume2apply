"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import JobMainInfo from "./JobMainInfo";
import JobSidebar from "./JobSidebar";
import { Button, ConfirmationModal } from "../ui";
import { useRouter } from "next/navigation";

interface JobDetailModalProps {
  job: any;
  onClose: () => void;
  onUpdate: (updatedJob: any) => void;
}

export default function JobDetailModal({ job, onClose, onUpdate }: JobDetailModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({ ...job });
  const [isSaving, setIsSaving] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [execTemplates, setExecTemplates] = useState<any[]>([]);
  const [scheduleOption, setScheduleOption] = useState<"smart" | "immediate" | "custom">("smart");
  const [customTime, setCustomTime] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isFetchingContacts, setIsFetchingContacts] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userConnection, setUserConnection] = useState<any>(null);

  useEffect(() => { setFormData({ ...job }); }, [job]);

  useEffect(() => {
    const f = async () => {
      try {
        const [r1, r2, r3] = await Promise.all([
          fetch("/api/cover-letters"),
          fetch("/api/templates/exec-summary"),
          fetch("/api/user/me")
        ]);
        const [j1, j2, j3] = await Promise.all([r1.json(), r2.json(), r3.json()]);
        if (j1.success) setTemplates(j1.data);
        if (j2.success) setExecTemplates(j2.data);
        if (j3.success) setUserConnection(j3.user.emailConnection);
      } catch (e) { console.error(e); }
    };
    f();
  }, []);

  const handleChange = (field: string, value: any) =>
    setFormData((prev: any) => ({ ...prev, [field]: value }));

  const handleContactChange = (index: number, field: string, value: string) => {
    const newContacts = [...(formData.contacts || [])];
    newContacts[index] = { ...newContacts[index], [field]: value };
    handleChange("contacts", newContacts);
  };

  const addContact = () =>
    handleChange("contacts", [...(formData.contacts || []), { name: "", role: "", email: "", linkedinUrl: "" }]);

  const removeContact = (index: number) => {
    const newContacts = [...(formData.contacts || [])];
    newContacts.splice(index, 1);
    handleChange("contacts", newContacts);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/jobs/${job._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.success) { onUpdate(json.data); onClose(); }
    } catch (e) { console.error(e); }
    finally { setIsSaving(false); }
  };

  const handleSendEmail = async () => {
    if (!userConnection?.provider || userConnection.provider === 'none') {
      toast.error("Please connect your Gmail or Outlook account in Settings before sending emails.");
      router.push("/dashboard/settings");
      return;
    }

    setIsSending(true);
    try {
      await fetch(`/api/jobs/${job._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const res = await fetch(`/api/jobs/${job._id}/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sendImmediately: scheduleOption === "immediate",
          customScheduleTime: scheduleOption === "custom" ? customTime : null,
          coverLetterId: formData.coverLetterId,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(scheduleOption === "immediate" ? "Email sent!" : `Scheduled for ${new Date(json.scheduledTime).toLocaleString()}`);
        onUpdate(json.data);
        onClose();
      } else {
        toast.error("Error: " + json.error);
      }
    } catch (e) { toast.error("Something went wrong"); }
    finally { setIsSending(false); }
  };

  const handleCancelEmail = async () => {
    if (!formData.resendEmailId) return;
    setIsCancelling(true);
    try {
      const res = await fetch(`/api/jobs/${job._id}/cancel-email`, { method: "POST" });
      const json = await res.json();
      if (json.success) { toast.success("Email cancelled."); onUpdate(json.data); }
      else toast.error("Error: " + json.error);
    } catch { toast.error("Something went wrong"); }
    finally { setIsCancelling(false); }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/jobs/${job._id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        toast.success("Job application deleted.");
        onUpdate(null);
        onClose();
      } else {
        toast.error("Error: " + json.error);
      }
    } catch (e) {
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white border-l border-zinc-200 flex flex-col w-full md:max-w-[780px] sm:max-w-[600px] h-full shadow-[-8px_0_40px_rgba(0,0,0,0.10)] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-3 border-b border-zinc-200 flex justify-between items-center shrink-0">
          <div className="flex flex-col sm:flex-row sm:gap-5 pr-2">
            <h2 className="text-lg font-bold text-zinc-900 tracking-tight leading-tight line-clamp-2">
              {formData.appliedJobPosition}
            </h2>
            <p className="text-[13px] text-zinc-500 mt-[3px] truncate">
              {formData.companyName}{formData.companyEmail ? ` · ${formData.companyEmail}` : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 shrink-0 flex items-center justify-center bg-zinc-100 border border-zinc-200 rounded-lg cursor-pointer text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5 flex flex-col gap-0">
          <div className="flex flex-col md:flex-row gap-5">

            {/* Left: Main info */}
            <JobMainInfo
              formData={formData}
              handleChange={handleChange}
              isFetchingContacts={isFetchingContacts}
              setIsFetchingContacts={setIsFetchingContacts}
            />

            {/* Right: Application actions */}
            <JobSidebar
              formData={formData}
              handleChange={handleChange}
              templates={templates}
              execTemplates={execTemplates}
              scheduleOption={scheduleOption}
              setScheduleOption={setScheduleOption}
              customTime={customTime}
              setCustomTime={setCustomTime}
              isSending={isSending}
              handleSendEmail={handleSendEmail}
              isCancelling={isCancelling}
              handleCancelEmail={handleCancelEmail}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-[14px] border-t border-zinc-200 flex justify-between items-center shrink-0 bg-white">
          <Button 
            variant="danger"
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-1.5 text-[13px] font-medium py-2 px-3 pl-2.5 transition-colors"
          >
            <Trash2 size={14} />
            Delete
          </Button>
          <div className="flex gap-2.5">
            <Button variant="secondary"
              onClick={onClose}
              className="text-[13px] font-medium text-zinc-500 bg-transparent border-none cursor-pointer py-2 px-4 hover:text-zinc-700 transition-colors"
            >
              Cancel
            </Button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 py-2 px-[18px] bg-zinc-900 text-white border-none rounded-lg text-[13px] font-semibold cursor-pointer disabled:bg-zinc-300 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
            >
              <Save size={14} />
              {isSaving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>
      
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Job Application"
        message="Are you sure you want to delete this job application? This action cannot be undone."
        confirmText="Delete Application"
        isDestructive={true}
      />
    </div>
  );
}
