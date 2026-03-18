import React from "react";

interface ToggleOptionProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleOption({ label, checked, onChange }: ToggleOptionProps) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", marginBottom: 12 }}>
      <div 
        style={{
          width: 32,
          height: 18,
          borderRadius: 10,
          background: checked ? "#18181b" : "#e4e4e7",
          position: "relative",
          transition: "background 0.2s"
        }}
      >
        <div 
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "#ffffff",
            position: "absolute",
            top: 2,
            left: checked ? 16 : 2,
            transition: "left 0.2s",
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
          }}
        />
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ display: "none" }}
      />
      <span style={{ fontSize: 13, color: "#18181b", fontWeight: 500 }}>{label}</span>
    </label>
  );
}

export default ToggleOption;