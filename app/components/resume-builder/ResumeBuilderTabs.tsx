import React from "react";

function ResumeBuilderTabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div style={{ display: "flex", borderBottom: "1px solid #e4e4e7", gap: 16 }}>
      {[
        { id: "styles", label: "Styles" },
        { id: "content", label: "Content" },
        { id: "custom", label: "Custom" },
      ].map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => setActiveTab(tab.id)}
          style={{
            padding: "8px 4px",
            background: "transparent",
            border: "none",
            borderBottom: activeTab === tab.id ? "2px solid #18181b" : "2px solid transparent",
            color: activeTab === tab.id ? "#18181b" : "#71717a",
            fontSize: 13,
            fontWeight: activeTab === tab.id ? 600 : 500,
            cursor: "pointer",
            transition: "all 0.15s ease",
            marginBottom: -1,
          }}
          onMouseEnter={(e) => {
            if (activeTab !== tab.id) e.currentTarget.style.color = "#18181b";
          }}
          onMouseLeave={(e) => {
            if (activeTab !== tab.id) e.currentTarget.style.color = "#71717a";
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default ResumeBuilderTabs;
