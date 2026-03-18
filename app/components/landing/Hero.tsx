"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center h-screen  px-6 z-10 bg-white overflow-hidden">
      {/* --- Ambient Background --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Soft colorful glow meshes - matching user reference image */}
        <div className="absolute top-[0%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-400/50 blur-[120px]" />
        <div className="absolute top-[10%] right-[-10%] w-[50%] h-[70%] rounded-full bg-sky-300/40 blur-[120px]" />
        <div className="absolute bottom-[0%] left-[20%] w-[40%] h-[40%] rounded-full bg-white blur-[100px]" />
        
        {/* User background image on the right */}
        <div className="absolute right-[-10%] top-[10%] w-[60%] h-[80%] opacity-20 md:opacity-40 select-none">
           <Image 
             src="/backgroundimage.png" 
             alt="Background" 
             fill 
             priority
             className="object-contain object-right"
           />
        </div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white/50 text-slate-600 text-sm font-medium mb-8 shadow-sm">
            <ArrowRight className="w-4 h-4 text-blue-500" />
            <span>Create CV</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span>Apply for Jobs</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span>Manage Application</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
           Apply For Jobs in 10x
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
        No more 100 CVs in folders, no more manual cover letters,<br/> no manual tracking applications in notion.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/auth/register" 
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg transition-all shadow-[0_8px_30px_rgba(37,99,235,0.2)] hover:shadow-[0_8px_30px_rgba(37,99,235,0.3)] hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Apply & Manage (2 sec) <ArrowRight size={18} />
            </Link>
            <a 
              href="https://github.com" 
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 font-semibold text-lg transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow"
            >
              View on GitHub
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
