import { FileText } from 'lucide-react'

function PreviewArea({pdfUrl}: {pdfUrl: string | null}) {
  return (
    <div className="flex-1 bg-[#fafafa] flex items-center justify-center relative">
      {pdfUrl ? (
        <iframe 
          src={`${pdfUrl}#toolbar=0`} 
          className="min-h-[90vh] w-full h-full border-none bg-zinc-100" 
        />
      ) : (
        <div className="text-center text-zinc-400 flex flex-col items-center gap-3">
          <FileText size={48} className="opacity-50" />
          <p className="text-sm">Click Generate Preview to see the PDF</p>
        </div>
      )}
    </div>  
  )
}


export default PreviewArea;