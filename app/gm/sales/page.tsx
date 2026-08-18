"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Tag,
  DollarSign,
  CreditCard,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  Calendar,
  Utensils,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Card, SectionTitle, KpiRow, PageTabs } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";

export default function GmSalesPage() {
  const { derived: d } = usePrive();
  const [activeTab, setActiveTab] = useState<"hourly" | "category" | "items">("hourly");
  const [activeIdx, setActiveIdx] = useState<number | null>(8); // Default 6 PM peak

  const hourlyData = [
    { time: "10 AM", sales: 320, transactions: 12, avgCheck: 26.6 },
    { time: "11 AM", sales: 580, transactions: 19, avgCheck: 30.5 },
    { time: "12 PM", sales: 890, transactions: 24, avgCheck: 37.0 },
    { time: "1 PM",  sales: 750, transactions: 21, avgCheck: 35.7 },
    { time: "2 PM",  sales: 420, transactions: 14, avgCheck: 30.0 },
    { time: "3 PM",  sales: 310, transactions: 10, avgCheck: 31.0 },
    { time: "4 PM",  sales: 520, transactions: 16, avgCheck: 32.5 },
    { time: "5 PM",  sales: 840, transactions: 22, avgCheck: 38.1 },
    { time: "6 PM",  sales: 980, transactions: 25, avgCheck: 39.2 },
    { time: "7 PM",  sales: 910, transactions: 23, avgCheck: 39.5 },
    { time: "8 PM",  sales: 640, transactions: 18, avgCheck: 35.5 },
    { time: "9 PM",  sales: 380, transactions: 12, avgCheck: 31.6 },
  ];

  const maxSales = 1000;
  const activeData = activeIdx !== null ? hourlyData[activeIdx] : hourlyData[8];

  const topMenuItems = [
    { name: "Double Cheeseburger", category: "Entrees", units: 248, revenue: 3224, mixPct: "24.2%", addOnRate: "42%" },
    { name: "Russet French Fries", category: "Sides", units: 312, revenue: 1560, mixPct: "16.5%", addOnRate: "68%" },
    { name: "Hand-Crafted Milkshake", category: "Beverages", units: 184, revenue: 1288, mixPct: "12.1%", addOnRate: "35%" },
    { name: "Grilled Chicken Club", category: "Entrees", units: 142, revenue: 1846, mixPct: "11.4%", addOnRate: "28%" },
    { name: "Fresh Avocado Salad", category: "Entrees", units: 98, revenue: 1176, mixPct: "8.6%", addOnRate: "22%" },
    { name: "Fountain Beverage (Lg)", category: "Beverages", units: 340, revenue: 1190, mixPct: "14.8%", addOnRate: "72%" },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#881337] mb-1">
            BALLANTYNE #02 · REVENUE INTELLIGENCE
          </p>
          <h1 className="text-3xl font-black tracking-tight text-[#1C1917]">
            Sales & Revenue Analytics
          </h1>
          <p className="mt-1 max-w-3xl text-sm font-medium text-[#78716C]">
            Hourly revenue curves, category mix, average ticket size, and product velocity for Ballantyne #02.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/gm/home"
            className="rounded-lg border border-[#E7E5E0] bg-white px-3.5 py-2 text-xs font-bold text-[#1C1917] hover:bg-[#F7F5F2] transition-colors"
          >
            ← Back to Overview
          </Link>
        </div>
      </div>

      {/* ── KPI Row ─────────────────────────────────────────────────────── */}
      <KpiRow
        items={[
          { label: "Sales (Today)", value: "$31,842", tone: "good", sub: "+8.2% vs forecast" },
          { label: "Target Sales", value: "$29,400", tone: "neutral", sub: "Daily budget" },
          { label: "Avg Ticket Size", value: "$42.50", tone: "good", sub: "+$2.10 vs 30-day avg" },
          { label: "Total Transactions", value: "749", tone: "neutral", sub: "Peak: 6-7 PM" },
          { label: "Top Product Mix", value: "54% Entrees", tone: "positive", sub: "Cheeseburger #1" },
        ]}
      />

      {/* ── Tabs ────────────────────────────────────────────────────────── */}
      <PageTabs
        tabs={[
          { id: "hourly", label: "Hourly Sales Curve" },
          { id: "category", label: "Category Mix & Channels" },
          { id: "items", label: "Top Menu Items" },
        ]}
        active={activeTab}
        onChange={(t) => setActiveTab(t as any)}
      />

      {/* ── 1. HOURLY SALES CURVE ───────────────────────────────────────── */}
      {activeTab === "hourly" && (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Main Chart Column */}
          <div className="lg:col-span-8 space-y-6">
            <Card>
              <SectionTitle hint="Real-Time POS Sync">
                Hourly Revenue & Peak Velocity
              </SectionTitle>

              <div className="mt-4 relative h-56 w-full">
                {(() => {
                  const pts = hourlyData.map((h, i) => ({
                    x: (i * 600) / (hourlyData.length - 1),
                    y: 140 - (h.sales / maxSales) * 125,
                  }));

                  function getSmoothPath(p: { x: number; y: number }[]) {
                    if (p.length === 0) return "";
                    let path = `M ${p[0].x.toFixed(1)},${p[0].y.toFixed(1)}`;
                    for (let i = 0; i < p.length - 1; i++) {
                      const p0 = p[i === 0 ? i : i - 1];
                      const p1 = p[i];
                      const p2 = p[i + 1];
                      const p3 = p[i + 2 < p.length ? i + 2 : i + 1];
                      const cp1x = p1.x + (p2.x - p0.x) / 6;
                      const cp1y = p1.y + (p2.y - p0.y) / 6;
                      const cp2x = p2.x - (p3.x - p1.x) / 6;
                      const cp2y = p2.y - (p3.y - p1.y) / 6;
                      path += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
                    }
                    return path;
                  }

                  const curvePath = getSmoothPath(pts);
                  const areaPath = `${curvePath} L 600,140 L 0,140 Z`;

                  return (
                    <svg className="h-full w-full overflow-visible" viewBox="0 0 600 140">
                      {/* Grid Lines */}
                      {[0, 35, 70, 105, 140].map((y) => (
                        <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="#F3F2F0" strokeWidth="1" />
                      ))}

                      {/* Gradient Area */}
                      <defs>
                        <linearGradient id="salesPageGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#15803D" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#15803D" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      <path d={areaPath} fill="url(#salesPageGrad)" />

                      {/* Vertical Inspector Line */}
                      {activeIdx !== null && (
                        <line
                          x1={(activeIdx * 600) / (hourlyData.length - 1)}
                          y1="0"
                          x2={(activeIdx * 600) / (hourlyData.length - 1)}
                          y2="140"
                          stroke="#881337"
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                          className="opacity-50"
                        />
                      )}

                      {/* Smooth Curve Line */}
                      <path
                        d={curvePath}
                        fill="none"
                        stroke="#15803D"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Nodes */}
                      {hourlyData.map((h, i) => {
                        const pt = pts[i];
                        const isHover = activeIdx === i;
                        return (
                          <g key={h.time} className="cursor-pointer" onMouseEnter={() => setActiveIdx(i)}>
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r={isHover ? 6.5 : 4}
                              className={`transition-all ${isHover ? "fill-[#881337] stroke-white stroke-2 shadow-md" : "fill-[#15803D] stroke-white stroke-1"}`}
                            />
                          </g>
                        );
                      })}
                    </svg>
                  );
                })()}
              </div>

              {/* X Axis Labels */}
              <div className="flex justify-between text-[10px] font-bold text-[#A8A29E] uppercase tracking-wider mt-3 border-t border-[#E7E5E0] pt-2">
                {hourlyData.map((h, i) => (
                  <span
                    key={h.time}
                    onMouseEnter={() => setActiveIdx(i)}
                    className={`cursor-pointer transition-colors ${activeIdx === i ? "text-[#881337] font-black" : ""}`}
                  >
                    {h.time}
                  </span>
                ))}
              </div>

              {/* Active Hour Details Bar */}
              {activeData && (
                <div className="mt-4 rounded-xl bg-[#F7F5F2] p-4 border border-[#E7E5E0] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-black text-[#1C1917] text-sm">{activeData.time} Peak:</span>{" "}
                    <span className="text-[#78716C] font-medium ml-2">Revenue:</span>{" "}
                    <strong className="text-[#15803D] text-sm tabular-nums">${activeData.sales}</strong>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold text-[#1C1917]">
                    <span>Transactions: <strong className="tabular-nums">{activeData.transactions}</strong></span>
                    <span>Avg Ticket: <strong className="tabular-nums">${activeData.avgCheck.toFixed(2)}</strong></span>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Side Performance Cards */}
          <div className="lg:col-span-4 space-y-6">
            <Card>
              <SectionTitle hint="Daypart Breakdown">Peak Hours Analysis</SectionTitle>

              <div className="space-y-4 text-xs">
                <div className="rounded-xl border border-[#E7E5E0] bg-[#FAFAF8] p-3.5 space-y-1">
                  <div className="flex items-center justify-between font-bold text-[#1C1917]">
                    <span>Dinner Peak (5 PM – 8 PM)</span>
                    <span className="text-[#15803D]">$2,530 Total</span>
                  </div>
                  <p className="text-[11px] font-medium text-[#78716C]">
                    Accounts for 48.2% of daily revenue. Avg check size: $39.40.
                  </p>
                </div>

                <div className="rounded-xl border border-[#E7E5E0] bg-[#FAFAF8] p-3.5 space-y-1">
                  <div className="flex items-center justify-between font-bold text-[#1C1917]">
                    <span>Lunch Rush (11 AM – 2 PM)</span>
                    <span className="text-[#15803D]">$2,220 Total</span>
                  </div>
                  <p className="text-[11px] font-medium text-[#78716C]">
                    High velocity, lower average ticket ($34.40). 64 transactions.
                  </p>
                </div>

                <div className="rounded-xl border border-[#E7E5E0] bg-[#FAFAF8] p-3.5 space-y-1">
                  <div className="flex items-center justify-between font-bold text-[#1C1917]">
                    <span>Late Afternoon (2 PM – 5 PM)</span>
                    <span className="text-[#78716C]">$1,250 Total</span>
                  </div>
                  <p className="text-[11px] font-medium text-[#78716C]">
                    Transitional period. Ideal window for shift changes.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ── 2. TOP MENU ITEMS TABLE ─────────────────────────────────────── */}
      <Card>
        <SectionTitle hint={`${topMenuItems.length} Featured Items`}>
          Top Selling Menu Items Today
        </SectionTitle>

        <div className="overflow-x-auto rounded-xl border border-[#E7E5E0]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F5F2] border-b border-[#E7E5E0] text-[10px] font-bold uppercase tracking-widest text-[#78716C]">
              <tr>
                <th className="p-3">MENU ITEM</th>
                <th className="p-3">CATEGORY</th>
                <th className="p-3 text-right">UNITS SOLD</th>
                <th className="p-3 text-right">TOTAL REVENUE</th>
                <th className="p-3 text-right">SALES MIX %</th>
                <th className="p-3 text-right">ADD-ON ATTACH</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F2F0] font-medium text-[#1C1917]">
              {topMenuItems.map((item) => (
                <tr key={item.name} className="hover:bg-[#FAFAF8] transition-colors">
                  <td className="p-3 font-bold text-[#1C1917]">{item.name}</td>
                  <td className="p-3 text-[#78716C]">{item.category}</td>
                  <td className="p-3 text-right tabular-nums font-bold">{item.units}</td>
                  <td className="p-3 text-right tabular-nums font-bold text-[#15803D]">${item.revenue.toLocaleString()}</td>
                  <td className="p-3 text-right tabular-nums">{item.mixPct}</td>
                  <td className="p-3 text-right tabular-nums text-[#881337] font-bold">{item.addOnRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
