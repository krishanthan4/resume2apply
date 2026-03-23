import { Button } from "@/app/components/ui";
function LeftNavPanel({activeTab, setActiveTab, TABS, activeIdx}:{
    activeTab: string;
    setActiveTab: (tab: string) => void;
    TABS: any[];
    activeIdx: number;
}) {
    return (
       <aside className="md:w-[180px] w-full border rounded-2xl border-zinc-300 md:border-0 shadow md:shadow-none shrink-0">
          <nav className="flex flex-col gap-0.5">
            {TABS.map((tab, i) => {
              const isActive = tab.id === activeTab;
              const isDone = i < activeIdx;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-[9px] rounded-lg text-left transition-colors duration-150 cursor-pointer ${
                    isActive ? "bg-zinc-100" : "bg-transparent hover:bg-zinc-50"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-[1.5px] ${
                      isDone || isActive
                        ? "bg-zinc-900 border-transparent text-white"
                        : "bg-white border-zinc-300 text-white"
                    }`}
                  >
                    {isDone ? (
                      <span className="text-[9px] font-bold">✓</span>
                    ) : (
                      <span className={`text-[9px] font-bold ${isActive ? "text-white" : "text-zinc-400"}`}>
                        {i + 1}
                      </span>
                    )}
                  </div>
                  <span className={`text-[13px] ${isActive ? "font-semibold text-zinc-900" : "font-normal text-zinc-500"}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>
    )
}

export default LeftNavPanel