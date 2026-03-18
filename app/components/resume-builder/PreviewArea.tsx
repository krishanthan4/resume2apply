import { FileText } from 'lucide-react'

function PreviewArea({pdfUrl}: {pdfUrl: string | null}) {
  return (
    <div style={{ flex: 1, background: "#fafafa", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
      {pdfUrl ? (
        <iframe src={`${pdfUrl}#toolbar=0`} style={{ minHeight: "90vh", width: "100%", height: "100%", border: "none", background: "#f4f4f5" }} />
      ) : (
        <div style={{ textAlign: "center", color: "#a1a1aa", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <FileText size={48} opacity={0.5} />
          <p style={{ fontSize: 14 }}>Click Generate Preview to see the PDF</p>
        </div>
      )}
    </div>  
  )
}

export default PreviewArea;