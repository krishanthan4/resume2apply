"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Mail, CalendarClock, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "../ui/Input";
import { TextArea } from "../ui/TextArea";
import { Select } from "../ui/Select";
import { Label } from "../ui/Label";
import { Button } from "@/app/components/ui";


const S = {
  overlay: {
    position: "fixed" as const,
    inset: 0,
    zIndex: 50,
    display: "flex",
    justifyContent: "flex-end",
    background: "rgba(0,0,0,0.4)",
    backdropFilter: "blur(4px)",
  },
  panel: {
    background: "#fff",
    borderLeft: "1px solid #e4e4e7",
    display: "flex",
    flexDirection: "column" as const,
    width: "100%",
    maxWidth: 780,
    height: "100%",
    boxShadow: "-8px 0 40px rgba(0,0,0,0.10)",
    overflow: "hidden",
  }
};

interface JobDetailModalProps {
  job: any;
  onClose: () => void;
  onUpdate: (updatedJob: any) => void;
}

export default function JobDetailModal({ job, onClose, onUpdate }: JobDetailModalProps) {
  const [formData, setFormData] = useState({ ...job });
  const [isSaving, setIsSaving] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [execTemplates, setExecTemplates] = useState<any[]>([]);
  const [scheduleOption, setScheduleOption] = useState<"smart" | "immediate" | "custom">("smart");
  const [customTime, setCustomTime] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isFetchingContacts, setIsFetchingContacts] = useState(false);

  useEffect(() => { setFormData({ ...job }); }, [job]);

  useEffect(() => {
    const f = async () => {
      try {
        const [r1, r2] = await Promise.all([fetch("/api/cover-letters"), fetch("/api/templates/exec-summary")]);
        const [j1, j2] = await Promise.all([r1.json(), r2.json()]);
        if (j1.success) setTemplates(j1.data);
        if (j2.success) setExecTemplates(j2.data);
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

  return (
    <div style={S.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={S.panel}>
        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #e4e4e7", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexShrink: 0 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#18181b", letterSpacing: "-0.02em" }}>
              {formData.appliedJobPosition}
            </h2>
            <p style={{ fontSize: 13, color: "#71717a", marginTop: 3 }}>
              {formData.companyName}{formData.companyEmail ? ` · ${formData.companyEmail}` : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f4f5", border: "1px solid #e4e4e7", borderRadius: 8, cursor: "pointer", color: "#71717a" }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 0 }}>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>

            {/* Left: Main info */}
            <div style={{ flex: 1, minWidth: 280, display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <Label>Job Description</Label>
                <TextArea
                  rows={5}
                  value={formData.jobDescription || ""}
                  onChange={(e) => handleChange("jobDescription", e.target.value)}
                  placeholder="Paste the job description here..."
                />
              </div>

              <div>
                <Label>Company Notes</Label>
                <TextArea
                  rows={3}
                  value={formData.companyDetails || ""}
                  onChange={(e) => handleChange("companyDetails", e.target.value)}
                  placeholder="Notes about the company..."
                />
              </div>

              {/* Contacts */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <Label style={{ marginBottom: 0 }}>Contacts</Label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {formData.companyName && (
                      <Button
                        type="button"
                        onClick={async () => {
                          setIsFetchingContacts(true);
                          try {
                            const res = await fetch("/api/jobs/fetch-contacts", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ companyName: formData.companyName }),
                            });
                            const data = await res.json();
                            if (data.success && data.contacts?.length > 0) {
                              setFormData((prev: any) => ({
                                ...prev,
                                contacts: [...(prev.contacts || []), ...data.contacts],
                              }));
                            }
                          } catch (e) { console.error(e); }
                          finally { setIsFetchingContacts(false); }
                        }}
                        disabled={isFetchingContacts}
                        style={{ fontSize: 11, color: "#3b82f6", background: "none", border: "none", cursor: "pointer" }}
                      >
                        {isFetchingContacts ? "Fetching…" : "Auto-fetch from LinkedIn"}
                      </Button>
                    )}
                    <Button
                      type="button"
                      onClick={addContact}
                      style={{ fontSize: 11, color: "#71717a", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}
                    >
                      <Plus size={12} /> Add
                    </Button>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {(!formData.contacts || formData.contacts.length === 0) ? (
                    <p style={{ fontSize: 12, color: "#a1a1aa", fontStyle: "italic" }}>No contacts yet. Add hiring managers here.</p>
                  ) : formData.contacts.map((contact: any, idx: number) => (
                    <div
                      key={idx}
                      style={{ background: "#fafafa", border: "1px solid #e4e4e7", borderRadius: 10, padding: "12px", position: "relative" }}
                    >
                      <Button
                        type="button"
                        onClick={() => removeContact(idx)}
                        style={{ position: "absolute", top: 10, right: 10, background: "none", border: "none", cursor: "pointer", color: "#d4d4d8" }}
                      >
                        <Trash2 size={13} />
                      </Button>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, paddingRight: 20 }}>
                        <Input placeholder="Name" value={contact.name || ""} onChange={(e) => handleContactChange(idx, "name", e.target.value)} />
                        <Input placeholder="Role" value={contact.role || ""} onChange={(e) => handleContactChange(idx, "role", e.target.value)} />
                        <Input placeholder="Email" value={contact.email || ""} onChange={(e) => handleContactChange(idx, "email", e.target.value)} style={{ gridColumn: "span 2" }} />
                        <Input placeholder="LinkedIn URL" value={contact.linkedinUrl || ""} onChange={(e) => handleContactChange(idx, "linkedinUrl", e.target.value)} style={{ gridColumn: "span 2" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Application actions */}
            <div style={{ width: 240, flexShrink: 0, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ background: "#fafafa", border: "1px solid #e4e4e7", borderRadius: 12, padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
                <h3 style={{ fontSize: 12, fontWeight: 600, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.06em" }}>Application</h3>

                <div>
                  <Label>Cover Letter</Label>
                  <Select value={formData.coverLetterId || ""} onChange={(e) => handleChange("coverLetterId", e.target.value)}>
                    <option value="">— None —</option>
                    {templates.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
                  </Select>
                </div>

                <div>
                  <Label>Executive Summary</Label>
                  <Select value={formData.execSummaryId || ""} onChange={(e) => handleChange("execSummaryId", e.target.value)}>
                    <option value="">— Default CV —</option>
                    {execTemplates.map((t) => <option key={t._id} value={t._id}>{t.title}</option>)}
                  </Select>
                  {formData.resumeData?.customData && (
                    <div style={{ marginTop: 8, fontSize: 11, color: "#71717a", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f4f4f5", padding: "6px 10px", borderRadius: 6 }}>
                      <span>Custom CV attached</span>
                      <Button type="button" onClick={() => handleChange("resumeData", null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#a1a1aa" }}>
                        <X size={12} />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Send option */}
                <div>
                  <Label>Send option</Label>
                  <Select value={scheduleOption} onChange={(e) => setScheduleOption(e.target.value as any)}>
                    <option value="smart">Smart schedule</option>
                    <option value="immediate">Send immediately</option>
                    <option value="custom">Custom date & time</option>
                  </Select>
                  {scheduleOption === "custom" && (
                    <Input
                      type="datetime-local"
                      value={customTime}
                      onChange={(e) => setCustomTime(e.target.value)}
                      style={{ marginTop: 8 }}
                    />
                  )}
                </div>

                <Button
                  onClick={handleSendEmail}
                  disabled={isSending || !formData.companyEmail || (scheduleOption === "custom" && !customTime)}
                  style={{
                    width: "100%",
                    padding: "10px 0",
                    background: isSending ? "#d4d4d8" : "#2563eb",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: isSending ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  {scheduleOption === "immediate" ? <Mail size={14} /> : <CalendarClock size={14} />}
                  {isSending ? "Processing…" : scheduleOption === "immediate" ? "Send now" : "Schedule email"}
                </Button>

                {formData.scheduledEmailDate && (
                  <div style={{ fontSize: 11, color: "#f59e0b", background: "#fef9ec", border: "1px solid #fde68a", borderRadius: 8, padding: "8px 10px", display: "flex", flexDirection: "column", gap: 8 }}>
                    <span>Scheduled: {new Date(formData.scheduledEmailDate).toLocaleString()}</span>
                    {formData.resendEmailId && (
                      <Button
                        onClick={handleCancelEmail}
                        disabled={isCancelling}
                        style={{ fontSize: 11, color: "#ef4444", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontWeight: 600 }}
                      >
                        {isCancelling ? "Stopping…" : "Cancel email"}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 24px", borderTop: "1px solid #e4e4e7", display: "flex", justifyContent: "flex-end", gap: 10, flexShrink: 0, background: "#fff" }}>
          <Button
            type="button"
            onClick={onClose}
            style={{ fontSize: 13, fontWeight: 500, color: "#71717a", background: "none", border: "none", cursor: "pointer", padding: "8px 16px" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 18px",
              background: isSaving ? "#d4d4d8" : "#18181b",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: isSaving ? "not-allowed" : "pointer",
            }}
          >
            <Save size={14} />
            {isSaving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
