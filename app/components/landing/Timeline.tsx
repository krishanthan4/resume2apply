"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { FadeUp } from "./FadeUp";

const TIMELINE_DATA = [
  {
    title: "1 Resume , 100+ Customizations",
    description: "You don't need to create resume multiple resumes, just add your information once.",
    image: "/timeline_images/1.png", // Replace with relevant story images
    side: "left"
  },
  {
        title: "No more juggling through multiple CVs",
    description: "Choose the format, tweak the content, add details and boom.Perfect CV is ready for every single company you want to apply to.",

    image: "/timeline_images/2.png", // Replace with relevant story images
    side: "right"
  },
  {
    title: "Managing Applications is a nightmares",
    description: "Manually tracking 50+ applications in Notion or Excel is a full-time job. You spend more time organizing than actually applying.",
    image: "/timeline_images/3.png",
    side: "left"
  },
  {
    title: "Schedule instead of applying at 8:58 AM everyday",
    description: "Set your preferences, schedule your applications, and let the system do the work. Apply to your dream companies at the right time.",
    image: "/timeline_images/4.png", // Replace with relevant story images
    side: "right"
  }
];

function TimelineItem({ item, index }: { item: typeof TIMELINE_DATA[0]; index: number }) {
  const isLeft = item.side === "left";
  
  return (
    <div className={`flex flex-col md:flex-row items-center justify-between mb-32 relative z-10 ${isLeft ? "" : "md:flex-row-reverse"}`}>
      {/* Content */}
      <div className="w-full md:w-[45%] mb-8 md:mb-0 px-5">
        <FadeUp delay={0.2}>
          <div className={`${isLeft ? "md:text-right" : "md:text-left"}`}>
             <span className="text-zinc-600 font-bold text-sm uppercase tracking-widest mb-4 block">Step 0{index + 1}</span>
             <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight group-hover:text-zinc-600 transition-colors">
               {item.title}
             </h3>
             <p className="text-slate-600 text-lg leading-relaxed max-w-lg mx-auto md:mx-0">
               {item.description}
             </p>
          </div>
        </FadeUp>
      </div>

      {/* Decorative Center Dot (Hidden on mobile for better layout) */}
      <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border-4 border-zinc-600 z-20 items-center justify-center shadow-lg shadow-zinc-100">
         <div className="w-4 h-4 rounded-full bg-zinc-600" />
      </div>

      {/* Image */}
      <div className="w-full md:w-[60%]">
        <FadeUp delay={0.4}>
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 border-2 border-white ring-1 ring-slate-200 group transition-transform hover:-translate-y-2 duration-500">
            <Image 
              src={item.image} 
              alt={item.title} 
              fill 
              className="object-contain group-hover:scale-[101%] transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-zinc-600/5 group-hover:bg-transparent transition-colors duration-500" />
          </div>
        </FadeUp>
      </div>
    </div>
  );
}

export function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section ref={containerRef} id="how-it-works" className=" relative bg-slate-50/30 overflow-hidden">
      {/* --- Ambient Background --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-zinc-50/50 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-sky-50/40 blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative">
        <FadeUp>
          <div className="text-center md:mb-24 mb-10">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
              Just 4 Steps .
            </h2>
            <p className="text-slate-500 md:text-xl text-lg max-w-2xl mx-auto">
              From crafting the perfect resume to landing your dream job, see how Resume2Apply transforms your career journey.
            </p>
          </div>
        </FadeUp>

        <div className="relative">
          {/* Animated Vertical Line */}
          <motion.div 
            style={{ scaleY }}
            className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-zinc-200 via-zinc-600 to-zinc-200 origin-top -translate-x-1/2 rounded-full z-0"
          />

          {TIMELINE_DATA.map((item, i) => (
            <TimelineItem key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
