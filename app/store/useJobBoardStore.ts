"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface JobBoardState {
    pendingResumeConfig: any | null;
    setPendingResumeConfig: (config: any) => void;
    clearPendingResumeConfig: () => void;
}

export const useJobBoardStore = create<JobBoardState>()(
    persist(
        (set) => ({
            pendingResumeConfig: null,
            setPendingResumeConfig: (config) => set({ pendingResumeConfig: config }),
            clearPendingResumeConfig: () => set({ pendingResumeConfig: null }),
        }),
        {
            name: "job-board-storage",
            storage: createJSONStorage(() => typeof window !== "undefined" ? sessionStorage : ({} as any)),
        }
    )
);

if (typeof window !== "undefined") {
    window.addEventListener("beforeunload", () => {
        sessionStorage.removeItem("job-board-storage");
    });
}
