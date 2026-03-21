"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCircle,
  LayoutTemplate,
  Briefcase,
  PieChart,
  Target,
} from "lucide-react";
import DashboardTopNavbar from "@/app/components/ui/DashboardTopNavbar";

// ── Step definitions ───────────────────────────────────────────
const STEPS = [
  {
    num: 1,
    label: "Profile",
    sublabel: "Your data",
    path: "/dashboard/profile-data",
    icon: <UserCircle size={15} />,
  },
  {
    num: 2,
    label: "CV Design",
    sublabel: "Tweak & preview",
    path: "/dashboard/resume-design",
    icon: <LayoutTemplate size={15} />,
  },
  {
    num: 3,
    label: "Apply",
    sublabel: "Job board",
    path: "/dashboard/job-apply",
    icon: <Briefcase size={15} />,
  },
  {
    num: 4,
    label: "Analytics",
    sublabel: "Track progress",
    path: "/dashboard/analytics",
    icon: <PieChart size={15} />,
  },
   {
    num: 5,
    label: "Targets",
    sublabel: "Companies",
    path: "/dashboard/targets",
    icon: <Target size={15} />,
  },
];

function getStepIndex(pathname: string) {
  const idx = STEPS.findIndex((s) => pathname.startsWith(s.path));
  return idx >= 0 ? idx : 0;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const activeIdx = getStepIndex(pathname);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fafafa",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Top Navbar ────────────────────────────────── */}
 <DashboardTopNavbar pathname={pathname} STEPS={STEPS} activeIdx={activeIdx} />

      {/* ── Page Content ──────────────────────────────── */}
      <main style={{ flex: 1, overflowY: "auto" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ minHeight: "100%", maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
