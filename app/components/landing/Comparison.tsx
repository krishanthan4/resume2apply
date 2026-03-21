"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Timer, Clock } from "lucide-react";

export function Comparison() {
  return (
    <section id="comparison" className="max-w-3xl md:px-0 px-10 mx-auto relative overflow-hidden md:py-10 py-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Without Resume2Apply */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl p-5 pt-7 border border-zinc-200 shadow-sm relative overflow-hidden flex flex-col items-center"
          >
            <h3 className="text-xl font-bold text-zinc-900 mb-2 flex items-center gap-3">
              Without Resume2Apply
            </h3>

            {/* Time Graphic */}
            <div className="relative mb-10 w-24 h-24 rounded-full border-[5px] border-red-500/20 flex flex-col items-center justify-center bg-red-50 shadow-[0_0_40px_rgba(99,102,241,0.15)]">
                <span className="text-2xl font-black tracking-tighter">42</span>
              <span className="text-[9px] font-bold text-red-800 uppercase tracking-widest mt-1">minutes</span>
              
              {/* Spinning border effect placeholder */}
              <div className="absolute inset-[-5px] rounded-full border-[5px] border-transparent border-t-red-500 animate-[spin_4s_linear_infinite] pointer-events-none"></div>
            </div>
            <div className="w-full">
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1 px-2">The Process</p>
              <ul className="space-y-1 w-full">
                {[
                  "Find existing resume (1.5 mins)",
                  "Make a Copy of it (5 secs)",
                  "Edit Resume On Word (10 mins)",
                  "Write Cover Letter From Ground (20 mins)",
                  "Send the Email (5 secs)",
                  "Track Applied Job in Notion (10 mins)",
                ].map((item, i) => (
                  <li key={i} className="flex  items-center gap-1 text-zinc-600 text-sm rounded-xl p-1">
              <Clock size={10} className="text-red-500 " />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* With Resume2Apply */}
               <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl p-5 pt-7 border border-zinc-200 shadow-sm relative overflow-hidden flex flex-col items-center"
          >
            <h3 className="text-xl font-bold text-zinc-900 mb-2 flex items-center gap-3">
              
              With Resume2Apply
            </h3>

            {/* Time Graphic */}
            <div className="relative mb-10 w-24 h-24 rounded-full border-[5px] border-green-500/20 flex flex-col items-center justify-center bg-slate-100 shadow-[0_0_40px_rgba(99,102,241,0.15)]">
                <span className="text-2xl font-black tracking-tighter">19</span>
              <span className="text-[9px] font-bold text-green-800 uppercase tracking-widest ">seconds</span>
              
              {/* Spinning border effect placeholder */}
              <div className="absolute inset-[-5px] rounded-full border-[5px] border-transparent border-t-green-500 animate-[spin_4s_linear_infinite] pointer-events-none"></div>
            </div>
            <div className="w-full">
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1 px-2">The Process</p>
              <ul className="space-y-1 w-full">
                {[
                  "Choose the resume type (1 sec)",
                  "choose a summery template (2 secs)",
                  "add company name & appling position (5 secs)",
                  "create new job application (8 secs)",
                  "Select cover letter template (2 secs)",
                  "schedule or apply now (1 sec)",
                  "manage in kanban board (0 secs)",
                ].map((item, i) => (
                  <li key={i} className="flex  items-center gap-1 text-zinc-600 text-sm rounded-xl p-1">
              <Clock size={10} className="text-green-500 " />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

        </div>
    </section>
  );
}
