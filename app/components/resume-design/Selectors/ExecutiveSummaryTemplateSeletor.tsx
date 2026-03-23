import React from "react";
import { Label } from "@/app/components/ui/Label";
import { Select } from "@/app/components/ui/Select";

export default function ExecutiveSummaryTemplateSeletor({
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
      <Label style={{ fontSize: 12, fontWeight: 500, color: "#52525b" }}>
        Executive Summary Template
      </Label>
      {(execTemplates || []).length === 0 ? (
        <div style={{ fontSize: 12, color: "#71717a", fontStyle: "italic" }}>
          No templates found. Create one.
        </div>
      ) : (
        <Select
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
        </Select>
      )}
    </div>
  );
}