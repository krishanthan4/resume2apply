import React, { useState } from "react";
import { Loader2, Check, FileText } from "lucide-react";

export default function TemplateCreator({ onTemplateCreated }: { onTemplateCreated?: () => void }) {
  const [title, setTitle] = useState("");
  const [shortSummery, setShortSummery] = useState("");
  const [detailedSummery, setDetailedSummery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || (!shortSummery && !detailedSummery)) return;

    setIsSubmitting(true);
    setSuccess(false);
    try {
      const payload = { type: "executiveSummaryTemplate", title, shortSummery, detailedSummery };

      const response = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setSuccess(true);
        setTitle("");
        setShortSummery("");
        setDetailedSummery("");
        if (onTemplateCreated) onTemplateCreated();
      } else {
        alert("Failed to create template.");
      }
    } catch (error) {
      console.error(error);
      alert("Error occurred.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div style={{ background: "#fafafa", border: "1px solid #e4e4e7", borderRadius: 8, padding: 16 }}>
      <h3 style={{ fontSize: 12, fontWeight: 600, color: "#18181b", display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
        <FileText size={14} /> Create Template
      </h3>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 500, color: "#52525b" }}>Template Title</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
            placeholder="e.g. Frontend Developer" 
            required
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 500, color: "#52525b" }}>Short Summary (Used for Single CV)</label>
          <textarea 
            value={shortSummery}
            onChange={(e) => setShortSummery(e.target.value)}
            className="textarea-field"
            style={{ minHeight: 70 }}
            placeholder="Short summary..."
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 500, color: "#52525b" }}>Detailed Summary (Used for Detailed CV)</label>
          <textarea 
            value={detailedSummery}
            onChange={(e) => setDetailedSummery(e.target.value)}
            className="textarea-field"
            style={{ minHeight: 90 }}
            placeholder="Detailed summary..."
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting || !title || (!shortSummery && !detailedSummery)}
          className="btn-primary"
          style={{ width: "100%", marginTop: 4 }}
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" size={14} /> 
          ) : success ? (
            <Check size={14} />
          ) : null}
          {isSubmitting ? "Saving..." : success ? "Created!" : "Save Template"}
        </button>
      </form>
    </div>
  );
}
