import React from 'react'
import Nav from './Nav'
import PreviewArea from './PreviewArea'

function PDFView({config, handleDownload, pdfUrl, setConfig}: {config: any, handleDownload: () => void, pdfUrl: string | null, setConfig: (config: any) => void}) {
  return (
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
      </div>  )
}

export default PDFView