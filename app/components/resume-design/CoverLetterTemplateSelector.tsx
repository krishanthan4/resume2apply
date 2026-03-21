import React from "react";
import { Label } from "@/app/components/ui/Label";
import { Select } from "@/app/components/ui/Select";

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
      <Label style={{ fontSize: 12, fontWeight: 500, color: "#52525b" }}>Select Cover Letter Template</Label>
      <Select
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
      </Select>
    </div>
  );
}