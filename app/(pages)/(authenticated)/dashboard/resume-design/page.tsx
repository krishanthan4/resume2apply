"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useJobBoardStore } from "@/app/store/useJobBoardStore";
import ControlSide from "@/app/components/resume-design/ControlsSide";
import PDFView from "@/app/components/resume-design/PDFView";

export default function CustomResumeBuilderPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [execTemplates, setExecTemplates] = useState<any[]>([]);
  const [showExecSummaryModal, setShowExecSummaryModal] = useState(false);
  const [tempExecSummary, setTempExecSummary] = useState("");

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
          if (data.resumeData?.generalExecutiveSummary?._id) {
            setConfig((prev) => ({
              ...prev,
              execTemplateId: prev.execTemplateId || data.resumeData.generalExecutiveSummary._id,
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
          currentExecTemplateText = config.type.includes("single") ? (t.shortSummery || t.content) : (t.detailedSummery || t.content);
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

      const payload = {
        ...resumeData,
        ...config,
        selectedExecutiveSummaryText: currentExecTemplateText || config.selectedExecutiveSummaryText
      };
      // User requested explicitly that Generate CV should log the payload to Zustand state.
      useJobBoardStore.getState().setPendingResumeConfig(payload);
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

  const handleApplyToJobClick = () => {
    let currentExecTemplateText = "";
    if (config.execTemplateId) {
      const t = execTemplates.find(x => x._id === config.execTemplateId);
      if (t) {
        currentExecTemplateText = config.type.includes("single") ? (t.shortSummery || t.content) : (t.detailedSummery || t.content);
      }
    }
    setTempExecSummary(currentExecTemplateText || config.selectedExecutiveSummaryText || resumeData?.generalExecutiveSummary?.detailedSummery || resumeData?.generalExecutiveSummary?.content || "");
    setShowExecSummaryModal(true);
  };

  const confirmApplyToJob = () => {
    const payload = {
      ...resumeData,
      ...config,
      selectedExecutiveSummaryText: tempExecSummary
    };
    

    useJobBoardStore.getState().setPendingResumeConfig(payload);
    router.push("/dashboard/job-apply?newApplication=true");
  };

  return (
    <div style={{ display: "flex", gap: 24, height: "calc(100vh - 120px)", marginTop: -12 }}>
      {/* Left sidebar: Controls */}
    <ControlSide
    config={config}
    setConfig={setConfig}
    resumeData={resumeData}
    setResumeData={setResumeData}
    execTemplates={execTemplates}
    refreshTemplates={refreshTemplates}
    activeTab={activeTab}
    setActiveTab={setActiveTab}
    generatePreview={generatePreview}
    handleDownload={handleDownload}
    pdfUrl={pdfUrl}
    isGenerating={isGenerating}
    handleApplyToJobClick={handleApplyToJobClick}
    />

      {/* Right side: PDF Preview */}
      <PDFView
        config={config}
        handleDownload={handleDownload}
        pdfUrl={pdfUrl}
        setConfig={setConfig}
      />

      {showExecSummaryModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(24, 24, 27, 0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 24, width: "100%", maxWidth: 500, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#18181b" }}>Verify Executive Summary</h3>
              <button onClick={() => setShowExecSummaryModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#a1a1aa" }}><X size={18} /></button>
            </div>
            <p style={{ fontSize: 13, color: "#71717a" }}>
              Before we send this application to the Kanban board, do you need to make any final adjustments to your executive summary?
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: "#52525b" }}>Executive Summary content</label>
              <textarea
                value={tempExecSummary}
                onChange={(e) => setTempExecSummary(e.target.value)}
                className="textarea-field"
                style={{ minHeight: 140 }}
                placeholder="Adjust summary..."
              />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 12 }}>
              <button className="btn-secondary" onClick={() => setShowExecSummaryModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={confirmApplyToJob}>Confirm & Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
