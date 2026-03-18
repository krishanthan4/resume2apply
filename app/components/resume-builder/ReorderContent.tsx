import React, { useState } from "react";
import { Reorder } from "framer-motion";
import { GripVertical, ChevronDown, ChevronUp } from "lucide-react";

export default function ReorderContent({ resumeData, setResumeData, config, setConfig }: { resumeData: any, setResumeData: any, config?: any, setConfig?: any }) {
  const [expandedExp, setExpandedExp] = useState<number | null>(null);
  const [expandedProj, setExpandedProj] = useState<number | null>(null);

  if (!resumeData) return null;

  const updateList = (key: string, newList: any) => {
    setResumeData({ ...resumeData, [key]: newList });
  };

  const handleExpChange = (index: number, field: string, value: any) => {
    const newList = [...resumeData.experiences];
    newList[index][field] = value;
    updateList("experiences", newList);
  };

  const handleProjChange = (index: number, field: string, value: any) => {
    const newList = [...resumeData.projects];
    newList[index][field] = value;
    updateList("projects", newList);
  };

  const handleSkillChange = (index: number, value: string) => {
    const newList = [...resumeData.skillsData];
    newList[index].skills = value.split(",").map((s: string) => s.trim()).filter(Boolean);
    updateList("skillsData", newList);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {/* SECTIONS REODERING */}
      {config?.sectionsOrder && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: "#18181b", display: "flex", alignItems: "center", gap: 6, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #e4e4e7", paddingBottom: 8 }}>
            Section Priority
          </h3>
          <Reorder.Group 
            axis="y" 
            values={config.sectionsOrder} 
            onReorder={(newOrder) => setConfig && setConfig({...config, sectionsOrder: newOrder})} 
            style={{ display: "flex", flexDirection: "column", gap: 8, listStyle: "none" }}
          >
            {config.sectionsOrder.map((secName: string) => (
              <Reorder.Item key={secName} value={secName} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: 8, boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}>
                <GripVertical size={14} style={{ color: "#a1a1aa", cursor: "grab" }} />
                <div style={{ fontSize: 13, fontWeight: 500, textTransform: "uppercase", color: "#18181b" }}>{secName.replace(/([A-Z])/g, ' $1').trim()}</div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      )}

      {/* EXPERIENCES */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <h3 style={{ fontSize: 13, fontWeight: 600, color: "#18181b", display: "flex", alignItems: "center", gap: 6, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #e4e4e7", paddingBottom: 8 }}>
          Experiences
        </h3>
        <Reorder.Group axis="y" values={resumeData.experiences || []} onReorder={(newList) => updateList("experiences", newList)} style={{ display: "flex", flexDirection: "column", gap: 8, listStyle: "none" }}>
          {(resumeData.experiences || []).map((exp: any, index: number) => (
            <Reorder.Item key={exp._key || index} value={exp} style={{ display: "flex", flexDirection: "column", gap: 12, padding: "12px", background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: 8, boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }} onClick={() => setExpandedExp(expandedExp === index ? null : index)}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <GripVertical size={14} style={{ color: "#a1a1aa", cursor: "grab" }} onClick={(e) => e.stopPropagation()} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "#18181b" }}>{exp.company}</div>
                    <div style={{ fontSize: 12, color: "#71717a" }}>{exp.title}</div>
                  </div>
                </div>
                {expandedExp === index ? <ChevronUp size={16} color="#71717a" /> : <ChevronDown size={16} color="#71717a" />}
              </div>
              
              {expandedExp === index && (
                <div style={{ paddingLeft: 26, display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ fontSize: 12, color: "#52525b" }}>Bullets (Achievements):</div>
                  <textarea 
                    className="textarea-field"
                    style={{ minHeight: 120, fontSize: 13 }}
                    value={(exp.achievements || []).join("\n")}
                    onChange={(e) => handleExpChange(index, "achievements", e.target.value.split("\n"))}
                    placeholder="One achievement per line..."
                  />
                </div>
              )}
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>

      {/* PROJECTS */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <h3 style={{ fontSize: 13, fontWeight: 600, color: "#18181b", display: "flex", alignItems: "center", gap: 6, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #e4e4e7", paddingBottom: 8 }}>
          Projects
        </h3>
        <Reorder.Group axis="y" values={resumeData.projects || []} onReorder={(newList) => updateList("projects", newList)} style={{ display: "flex", flexDirection: "column", gap: 8, listStyle: "none" }}>
          {(resumeData.projects || []).map((proj: any, index: number) => (
            <Reorder.Item key={proj._key || index} value={proj} style={{ display: "flex", flexDirection: "column", gap: 12, padding: "12px", background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: 8, boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }} onClick={() => setExpandedProj(expandedProj === index ? null : index)}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <GripVertical size={14} style={{ color: "#a1a1aa", cursor: "grab" }} onClick={(e) => e.stopPropagation()} />
                  <div style={{ fontSize: 14, fontWeight: 500, color: "#18181b" }}>{proj.title}</div>
                </div>
                {expandedProj === index ? <ChevronUp size={16} color="#71717a" /> : <ChevronDown size={16} color="#71717a" />}
              </div>
              
              {expandedProj === index && (
                <div style={{ paddingLeft: 26, display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ fontSize: 12, color: "#52525b" }}>Bullets (Description):</div>
                  <textarea 
                    className="textarea-field"
                    style={{ minHeight: 100, fontSize: 13 }}
                    value={(proj.description || []).join("\n")}
                    onChange={(e) => handleProjChange(index, "description", e.target.value.split("\n"))}
                    placeholder="One description point per line..."
                  />
                </div>
              )}
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>

      {/* SKILLS */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <h3 style={{ fontSize: 13, fontWeight: 600, color: "#18181b", display: "flex", alignItems: "center", gap: 6, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #e4e4e7", paddingBottom: 8 }}>
          Skills
        </h3>
        
        {config?.type?.includes("single") && (
          <div style={{ background: "#fafafa", border: "1px solid #e4e4e7", borderRadius: 8, padding: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: "#52525b", marginBottom: 8 }}>Custom Skills for Single CV (2 bullets)</div>
            <input 
              type="text" 
              className="input-field"
              style={{ padding: "6px 10px", fontSize: 13, marginBottom: 8 }}
              value={resumeData?.customSkillBullet1 || ""}
              onChange={(e) => {
                const newValue = e.target.value;
                setResumeData({ ...resumeData, customSkillBullet1: newValue });
                
                fetch("/api/resumeContent", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ 
                    _id: resumeData._id, 
                    customSkillBullet1: newValue,
                    customSkillBullet2: resumeData.customSkillBullet2
                  })
                });
              }}
              placeholder="Bullet point 1..."
            />
            <input 
              type="text" 
              className="input-field"
              style={{ padding: "6px 10px", fontSize: 13 }}
              value={resumeData?.customSkillBullet2 || ""}
              onChange={(e) => {
                const newValue = e.target.value;
                setResumeData({ ...resumeData, customSkillBullet2: newValue });
                
                fetch("/api/resumeContent", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ 
                    _id: resumeData._id, 
                    customSkillBullet1: resumeData.customSkillBullet1,
                    customSkillBullet2: newValue
                  })
                });
              }}
              placeholder="Bullet point 2..."
            />
          </div>
        )}

        <Reorder.Group axis="y" values={resumeData.skillsData || []} onReorder={(newList) => updateList("skillsData", newList)} style={{ display: "flex", flexDirection: "column", gap: 8, listStyle: "none", position: "relative" }}>
          {(resumeData.skillsData || []).map((skillGroup: any, index: number) => (
            <Reorder.Item key={skillGroup._key || index} value={skillGroup} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: 8, boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}>
              <GripVertical size={14} style={{ color: "#a1a1aa", cursor: "grab" }} />
              <div style={{ fontSize: 13, fontWeight: 500, color: "#18181b", width: 120 }}>{skillGroup.category}</div>
              <input 
                type="text" 
                className="input-field"
                style={{ flex: 1, padding: "6px 10px", fontSize: 13 }}
                value={(skillGroup.skills || []).join(", ")}
                onChange={(e) => handleSkillChange(index, e.target.value)}
                placeholder="Comma separated skills..."
                disabled={config?.type?.includes("single")}
              />
            </Reorder.Item>
          ))}
          {config?.type?.includes("single") && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.6)", borderRadius: 8, zIndex: 10 }}></div>
          )}
        </Reorder.Group>
      </div>
    </div>
  );
}
