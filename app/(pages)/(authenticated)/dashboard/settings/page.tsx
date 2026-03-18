"use client";

import React from "react";
import { Sun } from "lucide-react";

export default function SettingsPage() {
  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.025em", color: "#18181b", marginBottom: 6 }}>
          Settings
        </h1>
        <p style={{ fontSize: 14, color: "#71717a" }}>
          Platform configuration for your Resume2Apply workspace.
        </p>
      </div>

      {/* Card */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e4e4e7",
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #f4f4f5" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#18181b" }}>Appearance</div>
        </div>

        <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: "#18181b", marginBottom: 3 }}>Theme</div>
            <div style={{ fontSize: 12, color: "#71717a" }}>
              This platform uses a clean white theme. Dark mode coming soon.
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 14px",
              background: "#f4f4f5",
              border: "1px solid #e4e4e7",
              borderRadius: 99,
              fontSize: 13,
              fontWeight: 500,
              color: "#52525b",
            }}
          >
            <Sun size={14} /> Light
          </div>
        </div>
      </div>

      {/* About card */}
      <div
        style={{
          marginTop: 14,
          background: "#fff",
          border: "1px solid #e4e4e7",
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #f4f4f5" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#18181b" }}>About</div>
        </div>
        <div style={{ padding: "20px 24px" }}>
          <dl style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              ["Platform", "Resume2Apply"],
              ["Version", "0.1.0"],
              ["Mode", "Self-hosted"],
              ["Database", "MongoDB (Mongoose)"],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
                <dt style={{ fontSize: 13, color: "#71717a" }}>{label}</dt>
                <dd style={{ fontSize: 13, fontWeight: 500, color: "#18181b" }}>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}