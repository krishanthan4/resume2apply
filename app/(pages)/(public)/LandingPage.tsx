"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  FileText,
  Briefcase,
  BarChart2,
  ArrowRight,
  CheckCircle2,
  Layers,
} from "lucide-react";

// ── Fade-up helper ────────────────────────────────────────────
function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Animated Dashboard Mock (hero visual) ─────────────────────
function DashboardMock() {
  const cols = [
    { label: "Willing to Apply", color: "#3b82f6", cards: ["Frontend Dev @ Meta", "SWE @ Stripe"] },
    { label: "Applied", color: "#a855f7", cards: ["Backend Eng @ Linear"] },
    { label: "In Progress", color: "#f59e0b", cards: ["Full Stack @ Notion"] },
    { label: "Rejected", color: "#ef4444", cards: [] },
  ];

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Window chrome */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e4e4e7",
          borderRadius: 16,
          boxShadow: "0 20px 60px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            padding: "12px 18px",
            borderBottom: "1px solid #e4e4e7",
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#fafafa",
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e" }} />
          <div
            style={{
              marginLeft: 12,
              fontSize: 11,
              color: "#a1a1aa",
              fontWeight: 500,
              background: "#f4f4f5",
              padding: "3px 12px",
              borderRadius: 6,
            }}
          >
            resume2apply / Application Board
          </div>
        </div>

        {/* Kanban body */}
        <div style={{ display: "flex", gap: 12, padding: 16, background: "#fafafa", overflowX: "auto" }}>
          {cols.map((col, ci) => (
            <div
              key={ci}
              style={{
                minWidth: 150,
                flex: 1,
                background: "#fff",
                border: "1px solid #e4e4e7",
                borderRadius: 10,
                padding: "10px 10px 12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: col.color,
                  }}
                />
                <span style={{ fontSize: 10, fontWeight: 600, color: "#71717a" }}>
                  {col.label}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {col.cards.map((card, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + ci * 0.15 + idx * 0.1, duration: 0.4 }}
                    style={{
                      background: "#fafafa",
                      border: "1px solid #e4e4e7",
                      borderRadius: 8,
                      padding: "8px 10px",
                    }}
                  >
                    <div style={{ fontSize: 10, fontWeight: 500, color: "#18181b" }}>{card}</div>
                    <div
                      style={{
                        marginTop: 5,
                        height: 4,
                        borderRadius: 4,
                        background: col.color,
                        opacity: 0.25,
                        width: "60%",
                      }}
                    />
                  </motion.div>
                ))}
                {col.cards.length === 0 && (
                  <div
                    style={{
                      height: 38,
                      border: "1.5px dashed #e4e4e7",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ fontSize: 10, color: "#d4d4d8" }}>Drop here</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom strip — step progress */}
        <div
          style={{
            padding: "10px 18px",
            borderTop: "1px solid #e4e4e7",
            display: "flex",
            alignItems: "center",
            gap: 0,
          }}
        >
          {["Profile", "CV Design", "Apply", "Track", "Analytics"].map((step, i) => (
            <React.Fragment key={i}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: i <= 2 ? "#18181b" : "#f4f4f5",
                    border: i <= 2 ? "none" : "1.5px solid #e4e4e7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {i <= 2 ? (
                    <CheckCircle2 size={11} color="#fff" />
                  ) : (
                    <span style={{ fontSize: 8, color: "#a1a1aa", fontWeight: 600 }}>{i + 1}</span>
                  )}
                </div>
                <span style={{ fontSize: 8, color: i <= 2 ? "#18181b" : "#a1a1aa", fontWeight: 500 }}>
                  {step}
                </span>
              </div>
              {i < 4 && (
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background: i < 2 ? "#18181b" : "#e4e4e7",
                    marginBottom: 14,
                    minWidth: 12,
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Feature card mini visuals ─────────────────────────────────
function CVBuilderMini() {
  const fields = ["Full Name", "Email", "GitHub", "LinkedIn", "Experience..."];
  return (
    <div style={{ padding: "14px 14px 10px", display: "flex", flexDirection: "column", gap: 7 }}>
      {fields.map((f, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 + i * 0.08 }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <div style={{ fontSize: 9, color: "#a1a1aa", fontWeight: 500 }}>{f}</div>
          <div
            style={{
              height: 24,
              background: "#fafafa",
              border: "1px solid #e4e4e7",
              borderRadius: 5,
              width: i === 4 ? "100%" : `${55 + i * 8}%`,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

function KanbanMini() {
  const cards = [
    { col: "Applied", c: "#a855f7" },
    { col: "In Progress", c: "#f59e0b" },
    { col: "Applied", c: "#a855f7" },
  ];
  return (
    <div style={{ padding: 14, display: "flex", gap: 8 }}>
      {["Willing", "Applied", "Progress"].map((col, ci) => (
        <div key={ci} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontSize: 8, fontWeight: 600, color: "#a1a1aa" }}>{col}</div>
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: ci * 2 + i < cards.length ? 1 : 0.25, scale: 1 }}
              transition={{ delay: 0.5 + ci * 0.1 + i * 0.08 }}
              style={{
                height: 28,
                background: ci === 1 && i === 0 ? "#a855f620" : "#fafafa",
                border: `1px solid ${ci === 1 && i === 0 ? "#a855f650" : "#e4e4e7"}`,
                borderRadius: 6,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function AnalyticsMini() {
  const bars = [40, 65, 30, 80, 55, 90, 45];
  return (
    <div style={{ padding: "14px 14px 10px" }}>
      <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 70 }}>
        {bars.map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ delay: 0.4 + i * 0.06, duration: 0.5, ease: "easeOut" }}
            style={{
              flex: 1,
              background: i === 5 ? "#18181b" : "#f4f4f5",
              borderRadius: "3px 3px 0 0",
            }}
          />
        ))}
      </div>
      <div style={{ height: 1, background: "#e4e4e7", marginTop: 6 }} />
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        {["Today: 0", "Week: 3", "Total: 8"].map((t, i) => (
          <div key={i} style={{ fontSize: 9, color: "#a1a1aa" }}>
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Steps data ────────────────────────────────────────────────
const HOW_IT_WORKS = [
  {
    num: "01",
    title: "Fill your profile",
    desc: "Add your experience, projects, skills and education once.",
  },
  {
    num: "02",
    title: "Tweak your CV",
    desc: "Pick a template, reorder sections, adjust styles — all live.",
  },
  {
    num: "03",
    title: "Apply to jobs",
    desc: "Generate a tailored resume per role and send it with one click.",
  },
  {
    num: "04",
    title: "Track everything",
    desc: "Move applications through a Kanban board and see your analytics.",
  },
];

const FEATURES = [
  {
    icon: <FileText size={18} strokeWidth={1.5} />,
    title: "CV Builder",
    desc: "A guided step-by-step wizard to capture all your data once. Then tweak per application.",
    visual: <CVBuilderMini />,
  },
  {
    icon: <Briefcase size={18} strokeWidth={1.5} />,
    title: "Smart Job Board",
    desc: "Drag-and-drop Kanban to track every application from wishlist to offer.",
    visual: <KanbanMini />,
  },
  {
    icon: <BarChart2 size={18} strokeWidth={1.5} />,
    title: "Analytics",
    desc: "See how many applications you sent today, this week, this month — across all stages.",
    visual: <AnalyticsMini />,
  },
];

// ── Main Page Component ───────────────────────────────────────
export default function LandingPage() {
  return (
    <div style={{ background: "#fff", color: "#18181b", overflowX: "hidden" }}>
      {/* ── Navbar ────────────────────────────────────── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 50,
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid #e4e4e7",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 24px",
            height: 58,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Layers size={18} strokeWidth={1.8} />
            <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.02em" }}>
              Resume2Apply
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link
              href="/auth/login"
              style={{ fontSize: 13, fontWeight: 500, color: "#71717a", textDecoration: "none" }}
            >
              Log in
            </Link>
            <Link
              href="/auth/register"
              style={{
                fontSize: 13,
                fontWeight: 500,
                background: "#18181b",
                color: "#fff",
                padding: "7px 16px",
                borderRadius: 8,
                textDecoration: "none",
              }}
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────── */}
      <section
        style={{
          paddingTop: 120,
          paddingBottom: 80,
          textAlign: "center",
          maxWidth: 860,
          margin: "0 auto",
          padding: "120px 24px 72px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              fontWeight: 500,
              color: "#71717a",
              background: "#f4f4f5",
              border: "1px solid #e4e4e7",
              padding: "4px 12px",
              borderRadius: 99,
              marginBottom: 28,
            }}
          >
            <CheckCircle2 size={12} color="#22c55e" />
            Self-hosted · Open source
          </div>

          <h1
            style={{
              fontSize: "clamp(38px, 6vw, 64px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "#18181b",
              marginBottom: 22,
            }}
          >
            Build your CV.
            <br />
            <span style={{ color: "#a1a1aa" }}>Apply smarter.</span>
          </h1>

          <p
            style={{
              fontSize: 17,
              color: "#71717a",
              lineHeight: 1.7,
              maxWidth: 500,
              margin: "0 auto 36px",
            }}
          >
            A guided workspace to craft your resume, track every job application,
            and move from "wishlist" to "hired" — step by step.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/auth/register"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 14,
                fontWeight: 600,
                background: "#18181b",
                color: "#fff",
                padding: "12px 24px",
                borderRadius: 10,
                textDecoration: "none",
              }}
            >
              Start building <ArrowRight size={16} />
            </Link>
            <Link
              href="/auth/login"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 14,
                fontWeight: 500,
                background: "#fff",
                color: "#18181b",
                padding: "12px 24px",
                borderRadius: 10,
                textDecoration: "none",
                border: "1px solid #e4e4e7",
              }}
            >
              Log in
            </Link>
          </div>
        </motion.div>

        {/* Product visual preview */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginTop: 56 }}
        >
          <DashboardMock />
        </motion.div>
      </section>

      {/* ── Features ──────────────────────────────────── */}
      <section
        style={{
          padding: "80px 24px",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <FadeUp>
          <p style={{ textAlign: "center", fontSize: 12, fontWeight: 600, color: "#a1a1aa", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
            What you get
          </p>
          <h2
            style={{
              textAlign: "center",
              fontSize: "clamp(26px, 4vw, 40px)",
              fontWeight: 800,
              letterSpacing: "-0.025em",
              marginBottom: 56,
              color: "#18181b",
            }}
          >
            Everything you need, nothing you don't.
          </h2>
        </FadeUp>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
            gap: 20,
          }}
        >
          {FEATURES.map((feat, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #e4e4e7",
                  borderRadius: 16,
                  overflow: "hidden",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  transition: "box-shadow 0.2s, transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.09)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                {/* Mini visual area */}
                <div
                  style={{
                    borderBottom: "1px solid #e4e4e7",
                    background: "#fafafa",
                    minHeight: 130,
                  }}
                >
                  {feat.visual}
                </div>

                {/* Description */}
                <div style={{ padding: "18px 18px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: "#f4f4f5",
                        border: "1px solid #e4e4e7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#18181b",
                      }}
                    >
                      {feat.icon}
                    </div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#18181b", margin: 0 }}>
                      {feat.title}
                    </h3>
                  </div>
                  <p style={{ fontSize: 13, color: "#71717a", lineHeight: 1.65, margin: 0 }}>
                    {feat.desc}
                  </p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────── */}
      <section
        style={{
          padding: "80px 24px",
          background: "#fafafa",
          borderTop: "1px solid #e4e4e7",
          borderBottom: "1px solid #e4e4e7",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <FadeUp>
            <p style={{ textAlign: "center", fontSize: 12, fontWeight: 600, color: "#a1a1aa", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
              The journey
            </p>
            <h2
              style={{
                textAlign: "center",
                fontSize: "clamp(26px, 4vw, 40px)",
                fontWeight: 800,
                letterSpacing: "-0.025em",
                marginBottom: 60,
                color: "#18181b",
              }}
            >
              From profile to hired — step by step.
            </h2>
          </FadeUp>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {HOW_IT_WORKS.map((step, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 24,
                    padding: "28px 0",
                    borderBottom: i < HOW_IT_WORKS.length - 1 ? "1px solid #e4e4e7" : "none",
                  }}
                >
                  {/* Number */}
                  <div
                    style={{
                      flexShrink: 0,
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: i === 0 ? "#18181b" : "#fff",
                      border: `1px solid ${i === 0 ? "#18181b" : "#e4e4e7"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 700,
                      color: i === 0 ? "#fff" : "#a1a1aa",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {step.num}
                  </div>

                  <div>
                    <h3
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: "#18181b",
                        marginBottom: 6,
                        letterSpacing: "-0.015em",
                      }}
                    >
                      {step.title}
                    </h3>
                    <p style={{ fontSize: 14, color: "#71717a", lineHeight: 1.65, maxWidth: 480 }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────── */}
      <section style={{ padding: "96px 24px", textAlign: "center" }}>
        <FadeUp>
          <h2
            style={{
              fontSize: "clamp(28px, 5vw, 48px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              marginBottom: 18,
              color: "#18181b",
            }}
          >
            Ready to land your next role?
          </h2>
          <p style={{ fontSize: 16, color: "#71717a", marginBottom: 36 }}>
            Self-host in minutes. Your data, your control.
          </p>
          <Link
            href="/auth/register"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 15,
              fontWeight: 600,
              background: "#18181b",
              color: "#fff",
              padding: "14px 28px",
              borderRadius: 12,
              textDecoration: "none",
            }}
          >
            Get started — it's free <ArrowRight size={16} />
          </Link>
        </FadeUp>
      </section>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer
        style={{
          borderTop: "1px solid #e4e4e7",
          padding: "24px",
          textAlign: "center",
          fontSize: 12,
          color: "#a1a1aa",
        }}
      >
        Resume2Apply — self-hosted job application platform
      </footer>
    </div>
  );
}