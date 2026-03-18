function LeftNavPanel({activeTab, setActiveTab, TABS, activeIdx}:{
    activeTab: string;
    setActiveTab: (tab: string) => void;
    TABS: any[];
    activeIdx: number;
}) {
    return (
       <aside style={{ width: 180, flexShrink: 0 }}>
          <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {TABS.map((tab, i) => {
              const isActive = tab.id === activeTab;
              const isDone = i < activeIdx;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8,
                    background: isActive ? "#f4f4f5" : "transparent", border: "none", cursor: "pointer",
                    textAlign: "left", width: "100%", transition: "background 0.15s",
                  }}
                >
                  <div
                    style={{
                      width: 20, height: 20, borderRadius: "50%",
                      background: isDone ? "#18181b" : isActive ? "#18181b" : "#fff",
                      border: isDone || isActive ? "none" : "1.5px solid #d4d4d8",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#fff",
                    }}
                  >
                    {isDone ? (
                      <span style={{ fontSize: 9, fontWeight: 700 }}>✓</span>
                    ) : (
                      <span style={{ fontSize: 9, fontWeight: 700, color: isActive ? "#fff" : "#a1a1aa" }}>{i + 1}</span>
                    )}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, color: isActive ? "#18181b" : "#71717a" }}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>
    )
}

export default LeftNavPanel