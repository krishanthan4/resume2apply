"use client";

import { CheckCircle2, Settings, ChevronUp, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react'

function DashboardTopNavbar({ pathname,STEPS,activeIdx }: { pathname: string, STEPS: { num: number; label: string; sublabel: string; path: string; icon: React.ReactNode }[], activeIdx: number }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
     <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-[14px] border-b border-zinc-200">
        {/* Brand row */}
        <div className="max-w-[1200px] mx-auto px-6 h-[52px] flex items-center justify-between">
          <Link
            href="/dashboard/resume-design"
            className="flex items-center gap-2 no-underline text-zinc-900"
          >
            <span className="font-bold text-sm tracking-[-0.02em]">
              Resume2Apply
            </span>
          </Link>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? "Hide Steps" : "Show Steps"}
              className="w-[34px] h-[34px] flex items-center justify-center rounded-lg no-underline transition-all duration-150 text-zinc-500 bg-transparent hover:bg-zinc-100 hover:text-zinc-900 border-none cursor-pointer"
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            <Link
              href="/dashboard/settings"
              title="Settings"
              className={`w-[34px] h-[34px] flex items-center justify-center rounded-lg no-underline transition-all duration-150 ${pathname.startsWith("/dashboard/settings") ? "text-zinc-900 bg-zinc-100" : "text-zinc-500 bg-transparent"}`}
            >
              <Settings size={16} />
            </Link>
          </div>
        </div>

        {/* Step progress bar */}
        <div className={`bg-white transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? "max-h-[100px] border-t border-zinc-100 opacity-100" : "max-h-0 border-t-0 opacity-0"}`}>
          <div
            className="md:max-w-[1200px] mx-auto md:px-6 px-1 flex items-stretch overflow-x-auto scrollbar-hide"
          >
            {STEPS.map((step, i) => {
              const isActive = i === activeIdx;
              const isDone = i < activeIdx;

              return (
                <React.Fragment key={step.num}>
                  <Link
                    href={step.path}
                    className={`flex items-center md:justify-start justify-center md:gap-2.5 gap-2 py-2.5 md:px-4 px-2 border-b-2 no-underline whitespace-nowrap transition-colors duration-200 relative ${isActive ? "border-zinc-900" : "border-transparent"}`}
                  >
                    {/* Circle number */}
                    <div
                      className={`w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 transition-colors duration-200 ${isDone || isActive ? "bg-zinc-900 border-none" : "bg-white border-[1.5px] border-zinc-300"}`}
                    >
                      {isDone ? (
                        <CheckCircle2 size={16} color="#fff" strokeWidth={2.5} />
                      ) : (
                        <span className={`text-[13px] font-bold ${isActive ? "text-white" : "text-zinc-400"}`}>
                          {step.num}
                        </span>
                      )}
                    </div>

                    {/* Label */}
                    <div>
                      <div className={`md:text-[14px] text-xs font-semibold leading-[1.2] transition-colors duration-200 ${isActive || isDone ? "text-zinc-900" : "text-zinc-400"}`}>
                        {step.label}
                      </div>
                      <div className="md:text-[11px] sm:text-[10px] text-[0px] text-zinc-400 leading-[1.2]">
                        {step.sublabel}
                      </div>
                    </div>
                  </Link>

                  {/* Connector line between steps */}
                  {i < STEPS.length - 1 && (
                    <div className={`self-center md:w-5 w-1 h-[1px] shrink-0 transition-colors duration-300 ${i < activeIdx ? "bg-zinc-900" : "bg-zinc-200"}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </header>  )
}

export default DashboardTopNavbar