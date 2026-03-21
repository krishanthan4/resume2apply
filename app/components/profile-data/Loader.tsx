import { Loader2 } from "lucide-react";

function Loader() {
    return (
     <div style={{ display: "flex", justifyContent: "center", paddingTop: 100 }}>
             <Loader2 className="animate-spin text-zinc-400" size={32} />
           </div>
    )
}

export default Loader;