"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { FadeUp } from "./FadeUp";

const FAQ_DATA = [
  {
    q: "What About my Data Privacy? I gave all of my details",
    a: "What Privacy brother?. Your data ,your database.don't care about Security",
    image: "/backgroundimage.png", // Example: User can replace this later
  },
  {
    q: "Does it come with pre-built Resume Templates?",
    a: "No, Just 1 Template, But You can customize it however you want",
    image: "/resume2apply.png", // Example: User can replace this later
  },
  {
    q: "How does the email sending work?",
    a: "You just provide a free Resend.com API Key inside your server environment parameters, and Resume2Apply binds instantly — giving you full permission to auto-send Cover letters via SMTP.",
  },
  {
    q: "Where is my data stored?",
    a: "In your chosen MongoDB instance. Because it is self-hosted, you hold complete sovereignty over your data and PDFs. No 3rd parties scanning your work history.",
  },
];

const AccordionItem = ({ q, a, image }: { q: string; a: string; image?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-2xl mb-4 overflow-hidden bg-white shadow-sm hover:border-slate-300 transition-colors">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
      >
        <span className="font-semibold text-slate-900 text-lg">{q}</span>
        <ChevronDown
          className={`text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                {a}
              </div>
              
              {image && (
                <FadeUp>
                  <div className="relative w-32 mx-auto aspect-square mb-4 mt-4">
                    <div className="absolute inset-0 bg-white border-[12px] border-white ring-1 ring-black shadow-2xl rounded-sm rotate-3 hover:rotate-0 transition-transform duration-500 overflow-hidden">
                      <Image 
                        src={image} 
                        alt="FAQ Visual" 
                        fill 
                        className="object-cover"
                      />
                    </div>
                  </div>
                </FadeUp>
              )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function FAQ() {
  return (
    <section className="py-32 relative z-10 bg-white overflow-hidden">
      {/* --- Ambient Background --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-blue-100/40 blur-[100px]" />
        <div className="absolute bottom-[10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-blue-50/30 blur-[100px]" />
      </div>

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <FadeUp>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-600 text-lg">Clear answers to help you deploy effortlessly.</p>
          </div>
        </FadeUp>
        
        <div className="space-y-4">
          {FAQ_DATA.map((item, index) => (
            <FadeUp key={index} delay={index * 0.1}>
              <AccordionItem q={item.q} a={item.a} image={item.image} />
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
