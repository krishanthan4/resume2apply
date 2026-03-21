import Field from "./Field";
import { Input } from "@/app/components/ui/Input";

function PersonalInfoSection({ data, onChange }: { data: any, onChange: (d: any) => void }) {
  const update = (key: string, val: string) => onChange({ ...data, personalDetails: { ...(data.personalDetails || {}), [key]: val } });
  const updatePhone = (val: string) => onChange({ 
    ...data, 
    personalDetails: { 
      ...(data.personalDetails || {}), 
      phone: { ...(data.personalDetails?.phone || {}), number: val } 
    } 
  });
  const t = data.personalDetails || {};

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <Field label="Full Name *">
            <Input type="text" placeholder="John Doe" value={t.name || ""} onChange={(e) => update("name", e.target.value)} />
        </Field>
        <Field label="Email *">
            <Input type="email" placeholder="john@example.com" value={t.email || ""} onChange={(e) => update("email", e.target.value)} />
        </Field>
        <Field label="Phone">
            <Input type="text" placeholder="+1 234 567 890" value={t.phone?.number || ""} onChange={(e) => updatePhone(e.target.value)} />
        </Field>
        <Field label="Location">
            <Input type="text" placeholder="City, Country" value={t.location || ""} onChange={(e) => update("location", e.target.value)} />
        </Field>
        <Field label="GitHub">
            <Input type="url" placeholder="https://github.com/..." value={t.github || ""} onChange={(e) => update("github", e.target.value)} />
        </Field>
        <Field label="LinkedIn">
            <Input type="url" placeholder="https://linkedin.com/in/..." value={t.linkedin || ""} onChange={(e) => update("linkedin", e.target.value)} />
        </Field>
        <Field label="Personal Website">
            <Input type="url" placeholder="https://yoursite.com" value={t.personalWebsite || ""} onChange={(e) => update("personalWebsite", e.target.value)} />
        </Field>
      </div>
    </div>
  );
}

export default PersonalInfoSection;