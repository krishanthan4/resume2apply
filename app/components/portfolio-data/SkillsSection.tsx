import { Plus, Trash2 } from "lucide-react";
import Field from "./Field";
import Textarea from "./TextArea";
import Input from "./Input";

function SkillsSection({ data, onChange }: { data: any, onChange: (d: any) => void }) {
  const items = data.skillsData || [];
  const add = () => onChange({ ...data, skillsData: [...items, { category: "", skills: [] }] });
  const remove = (idx: number) => { const n = [...items]; n.splice(idx, 1); onChange({ ...data, skillsData: n }); };
  const update = (idx: number, key: string, val: any) => { const n = [...items]; n[idx][key] = val; onChange({ ...data, skillsData: n }); };

  const updateCustom = (key: string, val: string) => onChange({ ...data, [key]: val });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: "#18181b" }}>Skills</h3>
        <button className="btn-secondary" style={{ padding: "6px 12px", fontSize: 12 }} onClick={add}>
          <Plus size={13} /> Add Category
        </button>
      </div>
      {items.map((item: any, i: number) => (
        <div key={i} style={{ background: "#fafafa", border: "1px solid #e4e4e7", borderRadius: 12, padding: "16px", position: "relative" }}>
          <button onClick={() => remove(i)} style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", cursor: "pointer", color: "#a1a1aa", display: "flex", padding: 4 }}>
            <Trash2 size={14} />
          </button>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Field label="Category Name (optional)"><Input placeholder="e.g. Frontend Development" value={item.category || ""} onChange={(e) => update(i, "category", e.target.value)} /></Field>
            <Field label="Skills (comma separated)">
              <Textarea placeholder="React, Next.js, TypeScript..." style={{ minHeight: 64 }} value={(item.skills || []).join(",")} onChange={(e) => update(i, "skills", e.target.value.split(","))} />
            </Field>
          </div>
        </div>
      ))}
      {items.length === 0 && (
         <div style={{ textAlign: "center", padding: 32, fontSize: 13, color: "#a1a1aa", background: "#fafafa", border: "1px dashed #e4e4e7", borderRadius: 8 }}>No skill entries. Click Add.</div>
      )}

      <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid #e4e4e7", display: "flex", flexDirection: "column", gap: 16 }}>
        <h4 style={{ fontSize: 13, fontWeight: 700, color: "#18181b" }}>Custom Skill Bullets (Single Page)</h4>
        <Field label="Custom Bullet 1">
          <Input placeholder="e.g. Expert in cloud architecture and distributed systems" value={data.customSkillBullet1 || ""} onChange={(e) => updateCustom("customSkillBullet1", e.target.value)} />
        </Field>
        <Field label="Custom Bullet 2">
          <Input placeholder="e.g. Proven track record of delivering 10+ high-traffic apps" value={data.customSkillBullet2 || ""} onChange={(e) => updateCustom("customSkillBullet2", e.target.value)} />
        </Field>
      </div>
    </div>
  );
}

export default SkillsSection;