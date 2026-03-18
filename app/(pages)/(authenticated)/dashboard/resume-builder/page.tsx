"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Save, Plus, Trash2, ChevronRight, ArrowRight, User, Briefcase, FolderGit2, Code2, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TABS = [
  { id: "personal", label: "Personal Info", icon: <User size={15} /> },
  { id: "experience", label: "Experience", icon: <Briefcase size={15} /> },
  { id: "projects", label: "Projects", icon: <FolderGit2 size={15} /> },
  { id: "skills", label: "Skills", icon: <Code2 size={15} /> },
  { id: "education", label: "Education", icon: <GraduationCap size={15} /> },
];

// ── Shared form primitives ────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: "#52525b" }}>{label}</label>
      {children}
    </div>
  );
}

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className="input-field" {...props} />;
}

function Textarea({ ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="textarea-field" style={{ minHeight: 88 }} {...props} />;
}

// ── Sections ──────────────────────────────────────────────────
function PersonalInfoSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <Field label="Full Name *">
          <Input type="text" placeholder="John Doe" />
        </Field>
        <Field label="Email *">
          <Input type="email" placeholder="john@example.com" />
        </Field>
        <Field label="GitHub">
          <Input type="url" placeholder="https://github.com/..." />
        </Field>
        <Field label="LinkedIn">
          <Input type="url" placeholder="https://linkedin.com/in/..." />
        </Field>
        <Field label="Portfolio Website">
          <Input type="url" placeholder="https://yoursite.com" />
        </Field>
        <Field label="Country Code">
          <Input type="text" placeholder="e.g. US, UK, SL" maxLength={4} />
        </Field>
      </div>
    </div>
  );
}

function ExperienceSection() {
  const [items, setItems] = useState([{ id: 1 }]);
  const add = () => setItems([...items, { id: Date.now() }]);
  const remove = (id: number) => setItems(items.filter((x) => x.id !== id));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: "#18181b" }}>Work Experience</h3>
        <button className="btn-secondary" style={{ padding: "6px 12px", fontSize: 12 }} onClick={add}>
          <Plus size={13} /> Add
        </button>
      </div>
      {items.map((item, i) => (
        <div
          key={item.id}
          style={{
            background: "#fafafa",
            border: "1px solid #e4e4e7",
            borderRadius: 12,
            padding: "16px",
            position: "relative",
          }}
        >
          {items.length > 1 && (
            <button
              onClick={() => remove(item.id)}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#a1a1aa",
                display: "flex",
                padding: 4,
              }}
            >
              <Trash2 size={14} />
            </button>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
            <Field label="Company"><Input placeholder="Acme Corp" /></Field>
            <Field label="Job Role"><Input placeholder="Software Engineer" /></Field>
            <Field label="Start Date"><Input type="month" /></Field>
            <Field label="End Date">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Input type="month" />
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#71717a", cursor: "pointer", whiteSpace: "nowrap" }}>
                  <input type="checkbox" style={{ accentColor: "#18181b" }} />
                  Present
                </label>
              </div>
            </Field>
          </div>
          <div style={{ marginTop: 14 }}>
            <Field label="Bullet Points (one per line)">
              <Textarea placeholder={"- Developed key features...\n- Improved performance by 20%..."} />
            </Field>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProjectsSection() {
  const [items, setItems] = useState([{ id: 1 }]);
  const add = () => setItems([...items, { id: Date.now() }]);
  const remove = (id: number) => setItems(items.filter((x) => x.id !== id));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: "#18181b" }}>Projects</h3>
        <button className="btn-secondary" style={{ padding: "6px 12px", fontSize: 12 }} onClick={add}>
          <Plus size={13} /> Add
        </button>
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            background: "#fafafa",
            border: "1px solid #e4e4e7",
            borderRadius: 12,
            padding: "16px",
            position: "relative",
          }}
        >
          {items.length > 1 && (
            <button
              onClick={() => remove(item.id)}
              style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", cursor: "pointer", color: "#a1a1aa", display: "flex", padding: 4 }}
            >
              <Trash2 size={14} />
            </button>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
            <Field label="Project Name *"><Input placeholder="My Awesome Project" /></Field>
            <Field label="Tech Stack"><Input placeholder="React, Node.js, MongoDB" /></Field>
            <Field label="GitHub Link"><Input type="url" placeholder="https://github.com/..." /></Field>
            <Field label="Live Link"><Input type="url" placeholder="https://..." /></Field>
          </div>
          <div style={{ marginTop: 14 }}>
            <Field label="Bullet Points (one per line)">
              <Textarea placeholder={"- Built a scalable backend...\n- Integrated third-party APIs..."} />
            </Field>
          </div>
        </div>
      ))}
    </div>
  );
}

