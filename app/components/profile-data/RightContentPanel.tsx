import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import { Button } from "@/app/components/ui";


function RightContentPanel({activeTab, isLast, handleSave, goNext, TABS, SECTION_CONTENT,activeIdx}:{
    activeTab: string;
    isLast: boolean;
    handleSave: () => void;
    goNext: () => void;
    TABS: any[];
    SECTION_CONTENT: any;
    activeIdx: number;
}) {
    return (
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{ background: "#fff", border: "1px solid #e4e4e7", borderRadius: 14, padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                {SECTION_CONTENT[activeTab]}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom action row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
            <div></div>
            {isLast ? (
              <a href="/dashboard/resume-design">
                <Button onClick={handleSave}>
                Continue to CV Design <ArrowRight size={14} />

                </Button>
              </a>
            ) : (
              <Button style={{ fontSize: 13 }} onClick={goNext}>
                Next: {TABS[activeIdx + 1]?.label} <ChevronRight size={14} />
              </Button>
            )}
          </div>
        </div>    )
}

export default RightContentPanel