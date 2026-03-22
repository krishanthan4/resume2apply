"use client";
import React, { useState } from "react";
import { FileText, Plus } from "lucide-react";
import TemplateCreator from "./TemplateCreator";
import ExecutiveSummaryTemplateSeletor from "./Selectors/ExecutiveSummaryTemplateSeletor";
import { Input } from "@/app/components/ui/Input";
import { Label } from "@/app/components/ui/Label";
import { Button } from "@/app/components/ui";


interface TemplatesTabContentProps {
  config: any;
  setConfig: React.Dispatch<React.SetStateAction<any>>;
  execTemplates: any[];
  refreshTemplates: () => Promise<void>;
}

export default function TemplatesTabContent({
  config,
  setConfig,
  execTemplates,
  refreshTemplates,
}: TemplatesTabContentProps) {
  const [showTemplateCreator, setShowTemplateCreator] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e4e4e7", paddingBottom: 8 }}>
        <h3 style={{ fontSize: 13, fontWeight: 600, color: "#18181b", display: "flex", alignItems: "center", gap: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          <FileText size={14} /> Custom CV Data
        </h3>
        <Button
          onClick={() => setShowTemplateCreator(!showTemplateCreator)}
          className="btn-secondary"
          style={{ padding: "4px 8px", fontSize: 11 }}
        >
          <Plus size={12} /> New Template
        </Button>
      </div>

      {showTemplateCreator && (
        <TemplateCreator
          onTemplateCreated={() => {
            refreshTemplates();
            setShowTemplateCreator(false);
          }}
        />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <Label style={{ fontSize: 12, fontWeight: 500, color: "#52525b" }}>Applying Company Name</Label>
          <Input
            type="text"
            value={config.targetCompany || ""}
            onChange={(e) => setConfig({ ...config, targetCompany: e.target.value })}
            className="input-field"
            placeholder="Enter company name..."
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <Label style={{ fontSize: 12, fontWeight: 500, color: "#52525b" }}>Applying Job Position</Label>
          <Input
            type="text"
            value={config.targetPosition || ""}
            onChange={(e) => setConfig({ ...config, targetPosition: e.target.value })}
            className="input-field"
            placeholder="Enter job position..."
          />
        </div>
        
        <ExecutiveSummaryTemplateSeletor config={config} setConfig={setConfig} execTemplates={execTemplates} />
      </div>
    </div>
  );
}
