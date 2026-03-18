import { RotateCcw } from 'lucide-react'
import React from 'react'

interface SectionTitleWithResetProps {
  title: string;
  icon: React.ReactNode;
  onReset: () => void;
}

export default function SectionTitleWithReset({ title, icon, onReset }: SectionTitleWithResetProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e4e4e7", paddingBottom: 8, marginBottom: 16 }}>
      <h3 style={{ fontSize: 13, fontWeight: 600, color: "#18181b", display: "flex", alignItems: "center", gap: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {icon}
        {title}
      </h3>
      <button
        type="button"
        onClick={onReset}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 24,
          height: 24,
          background: "transparent",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          color: "#71717a",
          transition: "background 0.15s, color 0.15s"
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "#f4f4f5"; e.currentTarget.style.color = "#18181b"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#71717a"; }}
        title="Reset settings"
      >
        <RotateCcw size={14} />
      </button>
    </div>
  )
}
