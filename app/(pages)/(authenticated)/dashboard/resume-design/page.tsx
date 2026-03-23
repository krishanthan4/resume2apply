"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useJobBoardStore } from "@/app/store/useJobBoardStore";
import ControlSide from "@/app/components/resume-design/ControlsSide";
import PDFView from "@/app/components/resume-design/PDFView";
import ExecutiveSummaryModel from "@/app/components/resume-design/ExecutiveSummaryModel";

export default function CustomResumeBuilderPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [execTemplates, setExecTemplates] = useState<any[]>([]);
  const [showExecSummaryModal, setShowExecSummaryModal] = useState(false);
  const [tempExecSummary, setTempExecSummary] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
          currentExecTemplateText = config.type.includes("single") ? (t.shortSummary || t.content) : (t.detailedSummary || t.content);
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
        currentExecTemplateText = config.type.includes("single") ? (t.shortSummary || t.content) : (t.detailedSummary || t.content);
      }
    }
    setTempExecSummary(currentExecTemplateText || config.selectedExecutiveSummaryText || resumeData?.generalExecutiveSummary?.detailedSummary || resumeData?.generalExecutiveSummary?.content || "");
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
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-120px)] -mt-3 relative md:pb-0 pb-20 md:pt-0">
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
    isSidebarOpen={isSidebarOpen}
    setIsSidebarOpen={setIsSidebarOpen}
    />

      {/* Right side: PDF Preview */}
      <div className="flex-1 overflow-hidden">
        <PDFView
          config={config}
          handleDownload={handleDownload}
          pdfUrl={pdfUrl}
          setConfig={setConfig}
        />
      </div>

      {showExecSummaryModal && (
       <ExecutiveSummaryModel
         setShowExecSummaryModal={setShowExecSummaryModal}
         tempExecSummary={tempExecSummary}
         setTempExecSummary={setTempExecSummary}
         confirmApplyToJob={confirmApplyToJob}
       />
      )}
    </div>
  );
}
