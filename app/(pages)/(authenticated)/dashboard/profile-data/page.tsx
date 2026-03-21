"use client";

import React, { useState, useEffect } from "react";
import PersonalInfoSection from "@/app/components/profile-data/PersonalSection";
import ExperienceSection from "@/app/components/profile-data/ExperienceSection";
import ProjectsSection from "@/app/components/profile-data/ProjectsSection";
import SkillsSection from "@/app/components/profile-data/SkillsSection";
import EducationSection from "@/app/components/profile-data/EducationSection";
import { TABS } from "@/app/components/profile-data/Tabs";
import RightContentPanel from "@/app/components/profile-data/RightContentPanel";
import LeftNavPanel from "@/app/components/profile-data/LeftNavPanel";
import TitleHeader from "@/app/components/profile-data/TitleHeader";
import Loader from "@/app/components/profile-data/Loader";

export default function ProfileDataPage() {
  const [activeTab, setActiveTab] = useState("personal");
  const [resumeData, setResumeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const activeIdx = TABS.findIndex((t) => t.id === activeTab);
  const isLast = activeIdx === TABS.length - 1;

  useEffect(() => {
    fetch("/api/resumeContent")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setResumeData(json.resumeData);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/resumeContent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resumeData),
      });

      const json = await response.json();
      if (json.success && json.result) {
        setResumeData(json.result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setSaving(false), 500);
    }
  };

  const goNext = () => {
    handleSave();
    if (!isLast) setActiveTab(TABS[activeIdx + 1].id);
  };

  if (loading) {
    return (
      <Loader />
    );
  }

  const SECTION_CONTENT: Record<string, React.ReactNode> = {
    personal: <PersonalInfoSection data={resumeData} onChange={setResumeData} />,
    experience: <ExperienceSection data={resumeData} onChange={setResumeData} />,
    projects: <ProjectsSection data={resumeData} onChange={setResumeData} />,
    skills: <SkillsSection data={resumeData} onChange={setResumeData} />,
    education: <EducationSection data={resumeData} onChange={setResumeData} />,
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
    <TitleHeader handleSave={handleSave} saving={saving} />

      <div style={{ display: "flex", gap: 24 }}>
       <LeftNavPanel activeTab={activeTab} setActiveTab={setActiveTab} TABS={TABS} activeIdx={activeIdx} />

       <RightContentPanel activeTab={activeTab} isLast={isLast} handleSave={handleSave} goNext={goNext} TABS={TABS} SECTION_CONTENT={SECTION_CONTENT} activeIdx={activeIdx} />
      </div>
    </div>
  );
}
