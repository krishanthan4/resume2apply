"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { Input, Label } from "@/app/components/ui";

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

  return (
    <main className="min-h-screen bg-white selection:bg-blue-200/50 font-sans flex text-slate-900">
      {/* Left side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative">
        <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
        
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
            <div className="flex flex-col gap-2">
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
                className="h-12 border-slate-200 focus:border-slate-900 focus:ring-slate-900 rounded-xl text-base shadow-sm"
              />
            </div>

            <div className="flex flex-col gap-2">
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
                className="h-12 border-slate-200 focus:border-slate-900 focus:ring-slate-900 rounded-xl text-base shadow-sm"
              />
            </div>

            <div className="flex flex-col gap-2">
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
                className="h-12 border-slate-200 focus:border-slate-900 focus:ring-slate-900 rounded-xl text-base shadow-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !name || !email || !password}
              className="mt-2 w-full h-12 bg-slate-900 text-white rounded-xl text-base font-bold flex items-center justify-center gap-2 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-slate-800 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              {isLoading && <Loader2 size={18} className="animate-spin" />}
              {isLoading ? "Creating account…" : "Create account"}
            </button>
            
            <p className="text-center mt-6 text-sm text-slate-500 font-medium">
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
      <div className="hidden lg:flex w-1/2 bg-slate-50 border-l border-slate-100 items-center justify-center relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 bg-gradient-to-bl from-slate-100/50 to-slate-200/50" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative z-10 max-w-lg p-10"
        >
          <div className="relative w-[360px] h-[360px] mx-auto mb-10">
            <Image 
              src="/backgroundimage.png" 
              alt="App Graphic" 
              fill 
              sizes="360px"
              priority
              className="object-contain drop-shadow-2xl mix-blend-multiply"
            />
          </div>
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
