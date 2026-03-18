import React from "react";

export default function CoverLetterTemplateSelector({
  config,
  setConfig,
  templates,
}: {
  config: any;
  setConfig: any;
  templates: any[];
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: "#52525b" }}>Select Cover Letter Template</label>
      <select
        className="input-field"
        value={config.coverLetterTemplateId || ""}
        onChange={(e) => setConfig({ ...config, coverLetterTemplateId: e.target.value })}
      >
        <option value="">-- None --</option>
        {templates.map((t) => (
          <option key={t._id} value={t._id}>
            {t.name}
          </option>
        ))}
      </select>
    </div>
  );
}