import { Loader2, Save } from "lucide-react";
import { Button } from "@/app/components/ui";


function TitleHeader({ handleSave, saving}: {handleSave: () => void, saving: boolean}) {
    return (
    <div className="mb-7 flex flex-col sm:flex-row sm:justify-between items-start sm:items-end w-full gap-4 sm:gap-0">
        <div className="w-full sm:w-auto">
          <h1 className="text-2xl sm:text-[26px] font-extrabold tracking-[-0.025em] text-[#18181b] mb-1.5 leading-tight">
            Step 1 — Build your Profile
          </h1>
          <p className="text-sm text-[#71717a]">
            Fill in your information once. It will be used to generate tailored CVs.
          </p>
        </div>
        <Button 
          onClick={handleSave} 
          className={`w-full sm:w-auto text-[13px] ${saving ? "opacity-70" : "opacity-100"}`}
        >
          {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />} {saving ? "Saving" : "Save Cloud"}
        </Button>
      </div>
    )
}

export default TitleHeader;