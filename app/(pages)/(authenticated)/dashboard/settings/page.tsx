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

      {/* Profile Card */}
      <div className="mb-3.5 bg-white border border-zinc-200 rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="px-6 py-[18px] border-b border-zinc-100">
          <div className="text-[13px] font-semibold text-zinc-900">Profile Information</div>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col gap-4 animate-pulse">
              <div className="h-4 bg-zinc-100 rounded w-3/4"></div>
              <div className="h-4 bg-zinc-100 rounded w-1/2"></div>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-2">
                <div className="text-[13px] text-zinc-500 font-medium">Full Name</div>
                <div className="text-[13px] text-zinc-900 font-bold">{user?.name}</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="text-[13px] text-zinc-500 font-medium">Email Address</div>
                <div className="text-[13px] text-zinc-900 font-bold">{user?.email}</div>
              </div>
              <div className="grid grid-cols-2 border-t border-zinc-50 pt-4">
                <div className="text-[13px] text-zinc-500 font-medium">Account Type</div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${user?.authType === 'email' ? 'bg-zinc-400' : 'bg-blue-400'}`}></div>
                  <div className="text-[13px] text-zinc-900 font-bold capitalize">
                    {user?.authType === 'email' ? 'Email & Password' : `${user?.authType} OAuth`}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
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
                  className="flex cursor-pointer items-center justify-center gap-2.5 py-2.5 border border-zinc-200 rounded-xl text-[13px] font-medium text-zinc-700 bg-white hover:bg-zinc-50 transition-colors shadow-sm"
                >
 <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4"/>
                    <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957273V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/>
                    <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957273C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957273 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
                    <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957273 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
                  </svg>                  Connect Gmail
                </button>
                <button
                  onClick={connectOutlook}
                  className="flex cursor-pointer items-center justify-center gap-2.5 py-2.5 border border-zinc-200 rounded-xl text-[13px] font-medium text-zinc-700 bg-white hover:bg-zinc-50 transition-colors shadow-sm"
                >
 <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#f35325" d="M1 1h7.5v7.5H1z"/>
                    <path fill="#81bc06" d="M9.5 1H17v7.5H9.5z"/>
                    <path fill="#05a6f0" d="M1 9.5h7.5V17H1z"/>
                    <path fill="#ffba08" d="M9.5 9.5H17V17H9.5z"/>
                  </svg>
                  Connect Outlook
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Theme Card */}
      <div className="hidden bg-white border border-zinc-200 rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
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