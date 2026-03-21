import { Plus, Trash2 } from "lucide-react";
import Field from "./Field";
import { Input } from "@/app/components/ui/Input";
import { TextArea } from "@/app/components/ui/TextArea";
import { Label } from "@/app/components/ui/Label";
import { Button } from "@/app/components/ui";


function ExperienceSection({ data, onChange }: { data: any, onChange: (d: any) => void }) {
  const items = data.experiences || [];
  const add = () => onChange({ ...data, experiences: [...items, { achievements: [""] }] });
  const remove = (idx: number) => { const n = [...items]; n.splice(idx, 1); onChange({ ...data, experiences: n }); };
  const update = (idx: number, key: string, val: any) => { const n = [...items]; n[idx][key] = val; onChange({ ...data, experiences: n }); };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: "#18181b" }}>Work Experience</h3>
        <Button variant='secondary' style={{ padding: "6px 12px", fontSize: 12 }} onClick={add}>
          <Plus size={13} /> Add
        </Button>
      </div>
      {items.map((item: any, i: number) => (
        <div key={i} style={{ background: "#fafafa", border: "1px solid #e4e4e7", borderRadius: 12, padding: "16px", position: "relative" }}>
          {items.length > 1 && (
            <Button onClick={() => remove(i)} style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", cursor: "pointer", color: "#a1a1aa", display: "flex", padding: 4 }}>
              <Trash2 size={14} />
            </Button>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
            <Field label="Company"><Input placeholder="Acme Corp" value={item.company || ""} onChange={(e) => update(i, "company", e.target.value)} /></Field>
            <Field label="Job Title"><Input placeholder="Software Engineer" value={item.title || ""} onChange={(e) => update(i, "title", e.target.value)} /></Field>
            <Field label="Start Date"><Input type="text" placeholder="Jan 2020" value={item.startDate || ""} onChange={(e) => update(i, "startDate", e.target.value)} /></Field>
            <Field label="End Date">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Input type="text" placeholder="Present" value={item.endDate || ""} onChange={(e) => update(i, "endDate", e.target.value)} disabled={item.current} />
                <Label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#71717a", cursor: "pointer", whiteSpace: "nowrap" }}>
                  <Input type="checkbox" checked={item.current || false} onChange={(e) => { update(i, "current", e.target.checked); if(e.target.checked) update(i, "endDate", "Present"); }} style={{ accentColor: "#18181b" }} />
                  Present
                </Label>
              </div>
            </Field>
          </div>
          <div style={{ marginTop: 14 }}>
            <Field label="Achievements (Bullet Points)">
              <TextArea placeholder={"- Developed key features...\n- Improved performance by 20%..."} value={(item.achievements || []).join("\n")} onChange={(e) => update(i, "achievements", e.target.value.split("\n"))} />
            </Field>
          </div>
        </div>
      ))}
      {items.length === 0 && (
         <div style={{ textAlign: "center", padding: 32, fontSize: 13, color: "#a1a1aa", background: "#fafafa", border: "1px dashed #e4e4e7", borderRadius: 8 }}>No experience entries. Click Add.</div>
      )}
    </div>
  );
}

export default ExperienceSection;
