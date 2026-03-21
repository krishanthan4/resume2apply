import { Button, TextArea } from '../ui'
import { X } from 'lucide-react'

function ExecutiveSummaryModel({setShowExecSummaryModal, tempExecSummary, setTempExecSummary, confirmApplyToJob}: any) {
  return (
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
        </div>  )
}

export default ExecutiveSummaryModel