function SkillsSection() {
  const [items, setItems] = useState([{ id: 1 }]);
  const add = () => setItems([...items, { id: Date.now() }]);
  const remove = (id: number) => setItems(items.filter((x) => x.id !== id));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: "#18181b" }}>Skills</h3>
        <button className="btn-secondary" style={{ padding: "6px 12px", fontSize: 12 }} onClick={add}>
          <Plus size={13} /> Add Category
        </button>
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          style={{ background: "#fafafa", border: "1px solid #e4e4e7", borderRadius: 12, padding: "16px", position: "relative" }}
        >
          {items.length > 1 && (
            <button
              onClick={() => remove(item.id)}
              style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", cursor: "pointer", color: "#a1a1aa", display: "flex", padding: 4 }}
            >
              <Trash2 size={14} />
            </button>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Field label="Category Name (optional)"><Input placeholder="e.g. Frontend Development" /></Field>
            <Field label="Skills (comma separated)">
              <Textarea placeholder="React, Next.js, TypeScript, Tailwind CSS..." style={{ minHeight: 64 }} />
            </Field>
          </div>
        </div>
      ))}
    </div>
  );
}

function EducationSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: "#18181b" }}>Education</h3>
      <div style={{ background: "#fafafa", border: "1px solid #e4e4e7", borderRadius: 12, padding: "16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
          <Field label="Degree Name"><Input placeholder="BSc in Computer Science" /></Field>
          <Field label="University Name"><Input placeholder="University of Technology" /></Field>
          <Field label="Location (City, Country)"><Input placeholder="Colombo, SL" /></Field>
          <Field label="Graduation Date">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Input type="month" />
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#71717a", cursor: "pointer", whiteSpace: "nowrap" }}>
                <input type="checkbox" defaultChecked style={{ accentColor: "#18181b" }} />
                Show date
              </label>
            </div>
          </Field>
        </div>
      </div>
    </div>
  );
}

const SECTION_CONTENT: Record<string, React.ReactNode> = {
  personal: <PersonalInfoSection />,
  experience: <ExperienceSection />,
  projects: <ProjectsSection />,
  skills: <SkillsSection />,
  education: <EducationSection />,
};

// ── Page ──────────────────────────────────────────────────────
export default function ResumeBuilderPage() {
  const [activeTab, setActiveTab] = useState("personal");
  const activeIdx = TABS.findIndex((t) => t.id === activeTab);
  const isLast = activeIdx === TABS.length - 1;

  const goNext = () => {
    if (!isLast) setActiveTab(TABS[activeIdx + 1].id);
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.025em", color: "#18181b", marginBottom: 6 }}>
          Step 1 — Build your Profile
        </h1>
        <p style={{ fontSize: 14, color: "#71717a" }}>
          Fill in your information once. It will be used to generate tailored CVs.
        </p>
      </div>

      <div style={{ display: "flex", gap: 24 }}>
        {/* Left section nav */}
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
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 12px",
                    borderRadius: 8,
                    background: isActive ? "#f4f4f5" : "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    width: "100%",
                    transition: "background 0.15s",
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: isDone ? "#18181b" : isActive ? "#18181b" : "#fff",
                      border: isDone || isActive ? "none" : "1.5px solid #d4d4d8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      color: "#fff",
                    }}
                  >
                    {isDone ? (
                      <span style={{ fontSize: 9, fontWeight: 700 }}>✓</span>
                    ) : (
                      <span style={{ fontSize: 9, fontWeight: 700, color: isActive ? "#fff" : "#a1a1aa" }}>
                        {i + 1}
                      </span>
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

        {/* Right content panel */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e4e4e7",
              borderRadius: 14,
              padding: "24px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                {SECTION_CONTENT[activeTab]}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom action row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
            <button className="btn-secondary" style={{ fontSize: 13 }}>
              <Save size={14} /> Save
            </button>
            {isLast ? (
              <Link href="/dashboard/resume-design" className="btn-primary" style={{ fontSize: 13, textDecoration: "none" }}>
                Continue to CV Design <ArrowRight size={14} />
              </Link>
            ) : (
              <button className="btn-primary" style={{ fontSize: 13 }} onClick={goNext}>
                Next: {TABS[activeIdx + 1]?.label} <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
