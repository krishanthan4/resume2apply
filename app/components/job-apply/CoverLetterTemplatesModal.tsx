"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Plus, Trash2, Loader2 } from "lucide-react";
import { Input } from "@/app/components/ui/Input";
import { TextArea } from "@/app/components/ui/TextArea";
import { Label } from "@/app/components/ui/Label";
import { Button } from "@/app/components/ui";


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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-[4px]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-[900px] h-[90vh] md:h-[80vh] flex flex-col md:flex-row overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
        {/* Left: Template list */}
        <div className="w-full md:w-[240px] shrink-0 border-b md:border-b-0 md:border-r border-zinc-200 flex flex-col bg-zinc-50 max-h-[35vh] md:max-h-full">
          <div className="p-3.5 px-4 border-b border-zinc-200 flex justify-between items-center shrink-0">
            <span className="text-xs font-semibold text-zinc-900">Cover Letters</span>
            <button
              onClick={resetForm}
              className="flex items-center justify-center bg-transparent border-none cursor-pointer text-zinc-500 hover:text-zinc-800 transition-colors"
              title="New template"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
            {isLoading && (
              <div className="flex justify-center p-4">
                <Loader2 size={16} className="animate-spin text-zinc-400" />
              </div>
            )}
            {templates.map((t) => (
              <div
                key={t._id}
                onClick={() => handleEdit(t)}
                className={`p-2.5 px-3 rounded-[9px] border cursor-pointer flex justify-between items-start transition-colors ${
                  editingId === t._id 
                    ? "border-zinc-300 bg-white" 
                    : "border-transparent bg-transparent hover:bg-zinc-200/50"
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="text-[13px] font-semibold text-zinc-900 mb-0.5 truncate">{t.name}</div>
                  <div className="text-[11px] text-zinc-400 overflow-hidden text-ellipsis whitespace-nowrap">{t.subject}</div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(t._id); }}
                  className="bg-transparent border-none cursor-pointer text-zinc-300 hover:text-red-500 shrink-0 p-0.5 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
            {!isLoading && templates.length === 0 && (
              <p className="text-xs text-zinc-400 text-center py-5 px-2 italic">No templates yet.</p>
            )}
          </div>
        </div>

        {/* Right: Editor */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="p-3.5 px-5 border-b border-zinc-200 flex justify-between items-center shrink-0">
            <span className="text-[14px] font-semibold text-zinc-900">
              {editingId ? "Edit template" : "New template"}
            </span>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center bg-zinc-100 border border-zinc-200 rounded-[7px] cursor-pointer text-zinc-500 hover:bg-zinc-200 hover:text-zinc-800 transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 md:p-5 flex flex-col gap-4">
            <div>
              <Label className="text-xs font-medium text-zinc-600 mb-1.5 block">Template name</Label>
              <Input
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
              <Label className="text-xs font-medium text-zinc-600 mb-1.5 block">Email subject</Label>
              <Input
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Application for {{position}} at {{company}}"
                style={inputBase}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#d4d4d8")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e4e4e7")}
              />
              <p className="text-[11px] text-zinc-400 mt-1.5">
                Placeholders: {`{{company}}, {{position}}`}
              </p>
            </div>

            <div className="flex-1 flex flex-col min-h-[200px]">
              <Label className="text-xs font-medium text-zinc-600 mb-1.5 block">Email body</Label>
              <TextArea
                required
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={"Dear Hiring Manager,\n\nI am excited to apply for the {{position}} role at {{company}}...\n\nBest regards,\nMe"}
                style={{
                  ...inputBase,
                  flex: 1,
                  resize: "none",
                  lineHeight: 1.65,
                }}
                className="min-h-[150px] md:min-h-[200px]"
                onFocus={(e) => (e.currentTarget.style.borderColor = "#d4d4d8")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e4e4e7")}
              />
            </div>

            <div className="flex justify-end pt-3 md:pt-2 mt-1 md:mt-0 border-t border-zinc-200">
              <Button
                type="submit"
                disabled={!name || !subject || !body}
                className={`flex items-center gap-1.5 py-2 px-5 rounded-lg text-[13px] font-semibold transition-colors ${
                  !name || !subject || !body 
                    ? "bg-zinc-300 text-white pointer-events-none" 
                    : "bg-zinc-900 text-white hover:bg-zinc-800"
                }`}
              >
                <Save size={14} />
                {editingId ? "Update" : "Save template"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
