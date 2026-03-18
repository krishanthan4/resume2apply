import { Download, FileText, Loader2 } from "lucide-react";
import ReorderContent from "./ReorderContent";
import ResumeBuilderTabs from "./ResumeBuilderTabs";
import StylesTabContent from "./StylesTabContent";
import TemplatesTabContent from "./TemplatesTabContent";

function ControlSide({
  config,
  setConfig,
  resumeData,
  setResumeData,
  execTemplates,
  refreshTemplates,
  activeTab,
  setActiveTab,
  generatePreview,
  handleDownload,
  pdfUrl,
  isGenerating,
  handleApplyToJobClick,
}: {
  config: any;
  setConfig: React.Dispatch<React.SetStateAction<any>>;
  resumeData: any;
  setResumeData: React.Dispatch<React.SetStateAction<any>>;
  execTemplates: any;
  refreshTemplates: any;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  generatePreview: () => void;
  handleDownload: () => void;
  pdfUrl: string | null;
  isGenerating: boolean;
  handleApplyToJobClick: () => void;
}){
  return (
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
          onClick={handleApplyToJobClick}
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
  );
}
export default ControlSide;