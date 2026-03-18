import React from "react";

export default function ExecutiveSummeryTemplateSeletor({
  config,
  setConfig,
  execTemplates,
}: {
  config: any;
  setConfig: React.Dispatch<React.SetStateAction<any>>;
  execTemplates: any[];
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: "#52525b" }}>
        Executive Summary Template
      </label>
      {(execTemplates || []).length === 0 ? (
        <div style={{ fontSize: 12, color: "#71717a", fontStyle: "italic" }}>
          No templates found. Create one.
        </div>
      ) : (
        <select
          value={config.execTemplateId || ""}
          onChange={(e) => setConfig({ ...config, execTemplateId: e.target.value })}
          className="input-field"
        >
          <option value="">-- Select Template --</option>
          {execTemplates.map((t) => (
            <option key={t._id} value={t._id}>
              {t.title}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}