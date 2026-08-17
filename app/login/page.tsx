"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Globe,
  Sun,
  Key,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { usePrive } from "@/lib/prive/store";

export default function LoginPage() {
  const router = useRouter();
  const { dispatch } = usePrive();
  const [email, setEmail] = useState("jordan.ellis@themorningtable.com");
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "login" });
    router.push("/gm/home");
  };

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-[#1C1917] text-white flex flex-col justify-between font-sans antialiased selection:bg-[#881337] selection:text-white">
      <div className="grid grid-cols-1 lg:grid-cols-12 h-full min-h-screen lg:min-h-0">
        {/* ── LEFT HALF: HIGH-IMPACT FULL-BLEED HERO WITH DINING ROOM PHOTO ── */}
        <div className="lg:col-span-7 relative bg-[#1C070D] p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden border-r border-white/10">
          {/* Full-bleed background photo with dark wine gradient overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="/dining-room.jpg"
              alt="Dining Room"
              className="h-full w-full object-cover object-center filter saturate-[1.2] brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1C070D] via-[#1C070D]/90 to-[#1C070D]/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C070D] via-transparent to-[#1C070D]/70" />
          </div>

          {/* Top Logo Header */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-[#881337] to-[#580B22] font-black text-white text-2xl shadow-2xl border border-white/20 ring-1 ring-white/10">
              P
            </div>
            <div>
              <div className="text-base font-extrabold tracking-[0.22em] text-white leading-none">
                PRIVÉ
              </div>
              <div className="text-[10px] font-bold tracking-[0.16em] text-white/60 uppercase leading-tight mt-0.5">
                RESTAURANT OPERATIONS INTELLIGENCE
              </div>
            </div>
          </div>

          {/* Hero Main Content */}
          <div className="relative z-10 my-auto py-8 space-y-8 max-w-xl">
            {/* Badge & Headline */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs backdrop-blur-md shadow-lg">
                <Sun className="size-3.5 text-[#F59E0B]" />
                <span className="font-bold text-white uppercase tracking-widest text-[10px]">
                  THE MORNING TABLE
                </span>
                <span className="text-white/40">•</span>
                <span className="text-[10px] font-extrabold tracking-wider text-[#FB7185] uppercase">
                  BALLANTYNE #02
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-[1.1]">
                One restaurant. <br />
                <span className="text-[#FB7185] italic font-serif">Total intelligence.</span>
              </h1>

              <p className="text-sm sm:text-base font-medium text-white/80 leading-relaxed max-w-lg">
                Privé unifies sales, labor, inventory, and guest feedback into one real-time command center — built specifically for restaurant operators.
              </p>
            </div>

            {/* 3 High-Impact Live Metric Stat Counter Cards */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md p-3.5 shadow-xl">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#FB7185]">
                  DAILY SALES
                </div>
                <div className="text-xl sm:text-2xl font-black text-white mt-1 tabular-nums">
                  $6,840
                </div>
                <div className="text-[10px] font-bold text-[#4ADE80] mt-0.5">
                  ▲ +8.2% vs target
                </div>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md p-3.5 shadow-xl">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#F59E0B]">
                  LABOR COST
                </div>
                <div className="text-xl sm:text-2xl font-black text-white mt-1 tabular-nums">
                  24.8%
                </div>
                <div className="text-[10px] font-bold text-white/70 mt-0.5">
                  Target: 25.0%
                </div>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md p-3.5 shadow-xl">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#4ADE80]">
                  COMPLIANCE
                </div>
                <div className="text-xl sm:text-2xl font-black text-white mt-1 tabular-nums">
                  96 / 100
                </div>
                <div className="text-[10px] font-bold text-[#4ADE80] mt-0.5">
                  Grade A Verified
                </div>
              </div>
            </div>

            {/* Key Value Pill list */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-white/90">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-[#FB7185]" /> Human-Governed AI</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-[#F59E0B]" /> Toast & Paycor Sync</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-[#4ADE80]" /> 24/7 Guest Recovery</span>
            </div>
          </div>

          {/* Clean Partner Footer */}
          <div className="relative z-10 border-t border-white/15 pt-4">
            <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/60 mb-2">
              <span>CONNECTED ECOSYSTEM PARTNERS</span>
              <span className="flex items-center gap-1 text-[#F59E0B]"><Sparkles className="size-3" /> Live API Sync</span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-white/70 font-black uppercase tracking-wider">
              <span className="text-white hover:text-[#FB7185] transition-colors">TOAST POS</span>
              <span className="text-white hover:text-[#FB7185] transition-colors">PAYCOR</span>
              <span className="text-white hover:text-[#FB7185] transition-colors">7SHIFTS</span>
              <span className="text-white hover:text-[#FB7185] transition-colors">RESTAURANT365</span>
              <span className="text-white hover:text-[#FB7185] transition-colors">GOOGLE CLOUD</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT HALF: ELEVATED PARCHMENT SIGN IN FORM ────────────────── */}
        <div className="lg:col-span-5 bg-[#FAFAF8] text-[#1C1917] p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-l border-[#E7E5E0]">
          {/* Top Bar Language Selector */}
          <div className="flex items-center justify-end">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-xl border border-[#E7E5E0] bg-white px-3 py-1.5 text-xs font-bold text-[#1C1917] hover:bg-[#F7F5F2] shadow-2xs transition-colors cursor-pointer"
            >
              <Globe className="size-3.5 text-[#881337]" />
              <span>EN (US)</span>
              <span className="text-[10px] text-[#78716C]">v</span>
            </button>
          </div>

          {/* Form Content Container */}
          <div className="my-auto max-w-md w-full mx-auto space-y-8 py-8">
            <div className="space-y-1">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#881337]">
                WELCOME BACK
              </p>
              <h2 className="text-3xl font-black tracking-tight text-[#1C1917] sm:text-4xl">
                Let&apos;s get to work.
              </h2>
              <p className="text-sm font-medium text-[#78716C]">
                Sign in to your Privé restaurant operations portal.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-xs font-bold text-[#1C1917] mb-1.5">
                  Manager Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#78716C]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@restaurant.com"
                    className="w-full rounded-xl border border-[#E7E5E0] bg-white py-3.5 pl-10 pr-4 text-xs font-semibold text-[#1C1917] outline-none focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 shadow-2xs transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#1C1917]">
                    Password
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => { e.preventDefault(); alert("Password reset link sent to your manager email."); }}
                    className="text-xs font-bold text-[#881337] hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#78716C]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full rounded-xl border border-[#E7E5E0] bg-white py-3.5 pl-10 pr-10 text-xs font-semibold text-[#1C1917] outline-none focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 shadow-2xs transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#78716C] hover:text-[#1C1917]"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#881337] to-[#6B0F2A] py-3.5 text-xs font-bold text-white shadow-md hover:from-[#6B0F2A] hover:to-[#500A1F] active:scale-[0.99] transition-all cursor-pointer"
              >
                <span>Sign in to Dashboard</span>
                <ArrowRight className="size-4" />
              </button>
            </form>

            {/* OR Divider */}
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-[#E7E5E0]" />
              <span className="absolute bg-[#FAFAF8] px-3 text-[10px] font-bold text-[#78716C] uppercase tracking-wider">
                OR
              </span>
            </div>

            {/* SSO Sign In Button */}
            <button
              type="button"
              onClick={() => {
                dispatch({ type: "login" });
                router.push("/gm/home");
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#E7E5E0] bg-white py-3.5 text-xs font-bold text-[#1C1917] hover:bg-[#F7F5F2] shadow-2xs transition-colors cursor-pointer"
            >
              <Key className="size-4 text-[#881337]" />
              <span>Sign in with Enterprise SSO</span>
            </button>
          </div>

          {/* Security & Audit Footer Box */}
          <div className="rounded-2xl border border-[#E7E5E0] bg-white p-4 text-center space-y-1 shadow-2xs">
            <div className="text-xs font-bold text-[#1C1917] flex items-center justify-center gap-1.5">
              <ShieldCheck className="size-4 text-[#15803D]" />
              <span>SOC2 Type II & HIPAA Certified</span>
            </div>
            <p className="text-[11px] font-medium text-[#78716C]">
              Role-based access controls. Immutable audit logs. Enterprise encryption.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
