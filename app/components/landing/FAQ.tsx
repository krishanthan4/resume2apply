"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { FadeUp } from "./FadeUp";

const FAQ_DATA = [
  {
    q: "Why is this platform open-source?",
    a: "We believe in transparency and security. Since this platform handles job application emails, sending them requires your own email credentials. By being open-source, you can verify how your data is handled and even run your own instance to keep your credentials completely private while still benefiting from our powerful resume-building and email-sending features.",
    image: "/backgroundimage.png",
  },
  {
    q: "Does it come with pre-built Resume Templates?",
    a: "No, Just 1 Template, But You can customize it however you want",
    image: "/resume2apply.png", // Example: User can replace this later
  },
  {
    q: "How does the email sending work?",
    a: "You can send emails with your professional email, you can choose your google or outlook email to send emails from, in the future update we will add the feature to use your own domain email to send emails from",
  },
  {
    q: "How does the cover letter work?",
    a: "You can generate cover letters for each job application, you can customize the cover letter to your needs, in the future update we will add the feature to generate cover letters automatically",
  },
  {
    q: "Is the platform mobile-friendly?",
    a: "Yes, the platform is fully responsive and works great on mobile devices. You can manage your applications and even edit your resume on the go.",
  },
  {
    q: "Can I export my resume to PDF?",
    a: "Yes, you can export your resume to a high-quality PDF format , ensuring that your application gets through automated screening systems.",
  },

];

const AccordionItem = ({ q, a }: { q: string; a: string}) => {
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function FAQ() {
  return (
    <section id="faq" className="py-24 relative z-10 bg-white overflow-hidden">
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
              <AccordionItem q={item.q} a={item.a} />
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
