"use client";

import React, { useState, useEffect } from "react";
import { Sun, LogOut, Loader2, Mail, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/user/me");
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

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

  const connectGoogle = async () => {
    try {
      const res = await fetch("/api/auth/google/url");
      const { url } = await res.json();
      window.location.href = url;
    } catch (e) {
      console.error(e);
    }
  };

  const connectOutlook = async () => {
    try {
      const res = await fetch("/api/auth/outlook/url");
      const { url } = await res.json();
      window.location.href = url;
    } catch (e) {
      console.error(e);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect your email account? This will stop all scheduled email sending.")) return;

    setIsDisconnecting(true);
    try {
      const res = await fetch("/api/user/email-connection", { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        await fetchUser(); // Refresh user data to update UI
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <div className="max-w-[640px] mx-auto pb-10">
      <div className="mb-7">
        <h1 className="text-[26px] font-extrabold tracking-[-0.025em] text-zinc-900 mb-1.5">
          Settings
        </h1>
        <p className="text-sm text-zinc-500">
          Platform configuration for your Resume2Apply workspace.
        </p>
      </div>

      {/* Email Connection Card */}
      <div className="mb-3.5 bg-white border border-zinc-200 rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="px-6 py-[18px] border-b border-zinc-100">
          <div className="text-[13px] font-semibold text-zinc-900">Email Connection</div>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="animate-spin text-zinc-400" size={20} />
            </div>
          ) : user?.emailConnection?.provider && user.emailConnection.provider !== 'none' ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-emerald-100 bg-emerald-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-zinc-900 capitalize">
                      {user.emailConnection.provider} Connected
                    </div>
                    <div className="text-xs text-zinc-500">{user.emailConnection.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={user.emailConnection.provider === 'gmail' ? connectGoogle : connectOutlook}
                    className="text-xs font-medium text-zinc-500 hover:text-zinc-900 underline underline-offset-4"
                  >
                    Change Account
                  </button>
                  <span className="text-zinc-300">|</span>
                  <button
                    onClick={handleDisconnect}
                    disabled={isDisconnecting}
                    className="text-xs font-medium text-red-500 hover:text-red-700 underline underline-offset-4 disabled:opacity-50"
                  >
                    {isDisconnecting ? "Removing..." : "Disconnect"}
                  </button>
                </div>
              </div>
              <p className="text-xs text-zinc-500 px-1">
                Emails for job applications will be sent directly from your {user.emailConnection.provider} account.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-zinc-500">
                Connect your personal email to send job applications directly from your own domain. This increases conversion rates and provides a better experience for recruiters.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={connectGoogle}
                  className="flex items-center justify-center gap-2.5 py-2.5 border border-zinc-200 rounded-xl text-[13px] font-medium text-zinc-700 bg-white hover:bg-zinc-50 transition-colors shadow-sm"
                >
                   <Mail size={16} className="text-red-500" />
                  Connect Gmail
                </button>
                <button
                  onClick={connectOutlook}
                  className="flex items-center justify-center gap-2.5 py-2.5 border border-zinc-200 rounded-xl text-[13px] font-medium text-zinc-700 bg-white hover:bg-zinc-50 transition-colors shadow-sm"
                >
                   <Mail size={16} className="text-blue-500" />
                  Connect Outlook
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Theme Card */}
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
            <div >
              <div className="text-sm font-medium text-zinc-900 mb-[3px]">Sign Out</div>
              <div className="text-xs sm:block hidden text-zinc-500">
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