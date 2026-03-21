import { Download } from 'lucide-react'
import React from 'react'
import { Button } from "@/app/components/ui";


function Nav({config, setConfig, pdfUrl, handleDownload}: {config: any, setConfig: React.Dispatch<React.SetStateAction<any>>, pdfUrl: string | null, handleDownload: () => void}) {

  const setDetailedCV = () => {
    setConfig({
      ...config, type: "detailed", subTitlesSpaceBottom: 2, headerNameMarginBottom: 3, sectionTitleBoxMarginTop: 8, sectionTitleBoxMarginBottom: 5, sectionTitleBoxPaddingTop: 8, pagePaddingTop: 0.3, pagePaddingBottom: 0.3, pagePaddingLeft: 0.4, pagePaddingRight: 0.4, maxProjects: 4, maxExperienceBullets: 7, maxProjectBullets: 4, noHyperlinks: false
    })
  }

  const setSingleCV = () => {
    setConfig({
      ...config, type: "single", subTitlesSpaceBottom: 1, headerNameMarginBottom: 0, sectionTitleBoxMarginTop: 5, sectionTitleBoxMarginBottom: 4, sectionTitleBoxPaddingTop: 5, pagePaddingTop: 0.2, pagePaddingBottom: 0.1, pagePaddingLeft: 0.3, pagePaddingRight: 0.3, maxProjects: 2, maxExperienceBullets: 3, maxProjectBullets: 3, noHyperlinks: false
    })
  }

  const setDownloadableSingleCV = () => {
    setConfig({
      ...config, type: "downloadable_single", subTitlesSpaceBottom: 1, headerNameMarginBottom: 0, sectionTitleBoxMarginTop: 5, sectionTitleBoxMarginBottom: 4, sectionTitleBoxPaddingTop: 5, pagePaddingTop: 0.2, pagePaddingBottom: 0.1, pagePaddingLeft: 0.3, pagePaddingRight: 0.3, maxProjects: 2, maxExperienceBullets: 3, maxProjectBullets: 3, noHyperlinks: true
    })
  }

  const setDownloadableDetailedCV = () => {
    setConfig({
      ...config, type: "downloadable_detailed", subTitlesSpaceBottom: 2, headerNameMarginBottom: 3, sectionTitleBoxMarginTop: 8, sectionTitleBoxMarginBottom: 5, sectionTitleBoxPaddingTop: 8, pagePaddingTop: 0.3, pagePaddingBottom: 0.3, pagePaddingLeft: 0.4, pagePaddingRight: 0.4, maxProjects: 4, maxExperienceBullets: 7, maxProjectBullets: 4, noHyperlinks: true
    })
  }

  const btnStyle = (active: boolean) => ({
    padding: "6px 12px",
    background: active ? "#ffffff" : "transparent",
    border: active ? "1px solid #d4d4d8" : "1px solid transparent",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: active ? 600 : 500,
    color: active ? "#18181b" : "#71717a",
    cursor: "pointer",
    boxShadow: active ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
    transition: "all 0.15s"
  });

  return (
    <div style={{ height: 56, borderBottom: "1px solid #e4e4e7", background: "#fafafa", display: "flex", alignItems: "center", padding: "0 24px", flexShrink: 0, gap: 16, overflowX: "auto", whiteSpace: "nowrap" }}>
      <div style={{ display: "flex", gap: 4, background: "#e4e4e7", padding: 4, borderRadius: 8 }}>
        <Button onClick={setSingleCV} style={btnStyle(config.type === "single")}>Single CV</Button>
        <Button onClick={setDetailedCV} style={btnStyle(config.type === "detailed")}>Detailed CV</Button>
        <Button onClick={setDownloadableSingleCV} style={btnStyle(config.type === "downloadable_single")}>Single Printing</Button>
        <Button onClick={setDownloadableDetailedCV} style={btnStyle(config.type === "downloadable_detailed")}>Detailed Printing</Button>
      </div>
    </div>
  )
}

export default Nav;