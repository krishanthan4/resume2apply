import Field from "./Field";
import { Input } from "@/app/components/ui/Input";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/app/components/ui";


function EducationSection({ data, onChange }: { data: any, onChange: (d: any) => void }) {
  const items = data.educations || [];
  const add = () => onChange({ ...data, educations: [...items, {}] });
  const remove = (idx: number) => { const n = [...items]; n.splice(idx, 1); onChange({ ...data, educations: n }); };
  const update = (idx: number, key: string, val: any) => { const n = [...items]; n[idx][key] = val; onChange({ ...data, educations: n }); };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: "#18181b" }}>Education</h3>
        <Button className="btn-secondary" style={{ padding: "6px 12px", fontSize: 12 }} onClick={add}>
          <Plus size={13} /> Add
        </Button>
      </div>
      {items.map((item: any, i: number) => (
        <div key={i} style={{ background: "#fafafa", border: "1px solid #e4e4e7", borderRadius: 12, padding: "16px", position: "relative" }}>
          <Button onClick={() => remove(i)} style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", cursor: "pointer", color: "#a1a1aa", display: "flex", padding: 4 }}>
            <Trash2 size={14} />
          </Button>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
            <Field label="Degree Name"><Input placeholder="BSc in Computer Science" value={item.degree || ""} onChange={(e) => update(i, "degree", e.target.value)} /></Field>
            <Field label="Institution"><Input placeholder="University of Technology" value={item.institution || ""} onChange={(e) => update(i, "institution", e.target.value)} /></Field>
            <Field label="Location (City, Country)"><Input placeholder="Colombo, SL" value={item.location || ""} onChange={(e) => update(i, "location", e.target.value)} /></Field>
            <Field label="Graduation Date"><Input type="text" placeholder="2022" value={item.endDate || ""} onChange={(e) => update(i, "endDate", e.target.value)} /></Field>
          </div>
        </div>
      ))}
      {items.length === 0 && (
         <div style={{ textAlign: "center", padding: 32, fontSize: 13, color: "#a1a1aa", background: "#fafafa", border: "1px dashed #e4e4e7", borderRadius: 8 }}>No education entries. Click Add.</div>
      )}
    </div>
  );
}

export default EducationSection;