"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button, Input, Label } from "@/app/components/ui";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Registration failed");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await fetch("/api/auth/google/url");
      const { url } = await res.json();
      window.location.href = url;
    } catch (err: any) {
      setError("Failed to initialize Google login");
    }
  };

  const handleOutlookLogin = async () => {
    try {
      const res = await fetch("/api/auth/outlook/url");
      const { url } = await res.json();
      window.location.href = url;
    } catch (err: any) {
      setError("Failed to initialize Outlook login");
    }
  };

  return (
    <main className="min-h-screen bg-white selection:bg-blue-200/50 font-sans grid grid-cols-1 md:grid-cols-2 text-slate-900">
      {/* Left side: Form */}
      <div className="w-full flex items-center justify-center p-8 lg:p-12 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[400px]"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Create your account
            </h1>
            <p className="text-slate-500 font-medium">
              Start applying for jobs in seconds
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-sm font-medium text-red-600 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="flex flex-col gap-5">
            <div className="flex flex-col">
              <Label className="text-sm font-bold text-slate-800">
                Full name
              </Label>
              <Input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="p-4 border-slate-200 focus:border-slate-900 focus:ring-slate-900 rounded-xl text-base shadow-sm"
              />
            </div>

            <div className="flex flex-col">
              <Label className="text-sm font-bold text-slate-800">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="p-4 border-slate-200 focus:border-slate-900 focus:ring-slate-900 rounded-xl text-base shadow-sm"
              />
            </div>

            <div className="flex flex-col">
              <Label className="text-sm font-bold text-slate-800">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a strong password"
                className="p-4 border-slate-200 focus:border-slate-900 focus:ring-slate-900 rounded-xl text-base shadow-sm"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !name || !email || !password}
                          className="my-3"

            >
              {isLoading && <Loader2 size={18} className="animate-spin" />}
              {isLoading ? "Creating account…" : "Create account"}
            </Button>

            <div className="mt-1">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-500 font-semibold">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="flex items-center justify-center gap-2.5 py-2.5 border border-slate-200 rounded-xl text-[13px] font-bold text-slate-700 bg-white hover:bg-slate-50 transition-all shadow-sm cursor-pointer"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4"/>
                    <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957273V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/>
                    <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957273C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957273 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
                    <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957273 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  onClick={handleOutlookLogin}
                  className="flex items-center justify-center gap-2.5 py-2.5 border border-slate-200 rounded-xl text-[13px] font-bold text-slate-700 bg-white hover:bg-slate-50 transition-all shadow-sm cursor-pointer"
                >
                    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#f35325" d="M1 1h7.5v7.5H1z"/>
                    <path fill="#81bc06" d="M9.5 1H17v7.5H9.5z"/>
                    <path fill="#05a6f0" d="M1 9.5h7.5V17H1z"/>
                    <path fill="#ffba08" d="M9.5 9.5H17V17H9.5z"/>
                  </svg>
                  Outlook
                </button>
              </div>
            </div>

            <p className="text-[12px] text-center text-slate-400 font-medium px-4 leading-relaxed">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="text-slate-600 hover:text-slate-900 transition-colors underline underline-offset-2">Terms of Service</Link>
              {" "}and{" "}
              <Link href="/privacy" className="text-slate-600 hover:text-slate-900 transition-colors underline underline-offset-2">Privacy Policy</Link>.
            </p>
            
            <p className="text-center mt-2 text-sm text-slate-500 font-medium">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-slate-900 font-bold hover:underline underline-offset-4 decoration-2"
              >
                Sign in
              </Link>
            </p>
          </form>
        </motion.div>
      </div>

      {/* Right side: Graphic */}
      <div className="hidden md:flex bg-slate-50 border-l border-slate-100 items-center justify-center relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 bg-gradient-to-bl from-slate-100/50 to-slate-200/50" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative z-10 max-w-lg p-10"
        >
        
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
              Apply for Jobs In Seconds, <br/>
              <span className="bg-black text-white px-2 py-0.5 inline-block -rotate-1 mt-1">Not in Hours</span>
            </h2>
            <p className="text-lg text-slate-600 font-medium">
              Customize CV, Schedule Emails, Manage Applying/Applied Jobs
            </p>
          </div>
        </motion.div>
      </div>
    </main>);}
