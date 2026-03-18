"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCircle,
  LayoutTemplate,
  Briefcase,
  PieChart,
  Layers,
  CheckCircle2,
  Settings,
  Target,
} from "lucide-react";

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
    label: "Targets",
    sublabel: "Companies",
    path: "/dashboard/targets",
    icon: <Target size={15} />,
  },
  {
    num: 4,
    label: "Apply",
    sublabel: "Job board",
    path: "/dashboard/job-apply",
    icon: <Briefcase size={15} />,
  },
  {
    num: 5,
    label: "Analytics",
    sublabel: "Track progress",
    path: "/dashboard/analytics",
    icon: <PieChart size={15} />,
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
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid #e4e4e7",
        }}
      >
        {/* Brand row */}
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            height: 52,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            href="/dashboard/resume-design"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
              color: "#18181b",
            }}
          >
            <Layers size={17} strokeWidth={1.8} />
            <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.02em" }}>
              Resume2Apply
            </span>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Link
              href="/dashboard/settings"
              title="Settings"
              style={{
                width: 34,
                height: 34,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 8,
                color: pathname.startsWith("/dashboard/settings") ? "#18181b" : "#71717a",
                background: pathname.startsWith("/dashboard/settings") ? "#f4f4f5" : "transparent",
                textDecoration: "none",
                transition: "background 0.15s, color 0.15s",
              }}
            >
              <Settings size={16} />
            </Link>
          </div>
        </div>

        {/* Step progress bar */}
        <div
          style={{
            borderTop: "1px solid #f4f4f5",
            background: "#fff",
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: "0 24px",
              display: "flex",
              alignItems: "stretch",
              overflowX: "auto",
            }}
            className="scrollbar-hide"
          >
            {STEPS.map((step, i) => {
              const isActive = i === activeIdx;
              const isDone = i < activeIdx;

              return (
                <React.Fragment key={step.num}>
                  <Link
                    href={step.path}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 16px 10px",
                      borderBottom: isActive
                        ? "2px solid #18181b"
                        : "2px solid transparent",
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                      transition: "border-color 0.2s",
                      position: "relative",
                    }}
                  >
                    {/* Circle number */}
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: isDone
                          ? "#18181b"
                          : isActive
                          ? "#18181b"
                          : "#fff",
                        border: isDone || isActive ? "none" : "1.5px solid #d4d4d8",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        transition: "background 0.2s",
                      }}
                    >
                      {isDone ? (
                        <CheckCircle2 size={12} color="#fff" strokeWidth={2.5} />
                      ) : (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: isActive ? "#fff" : "#a1a1aa",
                          }}
                        >
                          {step.num}
                        </span>
                      )}
                    </div>

                    {/* Label */}
                    <div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: isActive || isDone ? "#18181b" : "#a1a1aa",
                          lineHeight: 1.2,
                          transition: "color 0.2s",
                        }}
                      >
                        {step.label}
                      </div>
                      <div style={{ fontSize: 10, color: "#a1a1aa", lineHeight: 1.2 }}>
                        {step.sublabel}
                      </div>
                    </div>
                  </Link>

                  {/* Connector line between steps */}
                  {i < STEPS.length - 1 && (
                    <div
                      style={{
                        alignSelf: "center",
                        width: 20,
                        height: 1,
                        background: i < activeIdx ? "#18181b" : "#e4e4e7",
                        flexShrink: 0,
                        transition: "background 0.3s",
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </header>

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
