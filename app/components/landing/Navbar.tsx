"use client";

import React from "react";
import Link from "next/link";
import { Layers } from "lucide-react";
import Image from "next/image";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-slate-200/60 bg-white/30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer">
      <Image src="/resume2apply.png" alt="Logo" width={50} height={50} />
          <span className="font-bold text-slate-900 tracking-tight text-lg">Resume2Apply</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/auth/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Log in
          </Link>
          <Link href="/auth/register" className="text-sm font-semibold bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-slate-800 transition-all shadow-sm">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
