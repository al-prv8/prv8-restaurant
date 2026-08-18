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
  Key,
  Sliders,
  BrainCircuit,
  TrendingUp,
  UserCheck,
  UtensilsCrossed,
  CreditCard,
  Calendar,
  Building2,
  KeyRound,
  History,
} from "lucide-react";
import { usePrive } from "@/lib/prive/store";
import { DemoConfigModal } from "@/components/prive/DemoConfigModal";

export default function LoginPage() {
  const router = useRouter();
  const { state, dispatch } = usePrive();
  const cfg = state.demoConfig;

  const [email, setEmail] = useState(cfg.email);
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);

  // Sync email input if config changes
  React.useEffect(() => {
    setEmail(cfg.email);
  }, [cfg.email]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "login" });
    router.push("/gm/home");
  };

  return (
    <div className="min-h-screen bg-[#1C1917] text-white flex flex-col justify-between font-sans antialiased selection:bg-[#881337] selection:text-white">
      {/* ── TOP DEMO CONFIG BAR (Compact 1-line bar on mobile & desktop) ────── */}
      <div className="bg-[#1C070D] border-b border-white/10 px-3 sm:px-4 py-1.5 flex items-center justify-between text-[11px] sm:text-xs z-30 shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <span className="flex size-2 rounded-full bg-[#4ADE80] animate-pulse shrink-0" />
          <span className="font-extrabold uppercase tracking-wider text-[#FB7185] text-[9px] sm:text-[10px] shrink-0">
            DEMO MODE
          </span>
          <span className="text-white/30 shrink-0">•</span>
          <span className="text-white/80 font-medium truncate">
            Prospect: <strong className="text-white">{cfg.firstName}</strong> ({cfg.companyName})
          </span>
        </div>

        <button
          type="button"
          onClick={() => setConfigModalOpen(true)}
          className="flex items-center gap-1 rounded-lg border border-white/20 bg-white/10 px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold text-white hover:bg-white/20 transition-all cursor-pointer shrink-0 ml-2"
        >
          <Sliders className="size-3 text-[#F59E0B]" />
          <span className="hidden sm:inline">Configure Demo Prospect</span>
          <span className="sm:hidden">Config</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 flex-1">
        {/* ── LEFT HALF: SHORTENED COMPACT HERO (Especially on mobile) ────── */}
        <div className="lg:col-span-7 relative bg-[#1C070D] px-4 pt-4 pb-12 sm:p-8 lg:p-12 flex flex-col justify-between overflow-hidden">
          {/* Full-bleed brightened restaurant photo */}
          <div className="absolute inset-0 z-0">
            <img
              src="/dining-room.jpg"
              alt="Restaurant Dining Room"
              className="h-full w-full object-cover object-center filter brightness-110 contrast-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1C070D] via-[#1C070D]/90 to-[#1C070D]/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C070D] via-transparent to-[#1C070D]/85" />
          </div>

          {/* Top Logo Header */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="grid size-7 sm:size-10 place-items-center rounded-lg sm:rounded-xl bg-gradient-to-br from-[#881337] to-[#580B22] font-black text-white text-sm sm:text-xl shadow-xl border border-white/20">
                P
              </div>
              <div>
                <div className="text-xs sm:text-base font-extrabold tracking-[0.22em] text-white leading-none">
                  PRIVÉ
                </div>
                <div className="text-[8px] sm:text-[10px] font-bold tracking-[0.14em] text-white/60 uppercase leading-tight mt-0.5 hidden sm:block">
                  RESTAURANT OPERATIONS INTELLIGENCE
                </div>
              </div>
            </div>
          </div>

          {/* Hero Main Copy — Ultra Compact on Mobile */}
          <div className="relative z-10 my-3 sm:my-auto py-1 sm:py-4 space-y-3 sm:space-y-5 max-w-xl">
            {/* Prominent Company Name + Location — replaces old small pill */}
            <div className="space-y-0.5">
              <div className="text-sm sm:text-base font-black uppercase tracking-[0.12em] text-white leading-tight">
                {cfg.companyName}
              </div>
              <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                {cfg.location}
              </div>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-white leading-[1.15]">
              One restaurant.{" "}
              <span className="text-[#FB7185] italic font-serif block sm:inline">Every operation connected.</span>
            </h1>

            {/* Short Supporting Copy — Hidden on micro mobile screens to save space */}
            <p className="text-[11px] sm:text-sm font-medium text-white/80 leading-relaxed max-w-lg hidden xs:block">
              Privé unifies sales, labor, inventory, and guest sentiment into one real-time command center.
            </p>

            {/* 3 Capabilities — Icon Row Format matching approved mockup */}
            <div className="space-y-2.5 sm:space-y-3 pt-1">
              {/* Capability 1: Operational Intelligence */}
              <div className="flex items-center gap-3">
                <div className="grid size-7 sm:size-8 shrink-0 place-items-center rounded-full bg-[#881337] shadow-lg border border-white/10">
                  <BrainCircuit className="size-3.5 sm:size-4 text-white" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white leading-tight">
                    Operational Intelligence
                  </div>
                  <div className="text-[10px] font-medium text-white/60 leading-snug mt-0.5 hidden sm:block">
                    Real-time visibility into sales, labor, inventory, and guest sentiment.
                  </div>
                </div>
              </div>

              {/* Capability 2: Human-Governed AI */}
              <div className="flex items-center gap-3">
                <div className="grid size-7 sm:size-8 shrink-0 place-items-center rounded-full bg-[#B45309] shadow-lg border border-white/10">
                  <ShieldCheck className="size-3.5 sm:size-4 text-white" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white leading-tight">
                    Human-Governed AI
                  </div>
                  <div className="text-[10px] font-medium text-white/60 leading-snug mt-0.5 hidden sm:block">
                    Every important action is scheduled, reviewed, approved, and logged.
                  </div>
                </div>
              </div>

              {/* Capability 3: Predictive Operations */}
              <div className="flex items-center gap-3">
                <div className="grid size-7 sm:size-8 shrink-0 place-items-center rounded-full bg-[#15803D] shadow-lg border border-white/10">
                  <TrendingUp className="size-3.5 sm:size-4 text-white" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white leading-tight">
                    Predictive Operations
                  </div>
                  <div className="text-[10px] font-medium text-white/60 leading-snug mt-0.5 hidden sm:block">
                    AI-generated forecasts for labor, sales, and inventory, human approved.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ecosystem Connections Section with Dedicated System Icons */}
          <div className="relative z-10 border-t border-white/15 pt-2 sm:pt-3 space-y-1 sm:space-y-2">
            <div className="text-[8px] sm:text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/60 text-center sm:text-left">
              CAPABLE OF CONNECTING TO YOUR ECOSYSTEM
            </div>
            <div className="flex flex-wrap items-center justify-center sm:justify-between gap-3 sm:gap-4 text-[10px] sm:text-xs font-black uppercase tracking-wider text-white">
              <span className="flex items-center gap-1.5 hover:text-[#FB7185] transition-colors">
                <UtensilsCrossed className="size-3.5 text-[#FB7185]" /> Toast
              </span>
              <span className="text-white/40 hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5 hover:text-[#FB7185] transition-colors">
                <CreditCard className="size-3.5 text-[#38BDF8]" /> Paycor
              </span>
              <span className="text-white/40 hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5 hover:text-[#FB7185] transition-colors">
                <Calendar className="size-3.5 text-[#F59E0B]" /> 7shifts
              </span>
              <span className="text-white/40 hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5 hover:text-[#FB7185] transition-colors">
                <Building2 className="size-3.5 text-[#4ADE80]" /> Restaurant365
              </span>
            </div>
          </div>
        </div>

        {/* ── RIGHT HALF: OVERLAPPING CONTINUOUS SIGN IN CARD ─────────────── */}
        <div className="lg:col-span-5 relative z-20 -mt-10 lg:mt-0 rounded-t-3xl lg:rounded-none bg-[#FAFAF8] text-[#1C1917] px-4 py-5 sm:p-10 lg:p-12 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#E7E5E0] shadow-2xl">
          {/* Top Bar Language Selector */}
          <div className="flex items-center justify-end">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-xl border border-[#E7E5E0] bg-white px-2.5 py-1 text-xs font-bold text-[#1C1917] hover:bg-[#F7F5F2] shadow-2xs transition-colors cursor-pointer"
            >
              <Globe className="size-3 text-[#881337]" />
              <span>EN (US)</span>
              <span className="text-[9px] text-[#78716C]">v</span>
            </button>
          </div>

          {/* Form Content Container */}
          <div className="my-auto max-w-md w-full mx-auto space-y-4 sm:space-y-6 py-1 sm:py-4">
            <div className="space-y-0.5 sm:space-y-1">
              <p className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#881337]">
                WELCOME BACK
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#1C1917]">
                Let&apos;s get to work.
              </h2>
              <p className="text-[11px] sm:text-xs font-medium text-[#78716C]">
                Sign in to your Privé operations portal for {cfg.companyName}.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {/* Work Email Field */}
              <div>
                <label className="block text-xs font-bold text-[#1C1917] mb-1">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#78716C]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@restaurant.com"
                    className="w-full rounded-xl border border-[#E7E5E0] bg-white py-2.5 sm:py-3 pl-10 pr-4 text-xs font-semibold text-[#1C1917] outline-none focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 shadow-2xs transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#1C1917]">
                    Password
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => { e.preventDefault(); alert("Password reset link sent to your work email."); }}
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
                    className="w-full rounded-xl border border-[#E7E5E0] bg-white py-2.5 sm:py-3 pl-10 pr-10 text-xs font-semibold text-[#1C1917] outline-none focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 shadow-2xs transition-all"
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

              {/* Main Submit Button: Enter Privé → */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#881337] to-[#6B0F2A] py-3 sm:py-3.5 text-xs font-bold text-white shadow-md hover:from-[#6B0F2A] hover:to-[#500A1F] active:scale-[0.99] transition-all cursor-pointer"
              >
                <span>Enter Privé</span>
                <ArrowRight className="size-4" />
              </button>
            </form>

            {/* OR Divider */}
            <div className="relative flex items-center justify-center py-1">
              <div className="w-full border-t border-[#E7E5E0]" />
              <span className="absolute bg-[#FAFAF8] px-3 text-[9px] sm:text-[10px] font-bold text-[#78716C] uppercase tracking-wider">
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
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#E7E5E0] bg-white py-2.5 sm:py-3 text-xs font-bold text-[#1C1917] hover:bg-[#F7F5F2] shadow-2xs transition-colors cursor-pointer"
            >
              <Key className="size-4 text-[#881337]" />
              <span>Sign in with Enterprise SSO</span>
            </button>
          </div>

          {/* Security & Governance Section with Dedicated Security Icons */}
          <div className="rounded-xl border border-[#E7E5E0] bg-white p-3 sm:p-4 text-center space-y-2 shadow-2xs mt-3 sm:mt-4 lg:mt-0">
            <div className="text-xs font-black text-[#1C1917] flex items-center justify-center gap-1.5 uppercase tracking-wider">
              <ShieldCheck className="size-4 text-[#15803D]" />
              <span>Security &amp; Governance</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] sm:text-[11px] font-bold text-[#44403C]">
              <span className="flex items-center gap-1 bg-[#F5F4F0] px-2 py-1 rounded-md border border-[#E7E5E0]">
                <KeyRound className="size-3 text-[#881337]" /> Role-based access
              </span>
              <span className="flex items-center gap-1 bg-[#F5F4F0] px-2 py-1 rounded-md border border-[#E7E5E0]">
                <UserCheck className="size-3 text-[#15803D]" /> Human approval controls
              </span>
              <span className="flex items-center gap-1 bg-[#F5F4F0] px-2 py-1 rounded-md border border-[#E7E5E0]">
                <History className="size-3 text-[#B45309]" /> Traceable audit history
              </span>
            </div>
          </div>
        </div>
      </div>

      <DemoConfigModal
        open={configModalOpen}
        onClose={() => setConfigModalOpen(false)}
      />
    </div>
  );
}
