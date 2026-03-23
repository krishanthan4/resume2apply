"use client";

import { Navbar } from "../../components/landing/Navbar";
import { Hero } from "../../components/landing/Hero";
import { Timeline } from "../../components/landing/Timeline";
import { Comparison } from "../../components/landing/Comparison";
import { FAQ } from "../../components/landing/FAQ";
import { Footer } from "../../components/landing/Footer";
import DemoVideo from "@/app/components/landing/DemoVideo";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-blue-200/50 font-sans relative overflow-hidden text-slate-900">
      <Navbar />
      <Hero />
      <DemoVideo />
      <Timeline />
      <Comparison />
      <FAQ />
      <Footer />
    </div>
  );
}