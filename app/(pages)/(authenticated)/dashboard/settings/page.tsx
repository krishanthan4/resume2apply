"use client";

import React, { useState } from "react";
import { Sun, LogOut, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/auth/login");
      router.refresh();
    } catch (e) {
      console.error(e);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="max-w-[640px] mx-auto">
      <div className="mb-7">
        <h1 className="text-[26px] font-extrabold tracking-[-0.025em] text-zinc-900 mb-1.5">
          Settings
        </h1>
        <p className="text-sm text-zinc-500">
          Platform configuration for your Resume2Apply workspace.
        </p>
      </div>

      {/* Card */}
      <div className="bg-white border border-zinc-200 rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="px-6 py-[18px] border-b border-zinc-100">
          <div className="text-[13px] font-semibold text-zinc-900">Appearance</div>
        </div>

        <div className="p-6 flex justify-between items-center">
          <div>
            <div className="text-sm font-medium text-zinc-900 mb-[3px]">Theme</div>
            <div className="text-xs text-zinc-500">
              This platform uses a clean white theme. Dark mode coming soon.
            </div>
          </div>
          <div className="flex items-center gap-2 py-2 px-[14px] bg-zinc-100 border border-zinc-200 rounded-full text-[13px] font-medium text-zinc-600">
            <Sun size={14} /> Light
          </div>
        </div>
      </div>

      {/* About card */}
      <div className="mt-3.5 bg-white border border-zinc-200 rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="px-6 py-[18px] border-b border-zinc-100">
          <div className="text-[13px] font-semibold text-zinc-900">About</div>
        </div>
        <div className="p-6">
          <dl className="flex flex-col gap-3">
            {[
              ["Platform", "Resume2Apply"],
              ["Version", "0.1.0"],
              ["Mode", "Self-hosted"],
              ["Database", "MongoDB (Mongoose)"],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between">
                <dt className="text-[13px] text-zinc-500">{label}</dt>
                <dd className="text-[13px] font-medium text-zinc-900">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Account card */}
      <div className="mt-3.5 bg-white border border-zinc-200 rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="px-6 py-[18px] border-b border-zinc-100">
          <div className="text-[13px] font-semibold text-zinc-900">Account</div>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm font-medium text-zinc-900 mb-[3px]">Sign Out</div>
              <div className="text-xs text-zinc-500">
                Log out of your current session on this device.
              </div>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-2 py-2 px-[14px] bg-red-50 hover:bg-red-100 border border-red-200 rounded-full text-[13px] font-medium text-red-600 transition-colors disabled:opacity-50"
            >
              {isLoggingOut ? <Loader2 size={14} className="animate-spin" /> : <LogOut size={14} />}
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}