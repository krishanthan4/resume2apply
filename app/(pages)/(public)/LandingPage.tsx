"use client";

import React from "react";
import { Navbar } from "../../components/landing/Navbar";
import { Hero } from "../../components/landing/Hero";
import { Timeline } from "../../components/landing/Timeline";
import { FAQ } from "../../components/landing/FAQ";
import { Footer } from "../../components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-blue-200/50 font-sans relative overflow-hidden text-slate-900">
      <Navbar />
      <Hero />
      <Timeline />
      <FAQ />
      <Footer />
    </div>
  );
}