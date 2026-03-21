import { Plus, Trash2 } from "lucide-react";
import Field from "./Field";
import { Input } from "@/app/components/ui/Input";
import { TextArea } from "@/app/components/ui/TextArea";
import { Button } from "@/app/components/ui";


function ProjectsSection({ data, onChange }: { data: any, onChange: (d: any) => void }) {
  const items = data.projects || [];
  const add = () => onChange({ ...data, projects: [...items, { description: [""], techStack: "" }] });
  const remove = (idx: number) => { const n = [...items]; n.splice(idx, 1); onChange({ ...data, projects: n }); };
  const update = (idx: number, key: string, val: any) => { const n = [...items]; n[idx][key] = val; onChange({ ...data, projects: n }); };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: "#18181b" }}>Projects</h3>
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
            <Field label="Project Title *"><Input placeholder="Awesome App" value={item.title || ""} onChange={(e) => update(i, "title", e.target.value)} /></Field>
            <Field label="Tech Stack"><Input placeholder="React, Node.js" value={item.techStack || ""} onChange={(e) => update(i, "techStack", e.target.value)} /></Field>
            <Field label="GitHub URL"><Input type="url" placeholder="https://github.com/..." value={item.githubUrl || ""} onChange={(e) => update(i, "githubUrl", e.target.value)} /></Field>
            <Field label="Live URL"><Input type="url" placeholder="https://..." value={item.liveUrl || ""} onChange={(e) => update(i, "liveUrl", e.target.value)} /></Field>
          </div>
          <div style={{ marginTop: 14 }}>
            <Field label="Description (Bullet Points)">
              <TextArea placeholder={"- Built a scalable backend...\n- Integrated APIs..."} value={(item.description || []).join("\n")} onChange={(e) => update(i, "description", e.target.value.split("\n"))} />
            </Field>
          </div>
        </div>
      ))}
      {items.length === 0 && (
         <div style={{ textAlign: "center", padding: 32, fontSize: 13, color: "#a1a1aa", background: "#fafafa", border: "1px dashed #e4e4e7", borderRadius: 8 }}>No project entries. Click Add.</div>
      )}
    </div>
  );
}

export default ProjectsSection;
