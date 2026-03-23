import React from 'react'
import Nav from './Nav'
import PreviewArea from './PreviewArea'

function PDFView({config, handleDownload, pdfUrl, setConfig}: {config: any, handleDownload: () => void, pdfUrl: string | null, setConfig: (config: any) => void}) {
  return (
    <div className="h-full flex-1 bg-white border border-zinc-200 rounded-[14px] shadow-sm flex flex-col overflow-hidden">
      <Nav config={config} handleDownload={handleDownload} pdfUrl={pdfUrl} setConfig={setConfig} />
      <div className="flex-1 overflow-y-auto bg-zinc-100 flex flex-col">
        <PreviewArea pdfUrl={pdfUrl} />
      </div>
    </div>
  )
}


export default PDFView