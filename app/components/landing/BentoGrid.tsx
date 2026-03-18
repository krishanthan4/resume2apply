"use client";

import React from "react";
import { FileText, LayoutDashboard, Mail } from "lucide-react";
import { FadeUp } from "./FadeUp";

export function BentoGrid() {
  return (
    <section className="py-24 relative z-10 bg-slate-50/50 border-t border-b border-slate-100 overflow-hidden">
      {/* --- Ambient Background --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[30%] w-[50%] h-[50%] rounded-full bg-blue-50/60 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[10%] w-[60%] h-[60%] rounded-full bg-sky-50/50 blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 text-center mb-16 relative z-10">
        <FadeUp>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Everything you need, <span className="text-slate-400">nothing you don't.</span>
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            By vertically integrating the entire application process, we created a powerhouse workstation that entirely eclipses legacy tools.
          </p>
        </FadeUp>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-6 relative z-10">
        
        {/* 1. Word Replacement */}
        <FadeUp delay={0.1}>
          <div className="group relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 mb-6">
              <FileText className="text-blue-500" size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Replaces Word</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              Stop battling MS Word formatting margins. Generate live, ultra-premium PDF resumes and dynamically inject custom Executive Summaries for each specific role instantly.
            </p>
            <div className="mt-8 relative h-32 rounded-xl border border-slate-100 bg-slate-50 overflow-hidden px-4 pt-4 shadow-inner">
               <div className="flex gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200" />
                  <div className="flex flex-col gap-1.5 flex-1">
                     <div className="w-1/3 h-2 rounded bg-slate-300" />
                     <div className="w-1/4 h-2 rounded bg-slate-200" />
                  </div>
               </div>
               <div className="space-y-1.5 mt-4">
                  <div className="w-full h-1.5 rounded bg-slate-200" />
                  <div className="w-5/6 h-1.5 rounded bg-slate-200" />
                  <div className="w-4/6 h-1.5 rounded bg-slate-200" />
               </div>
            </div>
          </div>
        </FadeUp>

        {/* 2. Notion Replacement */}
        <FadeUp delay={0.2}>
          <div className="group relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center border border-purple-100 mb-6">
              <LayoutDashboard className="text-purple-500" size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Replaces Notion</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              Ditch the messy, manual spreadsheet tables. A specialized, drag-and-drop Kanban Pipeline tracks every application lifecycle seamlessly. Attach CV snapshots to every card.
            </p>
            <div className="mt-8 relative h-32 rounded-xl border border-slate-100 bg-slate-50 overflow-hidden p-3 flex gap-2 shadow-inner">
               <div className="flex-1 bg-white rounded-lg p-2 space-y-2 border border-slate-200 shadow-sm">
                 <div className="w-full h-8 rounded bg-slate-100" />
                 <div className="w-full h-10 rounded bg-purple-50 border border-purple-100 flex flex-col justify-center px-2">
                   <div className="w-2/3 h-1.5 bg-purple-300 rounded mb-1" />
                   <div className="w-1/3 h-1 bg-purple-200 rounded" />
                 </div>
               </div>
               <div className="flex-1 bg-white rounded-lg p-2 border border-slate-200 shadow-sm opacity-60">
                 <div className="w-full h-8 rounded bg-slate-100 mb-2" />
                 <div className="w-full h-10 rounded bg-slate-50" />
               </div>
            </div>
          </div>
        </FadeUp>

        {/* 3. Gmail Replacement */}
        <FadeUp delay={0.3}>
          <div className="group relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100 mb-6">
              <Mail className="text-emerald-500" size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Replaces Gmail</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              Stop copying and pasting templates. Draft dynamic cover letter presets and blast them out directly to hiring managers right from your Kanban Board automatically pressing a button.
            </p>
            <div className="mt-8 relative h-32 rounded-xl border border-slate-100 bg-slate-50 overflow-hidden p-4 shadow-inner">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded bg-emerald-100 flex items-center justify-center">
                   <Mail size={10} className="text-emerald-500" />
                </div>
                <div className="w-1/2 h-2 rounded bg-slate-200" />
              </div>
              <div className="w-full h-10 rounded bg-white border border-slate-200 p-2 space-y-1.5 shadow-sm">
                 <div className="w-3/4 h-1.5 bg-slate-300 rounded" />
                 <div className="w-1/2 h-1.5 bg-slate-200 rounded" />
              </div>
              <div className="absolute bottom-3 right-3 w-12 h-6 bg-emerald-500 rounded flex items-center justify-center shadow-md">
                 <span className="text-[9px] font-bold text-white tracking-widest">SEND</span>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
