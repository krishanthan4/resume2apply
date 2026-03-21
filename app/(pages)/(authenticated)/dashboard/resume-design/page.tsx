"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useJobBoardStore } from "@/app/store/useJobBoardStore";
import ControlSide from "@/app/components/resume-design/ControlsSide";
import PDFView from "@/app/components/resume-design/PDFView";
import { Button, TextArea } from "@/app/components/ui";

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
    <div className="flex gap-6 h-[calc(100vh-120px)] -mt-3">
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
        <div className="fixed inset-0 bg-zinc-900/40 flex items-center justify-center z-[100] p-5">
          <div className="bg-white rounded-xl p-6 w-full max-w-[500px] shadow-lg flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-zinc-900">Verify Executive Summary</h3>
              <button onClick={() => setShowExecSummaryModal(false)} className="bg-transparent border-none cursor-pointer text-zinc-400 hover:text-zinc-600 transition-colors"><X size={18} /></button>
            </div>
            <p className="text-[13px] text-zinc-500">
              Before we send this application to the Kanban board, do you need to make any final adjustments to your executive summary?
            </p>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-600">Executive Summary content</label>
              <TextArea
                value={tempExecSummary}
                onChange={(e) => setTempExecSummary(e.target.value)}
                className="textarea-field min-h-[140px]"
                placeholder="Adjust summary..."
              />
            </div>
            <div className="flex justify-end gap-2.5 mt-3">
              <Button variant="outline" onClick={() => setShowExecSummaryModal(false)}>Cancel</Button>
              <Button   onClick={confirmApplyToJob}>Confirm & Apply</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
