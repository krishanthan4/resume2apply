"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Layers } from "lucide-react";
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
    <main className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[380px]"
      >
           <Image src={"/resume2apply.png"} alt="background Image" fill loading="lazy" className="object-contain w-full h-screen -z-10" />

        {/* Card */}
        <div className="bg-white/80 border border-zinc-200 rounded-[16px] px-7 py-8 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] backdrop-blur-sm">
          <h1 className="text-[22px] font-extrabold text-zinc-900 tracking-[-0.025em] mb-1.5">
            Create your account
          </h1>

          {error && (
            <div className="mb-4 py-2.5 px-3.5 bg-red-50 border border-red-200 rounded-lg text-[13px] text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-[13px] font-medium text-gray-700">
                Full name
              </Label>
              <Input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="input-field"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-[13px] font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-[13px] font-medium text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a strong password"
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !name || !email || !password}
              className="mt-1 w-full py-[11px] bg-zinc-900 text-white rounded-[9px] text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:bg-zinc-300 disabled:cursor-not-allowed hover:bg-zinc-800"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {isLoading ? "Creating account…" : "Create account"}
            </button>
              <p className="text-center mt-5 text-[13px] text-zinc-500">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-zinc-900 font-semibold no-underline hover:underline"
          >
            Sign in
          </Link>
        </p>
          </form>
        </div>

      </motion.div>
    </main>
  );
}
