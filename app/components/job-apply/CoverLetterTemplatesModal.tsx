"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Plus, Trash2, Loader2 } from "lucide-react";

export default function CoverLetterTemplatesModal({ onClose }: { onClose: () => void }) {
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/cover-letters");
      const json = await res.json();
      if (json.success) setTemplates(json.data);
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchTemplates(); }, []);

  const handleEdit = (tmpl: any) => {
    setEditingId(tmpl._id);
    setName(tmpl.name);
    setSubject(tmpl.subject);
    setBody(tmpl.body);
  };

  const resetForm = () => { setEditingId(null); setName(""); setSubject(""); setBody(""); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/cover-letters/${editingId}` : "/api/cover-letters";
      await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, subject, body }),
      });
      resetForm();
      fetchTemplates();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/cover-letters/${id}`, { method: "DELETE" });
      fetchTemplates();
    } catch (err) { console.error(err); }
  };

  const inputBase: React.CSSProperties = {
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
          width: "100%",
          maxWidth: 900,
          height: "80vh",
          display: "flex",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
        }}
      >
        {/* Left: Template list */}
        <div
          style={{
            width: 240,
            flexShrink: 0,
            borderRight: "1px solid #e4e4e7",
            display: "flex",
            flexDirection: "column",
            background: "#fafafa",
          }}
        >
          <div style={{ padding: "14px 16px", borderBottom: "1px solid #e4e4e7", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#18181b" }}>Cover Letters</span>
            <button
              onClick={resetForm}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: "#71717a" }}
              title="New template"
            >
              <Plus size={16} />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: 8, display: "flex", flexDirection: "column", gap: 4 }}>
            {isLoading && (
              <div style={{ display: "flex", justifyContent: "center", padding: 16 }}>
                <Loader2 size={16} className="animate-spin" style={{ color: "#a1a1aa" }} />
              </div>
            )}
            {templates.map((t) => (
              <div
                key={t._id}
                onClick={() => handleEdit(t)}
                style={{
                  padding: "10px 12px",
                  borderRadius: 9,
                  border: editingId === t._id ? "1px solid #d4d4d8" : "1px solid transparent",
                  background: editingId === t._id ? "#fff" : "transparent",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (editingId !== t._id) (e.currentTarget as HTMLElement).style.background = "#f0f0f0";
                }}
                onMouseLeave={(e) => {
                  if (editingId !== t._id) (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#18181b", marginBottom: 2 }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: "#a1a1aa", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 150 }}>{t.subject}</div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(t._id); }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#d4d4d8", flexShrink: 0, marginLeft: 6, padding: 2 }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
            {!isLoading && templates.length === 0 && (
              <p style={{ fontSize: 12, color: "#a1a1aa", textAlign: "center", padding: "20px 8px", fontStyle: "italic" }}>No templates yet.</p>
            )}
          </div>
        </div>

        {/* Right: Editor */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #e4e4e7", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#18181b" }}>
              {editingId ? "Edit template" : "New template"}
            </span>
            <button
              onClick={onClose}
              style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f4f5", border: "1px solid #e4e4e7", borderRadius: 7, cursor: "pointer", color: "#71717a" }}
            >
              <X size={14} />
            </button>
          </div>

          <form onSubmit={handleSave} style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: "#52525b", marginBottom: 5, display: "block" }}>Template name</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Frontend General"
                style={inputBase}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#d4d4d8")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e4e4e7")}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: "#52525b", marginBottom: 5, display: "block" }}>Email subject</label>
              <input
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Application for {{position}} at {{company}}"
                style={inputBase}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#d4d4d8")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e4e4e7")}
              />
              <p style={{ fontSize: 11, color: "#a1a1aa", marginTop: 5 }}>
                Placeholders: {`{{company}}, {{position}}`}
              </p>
            </div>

            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: "#52525b", marginBottom: 5, display: "block" }}>Email body</label>
              <textarea
                required
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={"Dear Hiring Manager,\n\nI am excited to apply for the {{position}} role at {{company}}...\n\nBest regards,\nMe"}
                style={{
                  ...inputBase,
                  flex: 1,
                  resize: "none",
                  lineHeight: 1.65,
                  minHeight: 200,
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#d4d4d8")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e4e4e7")}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 8, borderTop: "1px solid #e4e4e7" }}>
              <button
                type="submit"
                disabled={!name || !subject || !body}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "9px 20px",
                  background: !name || !subject || !body ? "#d4d4d8" : "#18181b",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: !name || !subject || !body ? "not-allowed" : "pointer",
                }}
              >
                <Save size={14} />
                {editingId ? "Update" : "Save template"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
