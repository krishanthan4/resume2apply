"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { PROJECT_REPO_URL } from "@/app/utils/consts";

export function Hero() {
  return (
    <section className="relative grid md:grid-cols-3 grid-cols-1 px-10 items-center md:justify-between min-h-screen overflow-hidden max-w-5xl mx-auto">
      {/* Main Content (Left aligned) */}
      <div className="md:col-span-2 w-full  md:text-left text-center relative z-10 md:pt-20 pt-5 lg:pt-0">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:items-start items-center "
        >
          {/* Breadcrumbs */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-200 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-zinc-800 sm:text-sm text-[12px] font-semibold mb-10">
            <span>Create Resume</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            <span>Apply</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            <span>Manage Process</span>
          </div>

          {/* Headline */}
          <h1 className="sm:text-5xl text-3xl  font-extrabold text-slate-900 tracking-tight leading-[1.05] mb-6">
            Apply for Jobs In
            <br />
            Seconds,{" "}
            <span className="bg-black text-white px-2 py-1 inline-block -rotate-1 mt-2 transform">
              Not in Hours
            </span>
          </h1>

          {/* Subheadline */}
          <p className="sm:text-base text-sm  text-slate-700 font-bold mb-10 tracking-tight">
            Customize CV, Schedule Emails, Manage Applying/ Applied Jobs
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              href="/auth/register"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold sm:text-lg text-base transition-all shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Start Applying Faster <span className="font-mono">{">>"}</span>
            </Link>
            {PROJECT_REPO_URL && (
              <a
                href={PROJECT_REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-900 font-bold sm:text-lg text-base transition-all flex items-center justify-center shadow-sm"
              >
                View on GitHub
              </a>
            )}
          </div>
        </motion.div>
      </div>

      {/* Right side floating image (App logos) */}
      <div className="md:col-span-1 right-0 top-0 w-full h-[60vh] lg:h-[80vh] relative z-10 hidden md:block">
        <motion.div
                  initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-full flex flex-col items-center justify-center"
        >
          <div className="relative w-full h-[120%] lg:absolute lg:top-[-10%] lg:right-[-5%] right-0">
            <Image
              src="/backgroundimage.png"
              alt="App integrations"
              fill
              priority
              draggable={false}
              className="object-contain object-center lg:object-right mix-blend-multiply "
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
