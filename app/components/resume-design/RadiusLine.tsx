import React from "react";
import { Input } from "@/app/components/ui/Input";
import { Label } from "@/app/components/ui/Label";

interface RadiusLineProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
}

function RadiusLine({ label, value, min, max, step, unit = "px", onChange }: RadiusLineProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column",marginBottom: 5 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Label style={{ fontSize: 13, fontWeight: 500, color: "#52525b" }}>{label}</Label>
        <span style={{ fontSize: 12, color: "#71717a", fontFamily: "monospace" }}>{value}{unit}</span>
      </div>
      <Input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: "100%", cursor: "pointer" }}
        className="accent-zinc-900"
      />
    </div>
  );
}

export default RadiusLine;
