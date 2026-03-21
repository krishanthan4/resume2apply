import { Loader2, Save } from "lucide-react";
import { Button } from "@/app/components/ui";


function TitleHeader({ handleSave, saving}: {handleSave: () => void, saving: boolean}) {
    return (
    <div style={{ marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.025em", color: "#18181b", marginBottom: 6 }}>
            Step 1 — Build your Profile
          </h1>
          <p style={{ fontSize: 14, color: "#71717a" }}>
            Fill in your information once. It will be used to generate tailored CVs.
          </p>
        </div>
        <Button onClick={handleSave} className="btn-secondary" style={{ fontSize: 13, opacity: saving ? 0.7 : 1 }}>
          {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />} {saving ? "Saving" : "Save Cloud"}
        </Button>
      </div>
    )
}

export default TitleHeader;