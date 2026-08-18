"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  Users,
  Package,
  MessageSquare,
  ChevronRight,
  Bell,
  Sparkles,
  ArrowUpRight,
  ChevronDown,
  Star,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Tag,
  Percent,
  Calendar,
  Award,
  DollarSign,
  UserCheck,
  Send,
  Zap,
  Volume2,
} from "lucide-react";
import { usePrive } from "@/lib/prive/store";
import type { Complaint } from "@/lib/prive/data";

function getSmoothCurvePath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;

  let path = `M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }

  return path;
}

export default function GmHomePage() {
  const router = useRouter();
  const { derived: d, state, dispatch } = usePrive();
  const cfg = state.demoConfig;
  const [salesTimeframe, setSalesTimeframe] = useState("Today");
  const [laborTimeframe, setLaborTimeframe] = useState("Today");
  const [salesHoverIdx, setSalesHoverIdx] = useState<number | null>(4); // Default 6 PM peak

  // Time of day greeting
  const [greetingPrefix, setGreetingPrefix] = useState("Good afternoon");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreetingPrefix("Good morning");
    } else if (hour >= 12 && hour < 17) {
      setGreetingPrefix("Good afternoon");
    } else {
      setGreetingPrefix("Good evening");
    }
  }, []);

  const greetingText = `${greetingPrefix}, ${cfg.firstName}.`;

  const speakGreeting = React.useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(greetingText);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice =
        voices.find(
          (v) =>
            v.lang.startsWith("en") &&
            (v.name.includes("Natural") ||
              v.name.includes("Google") ||
              v.name.includes("Samantha") ||
              v.name.includes("Daniel"))
        ) || voices.find((v) => v.lang.startsWith("en"));
      if (preferredVoice) utterance.voice = preferredVoice;
      window.speechSynthesis.speak(utterance);
    }
  }, [greetingText]);

  useEffect(() => {
    const timer = setTimeout(() => {
      speakGreeting();
    }, 500);
    return () => clearTimeout(timer);
  }, [speakGreeting]);

  const openComplaintsCount = d.gmComplaints.filter(
    (c: Complaint) => c.status === "Awaiting Approval"
  ).length;

  const salesData = [
    { time: "10 AM", sales: 320, forecast: 300 },
    { time: "12 PM", sales: 890, forecast: 820 },
    { time: "2 PM",  sales: 420, forecast: 450 },
    { time: "4 PM",  sales: 520, forecast: 500 },
    { time: "6 PM",  sales: 980, forecast: 900 },
    { time: "8 PM",  sales: 640, forecast: 620 },
    { time: "10 PM", sales: 380, forecast: 350 },
  ];

  const activeSalesPoint = salesHoverIdx !== null ? salesData[salesHoverIdx] : salesData[4];

  const topPerformers = [
    { rank: "1", name: "Taylor Morgan", role: "Server", sales: "$1,284", addOn: "38%", rating: "4.9", avatarBg: "bg-[#881337] text-white", status: "Top Upseller" },
    { rank: "2", name: "Chris Bennett", role: "Cashier", sales: "$1,102", addOn: "34%", rating: "4.8", avatarBg: "bg-[#1C1917] text-white", status: "Speed Lead" },
    { rank: "3", name: "Avery Johnson", role: "Server", sales: "$957", addOn: "33%", rating: "4.7", avatarBg: "bg-[#B45309] text-white", status: "High Guest Rating" },
    { rank: "4", name: "Marcus Vance", role: "Line Cook", sales: "$890", addOn: "30%", rating: "4.9", avatarBg: "bg-[#15803D] text-white", status: "Zero Recooks" },
  ];

  const schedule7Days = [
    { day: "SAT", date: "17", count: "17 / 19", gap: "2 Open", roles: "Server, Busser", peak: "4 PM–8 PM", tone: "red", pct: 89 },
    { day: "SUN", date: "18", count: "18 / 19", gap: "1 Open", roles: "Line Cook", peak: "11 AM–3 PM", tone: "amber", pct: 95 },
    { day: "MON", date: "19", count: "19 / 19", gap: "Fully Staffed", roles: "Optimal", peak: "12 PM–2 PM", tone: "green", pct: 100 },
    { day: "TUE", date: "20", count: "16 / 19", gap: "3 Open", roles: "2 Servers, Host", peak: "5 PM–9 PM", tone: "red", pct: 84 },
    { day: "WED", date: "21", count: "18 / 19", gap: "1 Open", roles: "Dishwasher", peak: "12 PM–4 PM", tone: "amber", pct: 95 },
    { day: "THU", date: "22", count: "19 / 19", gap: "Fully Staffed", roles: "Optimal", peak: "5 PM–8 PM", tone: "green", pct: 100 },
    { day: "FRI", date: "23", count: "18 / 19", gap: "1 Open", roles: "Server", peak: "6 PM–10 PM", tone: "amber", pct: 95 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* ── 1. GREETING & PAGE HEADER ────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#78716C] mb-1">
            SATURDAY, AUGUST 17 · {cfg.location.toUpperCase()}
          </p>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tight text-[#1C1917]">
              {greetingText}
            </h1>
            <button
              type="button"
              onClick={speakGreeting}
              className="rounded-full border border-[#881337]/20 bg-[#881337]/5 p-2 text-[#881337] hover:bg-[#881337]/15 transition-all shadow-2xs cursor-pointer"
              title="Replay Audible Voice Greeting"
            >
              <Volume2 className="size-5 animate-pulse" />
            </button>
          </div>
          <p className="mt-1 text-sm font-medium text-[#78716C]">
            Here&apos;s what&apos;s happening at {cfg.companyName} today.
          </p>
        </div>
      </div>

      {/* ── 2. HERO RESTAURANT STATUS BANNER (SINGLE UNIFIED HERO CARD) ─── */}
      <div className="relative h-[200px] sm:h-[220px] w-full overflow-hidden rounded-2xl border border-[#E7E5E0] shadow-sm group">
        {/* Full Background Photo */}
        <img
          src="/dining-room.jpg"
          alt="Ballantyne Dining Room"
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />

        {/* Dark Gradient Overlay for Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C1917]/95 via-[#1C1917]/65 to-transparent" />

        {/* Unified Card Content */}
        <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-7 text-white max-w-xl">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-1">
              {cfg.companyName.toUpperCase()} · {cfg.location.toUpperCase()}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <span>Dining Room Open</span>
              <span className="relative flex size-3">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#4ADE80] opacity-75 animate-ping" />
                <span className="relative inline-flex size-3 rounded-full bg-[#15803D]" />
              </span>
            </h2>
            <p className="mt-1 text-xs sm:text-sm font-medium text-white/70">
              Saturday Service · Peak Velocity
            </p>
          </div>

          <div>
            <Link
              href="/gm/facility"
              className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 backdrop-blur-xs px-4 py-2 text-xs font-bold text-white transition-all hover:bg-white/20 active:scale-95 shadow-sm"
            >
              <span>View Restaurant Status</span>
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── 3. 5 KPI METRIC CARDS ROW ───────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Sales Today */}
        <Link
          href="/gm/sales"
          className="rounded-xl border border-[#E7E5E0] bg-white p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between min-h-[135px] group cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716C] group-hover:text-[#881337] transition-colors">
                SALES (TODAY)
              </span>
              <div className="grid size-7 place-items-center rounded-full bg-[#881337]/8 text-[#881337] group-hover:bg-[#881337] group-hover:text-white transition-all">
                <Tag className="size-3.5" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-extrabold tabular-nums text-[#1C1917]">
              $31,842
            </div>
            <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-[#15803D]">
              <TrendingUp className="size-3" />
              <span>+ 8.2% vs forecast</span>
            </div>
          </div>
          <div className="mt-3 h-5 w-full">
            <svg className="h-full w-full overflow-visible" viewBox="0 0 100 20">
              <path
                d="M 0 16 Q 20 18, 40 8 T 80 12 T 100 4"
                fill="none"
                stroke="#881337"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </Link>

        {/* Card 2: Labor % */}
        <Link
          href="/gm/staffing"
          className="rounded-xl border border-[#E7E5E0] bg-white p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between min-h-[135px] group cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716C] group-hover:text-[#B45309] transition-colors">
                LABOR %
              </span>
              <div className="grid size-7 place-items-center rounded-full bg-[#B45309]/10 text-[#B45309]">
                <Percent className="size-3.5" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-extrabold tabular-nums text-[#1C1917]">
              24.8%
            </div>
            <div className="mt-1 text-[11px] font-semibold text-[#78716C]">
              Target 23.0%
            </div>
          </div>
          <div className="mt-3 h-5 w-full">
            <svg className="h-full w-full overflow-visible" viewBox="0 0 100 20">
              <path
                d="M 0 12 Q 25 4, 50 15 T 100 8"
                fill="none"
                stroke="#B45309"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </Link>

        {/* Card 3: Staffing */}
        <Link
          href="/gm/staffing"
          className="rounded-xl border border-[#E7E5E0] bg-white p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between min-h-[135px] group cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716C]">
                STAFFING
              </span>
              <div className="grid size-7 place-items-center rounded-full bg-[#1C1917]/8 text-[#1C1917]">
                <Users className="size-3.5" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-extrabold tabular-nums text-[#1C1917]">
              17 / 19
            </div>
            <div className="mt-1 text-[11px] font-bold text-[#B45309]">
              2 open shifts
            </div>
          </div>
          <div className="mt-3 flex items-end justify-between gap-1 h-5 w-full">
            {[60, 80, 100, 90, 70, 85, 95].map((h, i) => (
              <div
                key={i}
                className="w-full bg-[#1C1917]/20 rounded-xs transition-all group-hover:bg-[#881337]"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </Link>

        {/* Card 4: Guest Issues */}
        <Link
          href="/gm/guests"
          className="rounded-xl border border-[#E7E5E0] bg-white p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between min-h-[135px] group cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716C]">
                GUEST ISSUES
              </span>
              <div className="grid size-7 place-items-center rounded-full bg-[#B91C1C]/10 text-[#B91C1C]">
                <MessageSquare className="size-3.5" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-extrabold tabular-nums text-[#1C1917]">
              {openComplaintsCount || 4}
            </div>
            <div className="mt-1 text-[11px] font-bold text-[#B91C1C]">
              Awaiting attention
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[10px] font-semibold text-[#78716C]">
            <span>Avg Response: 47m</span>
          </div>
        </Link>

        {/* Card 5: Inventory Risk */}
        <Link
          href="/gm/inventory"
          className="rounded-xl border border-[#E7E5E0] bg-white p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between min-h-[135px] group cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716C]">
                INVENTORY RISK
              </span>
              <div className="grid size-7 place-items-center rounded-full bg-[#B45309]/10 text-[#B45309]">
                <Package className="size-3.5" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-extrabold tabular-nums text-[#1C1917]">
              2
            </div>
            <div className="mt-1 text-[11px] font-bold text-[#B45309]">
              Items below par
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[10px] font-semibold text-[#78716C]">
            <span>Potatoes, Peanut Oil</span>
          </div>
        </Link>
      </div>

      {/* ── 4. PRIORITY ALERTS & INSIGHTS + NEEDS YOUR ATTENTION ────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Priority Alerts & Priority Insight Banners */}
        <div className="lg:col-span-7 space-y-3.5">
          {/* Banner 1: Priority Alerts */}
          <div className="rounded-xl border border-[#E7E5E0] bg-white p-4 shadow-xs flex items-start justify-between gap-4 transition-all hover:shadow-sm">
            <div className="flex items-start gap-3.5">
              <div className="grid size-9 shrink-0 place-items-center rounded-full bg-[#B91C1C]/10 text-[#B91C1C] mt-0.5">
                <Bell className="size-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#B91C1C]">
                  PRIORITY ALERTS
                </p>
                <h3 className="text-base font-bold text-[#1C1917] mt-0.5">
                  4 items need your attention
                </h3>
                <p className="text-xs font-medium text-[#78716C] mt-0.5">
                  High and medium priority items requiring action.
                </p>
              </div>
            </div>

            <Link
              href="/gm/approvals"
              className="shrink-0 text-xs font-bold text-[#881337] hover:underline flex items-center gap-1 mt-1"
            >
              <span>View all alerts</span>
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          {/* Banner 2: Priority Insight */}
          <div className="rounded-xl border border-[#E7E5E0] bg-white p-4 shadow-xs flex items-start justify-between gap-4 transition-all hover:shadow-sm">
            <div className="flex items-start gap-3.5">
              <div className="grid size-9 shrink-0 place-items-center rounded-full bg-[#B45309]/10 text-[#B45309] mt-0.5">
                <Sparkles className="size-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#B45309]">
                  PRIORITY INSIGHT
                </p>
                <h3 className="text-base font-bold text-[#1C1917] mt-0.5">
                  Sales are trending strong this week.
                </h3>
                <p className="text-xs font-medium text-[#78716C] mt-0.5">
                  Driven by increased check averages during dinner peak.
                </p>
              </div>
            </div>

            <Link
              href="/regional/intelligence"
              className="shrink-0 text-xs font-bold text-[#881337] hover:underline flex items-center gap-1 mt-1"
            >
              <span>View insight</span>
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Column: Needs Your Attention Card Stack */}
        <div className="lg:col-span-5 rounded-xl border border-[#E7E5E0] bg-white p-4 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-[#F3F2F0] pb-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C1917]">
              NEEDS YOUR ATTENTION
            </h3>
            <Link
              href="/gm/approvals"
              className="text-xs font-bold text-[#881337] hover:underline"
            >
              View all (4)
            </Link>
          </div>

          {/* Items Stack */}
          <div className="space-y-2">
            {/* Item 1 */}
            <div
              onClick={() => router.push("/gm/workforce")}
              className="flex items-start justify-between gap-3 text-xs p-2 rounded-lg hover:bg-[#F7F5F2] transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-2.5">
                <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#F7F5F2] text-[#1C1917] mt-0.5">
                  <FileCheck className="size-4 text-[#881337]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded bg-[#B91C1C]/10 px-1.5 py-0.5 text-[9px] font-bold text-[#B91C1C]">
                      ● HIGH
                    </span>
                  </div>
                  <div className="font-bold text-[#1C1917] mt-1">
                    Airport badge expires
                  </div>
                  <div className="text-[11px] font-medium text-[#78716C]">
                    Taylor Morgan&apos;s badge expires on Aug 29.
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#78716C] shrink-0 pt-1">
                12 days left
              </span>
            </div>

            {/* Item 2 */}
            <div
              onClick={() => router.push("/gm/guests")}
              className="flex items-start justify-between gap-3 text-xs p-2 rounded-lg hover:bg-[#F7F5F2] transition-colors cursor-pointer border-t border-[#F3F2F0] pt-2.5"
            >
              <div className="flex items-start gap-2.5">
                <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#F7F5F2] text-[#1C1917] mt-0.5">
                  <MessageSquare className="size-4 text-[#B91C1C]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded bg-[#B91C1C]/10 px-1.5 py-0.5 text-[9px] font-bold text-[#B91C1C]">
                      ● HIGH
                    </span>
                  </div>
                  <div className="font-bold text-[#1C1917] mt-1">
                    Guest complaints
                  </div>
                  <div className="text-[11px] font-medium text-[#78716C]">
                    3 complaints awaiting response/approval.
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#78716C] shrink-0 pt-1">
                3 items
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. 6-WIDGET DASHBOARD GRID (2 ROWS x 3 COLUMNS) ─────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* WIDGET 1: SALES PERFORMANCE */}
        <div className="rounded-xl border border-[#E7E5E0] bg-white p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-[#F3F2F0] pb-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#78716C]">
                SALES PERFORMANCE
              </p>
              <div className="flex items-center gap-3 text-[11px] font-semibold text-[#78716C] mt-1">
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-[#881337]" /> Today
                </span>
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full border border-dashed border-[#78716C] bg-white" />{" "}
                  Forecast
                </span>
              </div>
            </div>
            <select
              value={salesTimeframe}
              onChange={(e) => setSalesTimeframe(e.target.value)}
              className="rounded-lg border border-[#E7E5E0] bg-[#F7F5F2] px-2.5 py-1 text-xs font-bold text-[#1C1917] outline-none"
            >
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
            </select>
          </div>

          {/* SVG Dual-Line Chart with Vertical Inspector & Hover Tooltips */}
          {(() => {
            const actualPts = salesData.map((pt, i) => ({
              x: 15 + (i * 270) / (salesData.length - 1),
              y: 95 - (pt.sales / 1200) * 80,
            }));
            const forecastPts = salesData.map((pt, i) => ({
              x: 15 + (i * 270) / (salesData.length - 1),
              y: 95 - (pt.forecast / 1200) * 80,
            }));

            const actualCurve = getSmoothCurvePath(actualPts);
            const forecastCurve = getSmoothCurvePath(forecastPts);
            const areaCurve = `${actualCurve} L 285,95 L 15,95 Z`;

            return (
              <div className="relative h-44 w-full pt-1">
                <svg className="h-full w-full overflow-visible" viewBox="0 0 300 110">
                  <defs>
                    <linearGradient id="salesGradOverview" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#881337" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#881337" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  {[15, 40, 65, 90].map((y) => (
                    <line key={y} x1="15" y1={y} x2="285" y2={y} stroke="#F3F2F0" strokeWidth="1" />
                  ))}

                  {/* Soft Burgundy Area Fill */}
                  <path d={areaCurve} fill="url(#salesGradOverview)" />

                  {/* Vertical Inspector Guide on Hover */}
                  {salesHoverIdx !== null && (
                    <line
                      x1={15 + (salesHoverIdx * 270) / (salesData.length - 1)}
                      y1="10"
                      x2={15 + (salesHoverIdx * 270) / (salesData.length - 1)}
                      y2="95"
                      stroke="#881337"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                      className="opacity-50"
                    />
                  )}

                  {/* Smooth Forecast Line */}
                  <path
                    d={forecastCurve}
                    fill="none"
                    stroke="#A8A29E"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                  />

                  {/* Smooth Actual Sales Line */}
                  <path
                    d={actualCurve}
                    fill="none"
                    stroke="#881337"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Interactive Data Nodes */}
                  {salesData.map((pt, i) => {
                    const node = actualPts[i];
                    const isHover = salesHoverIdx === i;
                    return (
                      <g key={pt.time} className="cursor-pointer" onMouseEnter={() => setSalesHoverIdx(i)}>
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={isHover ? 6 : 4}
                          className={`transition-all ${
                            isHover
                              ? "fill-[#881337] stroke-white stroke-2 shadow-md"
                              : "fill-[#881337] stroke-white stroke-1"
                          }`}
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Chronological Time Labels */}
                <div className="flex justify-between text-[9px] font-bold text-[#A8A29E] uppercase tracking-wider mt-2 px-1">
                  {salesData.map((s, i) => (
                    <span
                      key={s.time}
                      onMouseEnter={() => setSalesHoverIdx(i)}
                      className={`cursor-pointer transition-colors ${
                        salesHoverIdx === i ? "text-[#881337] font-extrabold" : ""
                      }`}
                    >
                      {s.time}
                    </span>
                  ))}
                </div>
              </div>
            );
          })()}

          {activeSalesPoint && (
            <div className="mt-2 rounded-lg bg-[#F7F5F2] px-3 py-2 border border-[#E7E5E0] flex items-center justify-between text-xs">
              <span className="font-bold text-[#1C1917]">
                {activeSalesPoint.time}: <strong className="text-[#881337] tabular-nums">${activeSalesPoint.sales.toLocaleString()}/hr</strong>
              </span>
              <span className="text-[10px] font-semibold text-[#78716C] tabular-nums">
                Forecast: ${activeSalesPoint.forecast.toLocaleString()}/hr
              </span>
            </div>
          )}
        </div>

        {/* WIDGET 2: LABOR OVERVIEW */}
        <div className="rounded-xl border border-[#E7E5E0] bg-white p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-[#F3F2F0] pb-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#78716C]">
                LABOR OVERVIEW
              </p>
              <div className="text-[11px] font-bold text-[#B91C1C] mt-0.5 flex items-center gap-1">
                <span>+$589 Over Budget (24.8% vs 23.0%)</span>
              </div>
            </div>
            <select
              value={laborTimeframe}
              onChange={(e) => setLaborTimeframe(e.target.value)}
              className="rounded-lg border border-[#E7E5E0] bg-[#F7F5F2] px-2.5 py-1 text-xs font-bold text-[#1C1917] outline-none"
            >
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
            </select>
          </div>

          {/* Top Section: Donut Ring & High Level Stats */}
          <div className="grid grid-cols-12 gap-3 items-center">
            <div className="col-span-5 flex flex-col items-center justify-center relative">
              <div className="relative inline-flex items-center justify-center">
                <svg width="95" height="95" className="-rotate-90 transform">
                  <circle
                    cx="47.5"
                    cy="47.5"
                    r="36"
                    stroke="#F3F2F0"
                    strokeWidth="9"
                    fill="transparent"
                  />
                  <circle
                    cx="47.5"
                    cy="47.5"
                    r="36"
                    stroke="#881337"
                    strokeWidth="9"
                    strokeDasharray="226"
                    strokeDashoffset="170"
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-lg font-extrabold text-[#1C1917] tabular-nums">
                    24.8%
                  </span>
                  <span className="text-[8px] font-bold text-[#78716C] uppercase">
                    of sales
                  </span>
                </div>
              </div>
            </div>

            <div className="col-span-7 space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-[#78716C] uppercase">Actual Labor</span>
                <span className="font-extrabold text-[#1C1917] tabular-nums">$7,904</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-[#78716C] uppercase">Target (23.0%)</span>
                <span className="font-semibold text-[#78716C] tabular-nums">$7,315</span>
              </div>
              <div className="flex justify-between items-center border-t border-[#F3F2F0] pt-1">
                <span className="text-[10px] font-bold text-[#78716C] uppercase">Variance</span>
                <span className="font-bold text-[#B91C1C] tabular-nums">+1.8% (+ $589)</span>
              </div>
            </div>
          </div>

          {/* Department Labor Breakdown Meter Strip */}
          <div className="border-t border-[#F3F2F0] pt-3 space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#78716C] flex items-center justify-between">
              <span>Department Breakdown</span>
              <span>Labor Share</span>
            </div>

            <div className="space-y-1.5 text-[11px] font-semibold text-[#1C1917]">
              <div>
                <div className="flex justify-between text-[10px] mb-0.5">
                  <span className="text-[#1C1917] font-bold">Kitchen (BOH)</span>
                  <span className="tabular-nums text-[#78716C]">$3,820 (12.0%)</span>
                </div>
                <div className="h-1.5 w-full bg-[#F3F2F0] rounded-full overflow-hidden">
                  <div className="h-full bg-[#881337] rounded-full" style={{ width: "48%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] mb-0.5">
                  <span className="text-[#1C1917] font-bold">Service (FOH)</span>
                  <span className="tabular-nums text-[#78716C]">$2,940 (9.2%)</span>
                </div>
                <div className="h-1.5 w-full bg-[#F3F2F0] rounded-full overflow-hidden">
                  <div className="h-full bg-[#B45309] rounded-full" style={{ width: "37%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* WIDGET 3: TODAY'S TOP PERFORMERS */}
        <div className="rounded-xl border border-[#E7E5E0] bg-white p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-[#F3F2F0] pb-2.5">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C1917]">
                TODAY&apos;S TOP PERFORMERS
              </h3>
              <p className="text-[10px] font-semibold text-[#15803D] mt-0.5">
                ⚡ Avg Add-On Attach: 34.8% (+$4.20 / check)
              </p>
            </div>
            <Link
              href="/gm/workforce"
              className="text-xs font-bold text-[#881337] hover:underline shrink-0"
            >
              View all
            </Link>
          </div>

          <div className="space-y-2">
            {topPerformers.map((p) => (
              <div
                key={p.name}
                onClick={() => router.push("/gm/workforce")}
                className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-[#F7F5F2] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`grid size-7 shrink-0 place-items-center rounded-full font-black text-xs ${p.avatarBg}`}>
                    {p.rank}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-[#1C1917]">{p.name}</span>
                      <span className="text-[9px] font-bold text-[#78716C] bg-[#F7F5F2] px-1.5 py-0.5 rounded border border-[#E7E5E0]">
                        {p.role}
                      </span>
                    </div>
                    <div className="text-[10px] font-medium text-[#78716C] mt-0.5">
                      {p.status}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-extrabold text-xs text-[#1C1917] tabular-nums">
                    {p.sales}
                  </div>
                  <div className="text-[10px] font-bold text-[#B45309] tabular-nums">
                    ★ {p.rating} · {p.addOn}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WIDGET 4: INVENTORY SNAPSHOT */}
        <div className="rounded-xl border border-[#E7E5E0] bg-white p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-[#F3F2F0] pb-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C1917]">
              INVENTORY SNAPSHOT
            </h3>
            <Link
              href="/gm/inventory"
              className="text-xs font-bold text-[#881337] hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#F3F2F0] text-[9px] font-bold uppercase text-[#78716C]">
                  <th className="pb-2">ITEM</th>
                  <th className="pb-2">STATUS</th>
                  <th className="pb-2 text-right">ON HAND</th>
                  <th className="pb-2 text-right">PAR</th>
                  <th className="pb-2 text-right">FORECAST</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F2F0] font-medium text-[#1C1917]">
                <tr
                  onClick={() => router.push("/gm/inventory")}
                  className="hover:bg-[#F7F5F2] transition-colors cursor-pointer"
                >
                  <td className="py-2 font-bold truncate max-w-[110px]">
                    Russet Potatoes
                  </td>
                  <td className="py-2">
                    <span className="inline-flex items-center rounded bg-[#B91C1C]/10 px-1.5 py-0.5 text-[9px] font-bold text-[#B91C1C]">
                      Below par
                    </span>
                  </td>
                  <td className="py-2 text-right font-bold tabular-nums">
                    18 lbs
                  </td>
                  <td className="py-2 text-right text-[#78716C] tabular-nums">
                    50 lbs
                  </td>
                  <td className="py-2 text-right text-[#B91C1C] font-bold text-[10px]">
                    Low in 18 hrs
                  </td>
                </tr>
                <tr
                  onClick={() => router.push("/gm/inventory")}
                  className="hover:bg-[#F7F5F2] transition-colors cursor-pointer"
                >
                  <td className="py-2 font-bold truncate max-w-[110px]">
                    Five Guys Patties
                  </td>
                  <td className="py-2">
                    <span className="inline-flex items-center rounded bg-[#15803D]/10 px-1.5 py-0.5 text-[9px] font-bold text-[#15803D]">
                      At par
                    </span>
                  </td>
                  <td className="py-2 text-right font-bold tabular-nums">
                    120 lbs
                  </td>
                  <td className="py-2 text-right text-[#78716C] tabular-nums">
                    120 lbs
                  </td>
                  <td className="py-2 text-right text-[#15803D] font-bold text-[10px]">
                    Stable
                  </td>
                </tr>
                <tr
                  onClick={() => router.push("/gm/inventory")}
                  className="hover:bg-[#F7F5F2] transition-colors cursor-pointer"
                >
                  <td className="py-2 font-bold truncate max-w-[110px]">
                    Peanut Oil
                  </td>
                  <td className="py-2">
                    <span className="inline-flex items-center rounded bg-[#B91C1C]/10 px-1.5 py-0.5 text-[9px] font-bold text-[#B91C1C]">
                      Below par
                    </span>
                  </td>
                  <td className="py-2 text-right font-bold tabular-nums">
                    3 gal
                  </td>
                  <td className="py-2 text-right text-[#78716C] tabular-nums">
                    8 gal
                  </td>
                  <td className="py-2 text-right text-[#B45309] font-bold text-[10px]">
                    Low in 24 hrs
                  </td>
                </tr>
                <tr
                  onClick={() => router.push("/gm/inventory")}
                  className="hover:bg-[#F7F5F2] transition-colors cursor-pointer"
                >
                  <td className="py-2 font-bold truncate max-w-[110px]">
                    Buns
                  </td>
                  <td className="py-2">
                    <span className="inline-flex items-center rounded bg-[#15803D]/10 px-1.5 py-0.5 text-[9px] font-bold text-[#15803D]">
                      At par
                    </span>
                  </td>
                  <td className="py-2 text-right font-bold tabular-nums">
                    8 bags
                  </td>
                  <td className="py-2 text-right text-[#78716C] tabular-nums">
                    8 bags
                  </td>
                  <td className="py-2 text-right text-[#15803D] font-bold text-[10px]">
                    Stable
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* WIDGET 5: UPCOMING SCHEDULE */}
        <div className="rounded-xl border border-[#E7E5E0] bg-white p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-[#F3F2F0] pb-2.5">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C1917]">
                UPCOMING SCHEDULE (NEXT 7 DAYS)
              </h3>
              <p className="text-[10px] font-semibold text-[#B45309] mt-0.5">
                8 open shifts across 7 days
              </p>
            </div>
            <Link
              href="/gm/staffing"
              className="text-xs font-bold text-[#881337] hover:underline shrink-0"
            >
              View all
            </Link>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {schedule7Days.map((s) => (
              <div
                key={s.date}
                onClick={() => router.push("/gm/staffing")}
                className="flex flex-col items-center justify-between rounded-lg border border-[#E7E5E0] bg-[#F7F5F2] p-1.5 text-center min-h-[105px] cursor-pointer hover:border-[#881337]/40 hover:bg-[#881337]/5 transition-all group"
              >
                <span className="text-[9px] font-bold uppercase text-[#78716C]">
                  {s.day}
                </span>
                <span className="text-sm font-extrabold text-[#1C1917] tabular-nums my-0.5">
                  {s.date}
                </span>

                <div className="w-full bg-[#E7E5E0] h-1 rounded-full overflow-hidden my-0.5">
                  <div
                    className={`h-full rounded-full ${
                      s.tone === "red"
                        ? "bg-[#B91C1C]"
                        : s.tone === "amber"
                        ? "bg-[#B45309]"
                        : "bg-[#15803D]"
                    }`}
                    style={{ width: `${s.pct}%` }}
                  />
                </div>

                <span className="text-[9px] font-bold text-[#1C1917] tabular-nums">
                  {s.count}
                </span>
                <span
                  className={`mt-1 text-[7.5px] font-bold px-1 py-0.5 rounded leading-none ${
                    s.tone === "red"
                      ? "bg-[#B91C1C]/10 text-[#B91C1C]"
                      : s.tone === "amber"
                      ? "bg-[#B45309]/10 text-[#B45309]"
                      : "bg-[#15803D]/10 text-[#15803D]"
                  }`}
                >
                  {s.gap}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-[#F3F2F0] pt-2 flex items-center justify-between text-xs">
            <span className="text-[11px] font-semibold text-[#78716C]">
              Sat 4–8 PM: <strong className="text-[#B91C1C]">2 roles short</strong>
            </span>
            <button
              type="button"
              onClick={() => dispatch({ type: "sendShiftOffer" })}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#881337] hover:underline"
            >
              <Send className="size-3" />
              <span>Broadcast Offer</span>
            </button>
          </div>
        </div>

        {/* WIDGET 6: RECENT ACTIVITY */}
        <div className="rounded-xl border border-[#E7E5E0] bg-white p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-[#F3F2F0] pb-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C1917]">
              RECENT ACTIVITY
            </h3>
            <Link
              href="/integrations"
              className="text-xs font-bold text-[#881337] hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="space-y-2 text-xs">
            {/* Activity 1 */}
            <div
              onClick={() => router.push("/gm/guests")}
              className="flex items-start justify-between gap-2 p-1.5 rounded-lg hover:bg-[#F7F5F2] transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-2">
                <span className="text-[10px] font-bold text-[#78716C] w-12 shrink-0 pt-0.5">
                  2:05 PM
                </span>
                <span className="font-medium text-[#1C1917] leading-tight">
                  Guest complaint received via email
                </span>
              </div>
              <span className="inline-flex items-center rounded bg-[#B91C1C]/10 px-1.5 py-0.5 text-[9px] font-bold text-[#B91C1C] shrink-0">
                New
              </span>
            </div>

            {/* Activity 2 */}
            <div
              onClick={() => router.push("/gm/workforce")}
              className="flex items-start justify-between gap-2 p-1.5 rounded-lg hover:bg-[#F7F5F2] transition-colors cursor-pointer border-t border-[#F3F2F0] pt-2"
            >
              <div className="flex items-start gap-2">
                <span className="text-[10px] font-bold text-[#78716C] w-12 shrink-0 pt-0.5">
                  1:42 PM
                </span>
                <span className="font-medium text-[#1C1917] leading-tight">
                  Taylor Morgan completed Food Safety Training
                </span>
              </div>
              <span className="inline-flex items-center rounded bg-[#15803D]/10 px-1.5 py-0.5 text-[9px] font-bold text-[#15803D] shrink-0">
                Completed
              </span>
            </div>

            {/* Activity 3 */}
            <div
              onClick={() => router.push("/integrations")}
              className="flex items-start justify-between gap-2 p-1.5 rounded-lg hover:bg-[#F7F5F2] transition-colors cursor-pointer border-t border-[#F3F2F0] pt-2"
            >
              <div className="flex items-start gap-2">
                <span className="text-[10px] font-bold text-[#78716C] w-12 shrink-0 pt-0.5">
                  12:15 PM
                </span>
                <span className="font-medium text-[#1C1917] leading-tight">
                  Invoice received from US Foods
                </span>
              </div>
              <span className="inline-flex items-center rounded bg-[#0284C7]/10 px-1.5 py-0.5 text-[9px] font-bold text-[#0284C7] shrink-0">
                Received
              </span>
            </div>

            {/* Activity 4 */}
            <div
              onClick={() => router.push("/gm/approvals")}
              className="flex items-start justify-between gap-2 p-1.5 rounded-lg hover:bg-[#F7F5F2] transition-colors cursor-pointer border-t border-[#F3F2F0] pt-2"
            >
              <div className="flex items-start gap-2">
                <span className="text-[10px] font-bold text-[#78716C] w-12 shrink-0 pt-0.5">
                  11:22 AM
                </span>
                <span className="font-medium text-[#1C1917] leading-tight">
                  Payroll batch approved by Jordan Ellis
                </span>
              </div>
              <span className="inline-flex items-center rounded bg-[#15803D]/10 px-1.5 py-0.5 text-[9px] font-bold text-[#15803D] shrink-0">
                Approved
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
