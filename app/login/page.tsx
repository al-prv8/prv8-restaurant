"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  Package,
  MessageSquareHeart,
  FileText,
  TrendingUp,
  Globe,
  Quote,
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
    <div className="min-h-screen bg-[#F7F5F2] text-[#1C1917] flex flex-col justify-between font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        {/* ── LEFT HALF: BRAND & HERO INTEL (IMAGE 1 LEFT MOCKUP) ────────── */}
        <div className="lg:col-span-7 relative bg-[#1C1917] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden">
          {/* Background Dining Room Image with Warm Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="/dining-room.jpg"
              alt="The Morning Table Dining Room"
              className="h-full w-full object-cover object-center opacity-25 filter blur-xs"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917] via-[#1C1917]/80 to-transparent" />
          </div>

          {/* Top Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-[#881337] font-black text-white text-xl shadow-lg border border-white/20">
              P
            </div>
            <div>
              <div className="text-base font-extrabold tracking-[0.2em] text-white leading-none">
                PRIVÉ
              </div>
              <div className="text-[10px] font-bold tracking-[0.14em] text-white/60 uppercase leading-tight mt-0.5">
                RESTAURANT OPERATIONS INTELLIGENCE
              </div>
            </div>
          </div>

          {/* Hero Copy */}
          <div className="relative z-10 my-12 space-y-6 max-w-2xl">
            <div className="inline-block border-b-2 border-[#881337] pb-2">
              <span className="text-xs font-black uppercase tracking-[0.25em] text-white/70">
                THE MORNING TABLE
              </span>
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#881337] mt-0.5">
                KITCHEN. COMMUNITY. EXCELLENCE.
              </div>
            </div>

            <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight leading-tight text-white">
              One restaurant. <br />
              <span className="text-[#F43F5E] italic">Total intelligence.</span>
            </h1>

            <p className="text-sm sm:text-base font-medium text-white/80 leading-relaxed max-w-xl">
              Privé connects your people, systems, and data into one intelligent command center — so you can focus on what matters most: great food and exceptional guest experiences.
            </p>

            {/* 3 Core Value Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-xs space-y-1">
                <div className="grid size-8 place-items-center rounded-lg bg-[#881337] text-white mb-2">
                  <TrendingUp className="size-4" />
                </div>
                <div className="text-xs font-bold text-white">Operational Intelligence</div>
                <p className="text-[11px] text-white/70 leading-normal">
                  Real-time visibility into sales, labor, inventory, and guest sentiment.
                </p>
              </div>

              <div className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-xs space-y-1">
                <div className="grid size-8 place-items-center rounded-lg bg-[#B45309] text-white mb-2">
                  <ShieldCheck className="size-4" />
                </div>
                <div className="text-xs font-bold text-white">Human-Governed Actions</div>
                <p className="text-[11px] text-white/70 leading-normal">
                  Every important action is reviewed, approved, and logged by managers.
                </p>
              </div>

              <div className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-xs space-y-1">
                <div className="grid size-8 place-items-center rounded-lg bg-[#15803D] text-white mb-2">
                  <Building2 className="size-4" />
                </div>
                <div className="text-xs font-bold text-white">Connected Systems</div>
                <p className="text-[11px] text-white/70 leading-normal">
                  POS, payroll, scheduling, inventory — unified in one platform.
                </p>
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="rounded-xl border-l-4 border-l-[#881337] bg-white/5 p-4 text-xs italic text-white/80 flex items-start gap-3">
              <Quote className="size-5 shrink-0 text-[#881337] not-italic" />
              <div>
                &ldquo;Privé gives me back hours every day. Now I&apos;m on the floor with my team, not buried in paperwork.&rdquo;
                <div className="mt-1 font-bold not-italic text-white text-[11px]">— Restaurant General Manager</div>
              </div>
            </div>
          </div>

          {/* Bottom Connected Tech Bar */}
          <div className="relative z-10 border-t border-white/15 pt-6 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 text-center sm:text-left">
              DESIGNED FOR RESTAURANTS. BUILT FOR OPERATORS.
            </p>
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-white/60 font-bold">
              <span className="flex items-center gap-1.5"><Building2 className="size-3.5 text-[#881337]" /> Toast POS</span>
              <span className="flex items-center gap-1.5"><Users className="size-3.5 text-[#B45309]" /> Paycor Payroll</span>
              <span className="flex items-center gap-1.5"><Package className="size-3.5 text-[#15803D]" /> 7shifts Roster</span>
              <span className="flex items-center gap-1.5"><FileText className="size-3.5 text-[#0284C7]" /> Restaurant365</span>
              <span className="flex items-center gap-1.5"><Globe className="size-3.5 text-[#881337]" /> Google Cloud</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT HALF: SIGN IN FORM (IMAGE 1 RIGHT FORM) ──────────────── */}
        <div className="lg:col-span-5 bg-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
          {/* Top Bar Language Selector */}
          <div className="flex items-center justify-end">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg border border-[#E7E5E0] bg-[#FAFAF8] px-3 py-1.5 text-xs font-bold text-[#1C1917] hover:bg-[#E7E5E0] transition-colors"
            >
              <Globe className="size-3.5" />
              <span>EN</span>
              <span className="text-[10px] text-[#78716C]">v</span>
            </button>
          </div>

          {/* Form Content */}
          <div className="my-auto max-w-md w-full mx-auto space-y-8 py-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#881337] mb-1">
                WELCOME BACK
              </p>
              <h2 className="text-3xl font-black tracking-tight text-[#1C1917] sm:text-4xl">
                Let&apos;s get to work.
              </h2>
              <p className="mt-1 text-sm font-medium text-[#78716C]">
                Sign in to your Privé operations portal.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-xs font-bold text-[#1C1917] mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#78716C]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@restaurant.com"
                    className="w-full rounded-xl border border-[#E7E5E0] bg-[#FAFAF8] py-3 pl-10 pr-4 text-xs font-semibold text-[#1C1917] outline-none focus:border-[#881337] focus:ring-1 focus:ring-[#881337] transition-all"
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
                    onClick={(e) => { e.preventDefault(); alert("Password reset link sent to your email."); }}
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
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-[#E7E5E0] bg-[#FAFAF8] py-3 pl-10 pr-10 text-xs font-semibold text-[#1C1917] outline-none focus:border-[#881337] focus:ring-1 focus:ring-[#881337] transition-all"
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
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#881337] py-3.5 text-xs font-bold text-white shadow-md hover:bg-[#6B0F2A] active:scale-[0.99] transition-all cursor-pointer"
              >
                <span>Sign in</span>
                <ArrowRight className="size-4" />
              </button>
            </form>

            {/* OR Divider */}
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-[#E7E5E0]" />
              <span className="absolute bg-white px-3 text-[10px] font-bold text-[#78716C] uppercase">
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
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#E7E5E0] bg-[#FAFAF8] py-3 text-xs font-bold text-[#1C1917] hover:bg-[#E7E5E0] transition-colors cursor-pointer"
            >
              <ShieldCheck className="size-4 text-[#881337]" />
              <span>Sign in with SSO</span>
            </button>
          </div>

          {/* Security Footer Box */}
          <div className="rounded-xl border border-[#E7E5E0] bg-[#FAFAF8] p-4 text-center space-y-1">
            <div className="text-xs font-bold text-[#1C1917] flex items-center justify-center gap-1.5">
              <ShieldCheck className="size-4 text-[#15803D]" />
              <span>Secure. Private. Compliant.</span>
            </div>
            <p className="text-[11px] font-medium text-[#78716C]">
              Role-based access. Immutable audit trail. Enterprise-grade security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
