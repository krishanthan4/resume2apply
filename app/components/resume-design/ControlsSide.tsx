import { Download, FileText, Loader2, Settings, X } from "lucide-react";
import ReorderContent from "./ReorderContent";
import ResumeBuilderTabs from "./ResumeBuilderTabs";
import StylesTabContent from "./StylesTabContent";
import TemplatesTabContent from "./TemplatesTabContent";
import { Button } from "@/app/components/ui";

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
  isSidebarOpen,
  setIsSidebarOpen,
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
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}){
  return (
    <>
    <aside
      className={`fixed md:relative z-40 md:z-auto inset-y-0 left-0 bg-white border-r border-[#e4e4e7] rounded-none md:rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      style={{
        width: config.sidebarWidth,
        flexShrink: 0,
      }}
    >
      <div style={{ padding: "20px 24px", borderBottom: "1px solid #e4e4e7", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: "#18181b", letterSpacing: "-0.025em" }}>Step 2 — CV Design</h1>
          <p style={{ fontSize: 13, color: "#71717a", marginTop: 2 }}>Tweak and generate your PDF.</p>
        </div>
        <button className="md:hidden p-2 rounded-md bg-gray-100" onClick={() => setIsSidebarOpen(false)}>
          <X size={20} />
        </button>
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

      <div className="hidden md:flex" style={{ padding: "16px 20px", background: "#fff", borderTop: "1px solid #e4e4e7", gap: 8 }}>
        <Button
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
        </Button>
        
        <Button
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
        </Button>

        <Button
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
        </Button>
      </div>
    </aside>

    {/* Mobile Action Bar at bottom */}
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[#e4e4e7] flex md:hidden z-50 flex-col gap-2 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex gap-2">
        <Button
          disabled={!resumeData || isGenerating}
          onClick={generatePreview}
          variant="outline"
          className="w-full"
        >
          {isGenerating && <Loader2 size={16} className="animate-spin" />}
          Generate
        </Button>
        <Button
          onClick={handleDownload}
          disabled={!pdfUrl || isGenerating}
         variant="secondary"
          className="w-full"

        >
          <Download size={16} /> PDF
        </Button>
        <Button
          onClick={handleApplyToJobClick}
        
        >
          <FileText size={16} /> Apply
        </Button>
        <Button
          onClick={() => setIsSidebarOpen(true)}
   
        >
          <Settings size={18} />
        </Button>
      </div>
    </div>

    {/* Mobile overlay */}
    {isSidebarOpen && (
      <div 
        className="fixed inset-0 bg-black/20 z-30 md:hidden"
        onClick={() => setIsSidebarOpen(false)}
      />
    )}

    </>
  );
}
export default ControlSide;