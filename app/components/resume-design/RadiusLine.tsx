import React from "react";

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
    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: "#52525b" }}>{label}</label>
        <span style={{ fontSize: 12, color: "#71717a", fontFamily: "monospace" }}>{value}{unit}</span>
      </div>
      <input
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
