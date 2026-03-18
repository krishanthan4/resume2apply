"use client";

import React, { useState, useEffect } from "react";
import {
  Loader2,
  Download,
  Settings,
  FileText,
  X,
} from "lucide-react";
import ReorderContent from "@/app/components/resume-builder/ReorderContent";
import ResumeBuilderTabs from "@/app/components/resume-builder/ResumeBuilderTabs";
import PreviewArea from "@/app/components/resume-builder/PreviewArea";
import Nav from "@/app/components/resume-builder/Nav";
import StylesTabContent from "@/app/components/resume-builder/StylesTabContent";
import TemplatesTabContent from "@/app/components/resume-builder/TemplatesTabContent";
import { useRouter } from "next/navigation";

export default function CustomResumeBuilderPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [execTemplates, setExecTemplates] = useState<any[]>([]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [config, setConfig] = useState({
    fontSizeBase: 11.5,
    fontSizeTitle: 12,
    lineHeightBase: 1.3,
    textBulletSpace: 1,
    subTitlesSpaceBottom: 2,
    headerNameMarginBottom: 3,
    sectionTitleBoxMarginTop: 8,
    sectionTitleBoxMarginBottom: 5,
    sectionTitleBoxPaddingTop: 8,
    experienceBulletSpace: 1,
    experienceTitlesSpaceBottom: 2,
    pagePaddingTop: 0.3,
    pagePaddingBottom: 0.3,
    pagePaddingLeft: 0.4,
    pagePaddingRight: 0.4,
    dividerPosition: "top",
    borderColor: "#707070",
    enableIcons: true,
    underlineLinks: true,
    sectionTitlesUppercase: true,
    titleColor: "#000000",
    maxProjects: 4,
    maxExperienceBullets: 7,
    maxProjectBullets: 4,
    showGraduationDate: true,
    noHyperlinks: false,
    showLocation: true,
    showPhoneNumber: true,
    showWebsite: true,
    showGithub: true,
    showLinkedin: true,
    showExecutiveSummary: true,
    sidebarWidth: 384,
    type: "detailed",
    execTemplateId: "",
    selectedExecutiveSummaryText: "",
    sectionsOrder: ["executiveSummary", "experience", "projects", "skills", "education"],
  });

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/api/resumeContent');
        const data = await response.json();
        if (data.success) {
          setResumeData(data.resumeData);
          setExecTemplates(data.execTemplates || []);
          if (data.resumeData?.education?.enableDate !== undefined) {
            setConfig((prev) => ({
              ...prev,
              showGraduationDate: data.resumeData.education.enableDate,
            }));
          }
        }
      } catch (error) {
        console.error("Failed to load builder data:", error);
      }
    }
    loadData();
  }, []);

  const refreshTemplates = async () => {
    try {
      const response = await fetch('/api/resumeContent');
      const data = await response.json();
      if (data.success) {
        setExecTemplates(data.execTemplates || []);
      }
    } catch (error) {
      console.error("Failed to refresh templates:", error);
    }
  };

  const generatePreview = async () => {
    if (!resumeData) return;
    setIsGenerating(true);
    try {
      let currentExecTemplateText = undefined;
      if (config.execTemplateId) {
        const t = execTemplates.find(x => x._id === config.execTemplateId);
        if (t) {
          currentExecTemplateText = config.type.includes("single") ? t.shortSummery : t.detailedSummery;
        }
      }

      const response = await fetch("/api/resume/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...resumeData,
          ...config,
          selectedExecutiveSummaryText: currentExecTemplateText || config.selectedExecutiveSummaryText
        }),
      });
      if (!response.ok) throw new Error("Generation failed");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = `custom_resume_${config.type}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  const handleApplyToJob = () => {
    const currentExecTemplateText = config.execTemplateId 
      ? execTemplates.find(t => t._id === config.execTemplateId)?.content 
      : "";
      
    const payload = {
      ...resumeData,
      ...config,
      selectedExecutiveSummaryText: currentExecTemplateText || config.selectedExecutiveSummaryText
    };

    localStorage.setItem("pendingResumeConfig", JSON.stringify(payload));
    router.push("/dashboard/job-apply?newApplication=true");
  };

  return (
    <div style={{ display: "flex", gap: 24, height: "calc(100vh - 120px)", marginTop: -12 }}>
      {/* Left sidebar: Controls */}
      <aside
        style={{
          width: config.sidebarWidth,
          flexShrink: 0,
          background: "#fff",
          border: "1px solid #e4e4e7",
          borderRadius: 14,
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #e4e4e7", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 800, color: "#18181b", letterSpacing: "-0.025em" }}>Step 2 — CV Design</h1>
            <p style={{ fontSize: 13, color: "#71717a", marginTop: 2 }}>Tweak and generate your PDF.</p>
          </div>
        </div>

        <div style={{ padding: "0 16px" }}>
          <ResumeBuilderTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: 24, background: "#fafafa" }} className="scrollbar-hide">
          {activeTab === "styles" ? (
            <StylesTabContent config={config} setConfig={setConfig} />
          ) : activeTab === "content" ? (
            <ReorderContent
              resumeData={resumeData}
              setResumeData={setResumeData}
              config={config}
              setConfig={setConfig}
            />
          ) : (
            <TemplatesTabContent 
              config={config} 
              setConfig={setConfig}
              execTemplates={execTemplates}
              refreshTemplates={refreshTemplates}
            />
          )}
        </div>

        <div style={{ padding: "16px 20px", background: "#fff", borderTop: "1px solid #e4e4e7", display: "flex", gap: 8 }}>
          <button
            disabled={!resumeData || isGenerating}
            onClick={generatePreview}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              background: "#f4f4f5",
              color: "#18181b",
              border: "1px solid #e4e4e7",
              borderRadius: 8,
              padding: "10px 0",
              fontSize: 13,
              fontWeight: 600,
              cursor: (!resumeData || isGenerating) ? "not-allowed" : "pointer",
            }}
          >
            {isGenerating && <Loader2 size={14} className="animate-spin" />}
            Generate
          </button>
          
          <button
            onClick={handleDownload}
            disabled={!pdfUrl || isGenerating}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              background: "#f4f4f5",
              color: "#18181b",
              border: "1px solid #e4e4e7",
              borderRadius: 8,
              padding: "10px 0",
              fontSize: 13,
              fontWeight: 600,
              cursor: (!pdfUrl || isGenerating) ? "not-allowed" : "pointer",
            }}
          >
            <Download size={14} /> PDF
          </button>

          <button
            onClick={handleApplyToJob}
            style={{
              flex: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              background: "#18181b",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 0",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <FileText size={14} /> Use for Job
          </button>
        </div>
      </aside>

      {/* Right side: PDF Preview */}
      <div
        style={{
          flex: 1,
          background: "#fff",
          border: "1px solid #e4e4e7",
          borderRadius: 14,
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Nav config={config} handleDownload={handleDownload} pdfUrl={pdfUrl} setConfig={setConfig} />
        <div style={{ flex: 1, overflowY: "auto", background: "#f4f4f5", display: "flex", flexDirection: "column" }}>
          <PreviewArea pdfUrl={pdfUrl} />
        </div>
      </div>
    </div>
  );
}
