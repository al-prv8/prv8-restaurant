"use client";

import { useState } from "react";
import { Activity, Cpu, Database, Layers, Radio, ShoppingBag, Users } from "lucide-react";
import { Pill } from "./ui";

interface DataNode {
  id: string;
  label: string;
  system: string;
  status: "Live" | "Syncing" | "Idle";
  latency: string;
  throughput: string;
  icon: typeof Cpu;
  x: number;
  y: number;
}

const NODES: DataNode[] = [
  { id: "pos", label: "Toast POS", system: "POS & Sales Velocity", status: "Live", latency: "12ms", throughput: "142 tx/min", icon: ShoppingBag, x: 18, y: 25 },
  { id: "sched", label: "7shifts", system: "Labor & Staffing", status: "Live", latency: "45ms", throughput: "3 shift ops", icon: Users, x: 82, y: 25 },
  { id: "inv", label: "Carolina Produce", system: "Supply & Depletion", status: "Live", latency: "120ms", throughput: "82 SKU checks", icon: Database, x: 18, y: 75 },
  { id: "pay", label: "Paycor Payroll", system: "Compliance & Labor %", status: "Live", latency: "90ms", throughput: "12 roster syncs", icon: Layers, x: 82, y: 75 },
  { id: "ai", label: "Voice AI Contact", system: "Guest Complaint Intake", status: "Live", latency: "8ms", throughput: "24/7 Active", icon: Radio, x: 50, y: 88 },
];

export function DataFlowMesh() {
  const [activeNodeId, setActiveNodeId] = useState<string>("pos");
  const activeNode = NODES.find((n) => n.id === activeNodeId) ?? NODES[0]!;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] ring-1 ring-black/[0.03] p-6 transition-all duration-300">
      {/* Specular top sheen line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/90 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7E5E0] pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#881337] mb-1">
            <Activity className="size-3.5 animate-pulse" /> Live Telemetry Mesh
          </div>
          <h3 className="text-lg font-black tracking-tight text-[#1C1917]">
            Unified Operational System Mesh
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Pill tone="teal">
            <span className="size-1.5 rounded-full bg-[#15803D] animate-ping mr-1" /> 5 Feeds Connected
          </Pill>
          <span className="text-[11px] font-semibold text-[#78716C]">99.98% Uptime</span>
        </div>
      </div>

      {/* Node Mesh Graphic Area */}
      <div className="relative h-72 sm:h-80 w-full rounded-2xl bg-white/40 backdrop-blur-md ring-1 ring-black/[0.03] overflow-hidden flex items-center justify-center">
        {/* Animated Connecting Lines */}
        <svg className="absolute inset-0 size-full overflow-visible pointer-events-none">
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#881337" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#15803D" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* SVG Connection Paths from Nodes to Privé Center Core (50%, 48%) */}
          {NODES.map((node) => (
            <g key={node.id}>
              <line
                x1={`${node.x}%`}
                y1={`${node.y}%`}
                x2="50%"
                y2="48%"
                stroke="url(#lineGrad)"
                strokeWidth="2"
                strokeDasharray="6 4"
                className="animate-[dash_12s_linear_infinite]"
              />
              {/* Moving Pulse Particle along line */}
              <circle
                cx={`${(node.x + 50) / 2}%`}
                cy={`${(node.y + 48) / 2}%`}
                r="3"
                fill="#881337"
                className="animate-ping"
              />
            </g>
          ))}
        </svg>

        {/* Center Privé Cognitive Core */}
        <div className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 z-20 text-center">
          <div className="relative inline-flex items-center justify-center size-20 rounded-full bg-[#881337] text-white shadow-2xl ring-4 ring-white/60 animate-pulse">
            <Cpu className="size-9 text-white" />
            <span className="absolute -top-1 -right-1 size-4 rounded-full bg-[#15803D] ring-2 ring-white" />
          </div>
          <div className="mt-2 text-xs font-black tracking-wider uppercase text-[#881337]">
            Privé Core
          </div>
        </div>

        {/* Interactive Satellite System Nodes */}
        {NODES.map((node) => {
          const Icon = node.icon;
          const isSelected = activeNodeId === node.id;
          return (
            <button
              key={node.id}
              type="button"
              onClick={() => setActiveNodeId(node.id)}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 z-30 flex items-center gap-2.5 rounded-2xl px-3 py-2 text-left transition-all duration-200 shadow-md ${
                isSelected
                  ? "bg-[#881337] text-white ring-2 ring-[#881337]/40 scale-110 shadow-xl"
                  : "bg-white/90 backdrop-blur-md text-[#1C1917] hover:bg-white hover:scale-105 ring-1 ring-black/[0.05]"
              }`}
            >
              <div className={`grid size-7 place-items-center rounded-lg ${isSelected ? "bg-white/20 text-white" : "bg-[#881337]/10 text-[#881337]"}`}>
                <Icon className="size-4" />
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-bold leading-none">{node.label}</div>
                <div className={`text-[10px] font-medium leading-tight mt-0.5 ${isSelected ? "text-white/80" : "text-[#78716C]"}`}>
                  {node.latency}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Node Telemetry Detail Banner */}
      <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-[#881337]/10 text-[#881337]">
            <activeNode.icon className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#1C1917]">{activeNode.label}</span>
              <Pill tone="teal">{activeNode.status}</Pill>
            </div>
            <p className="text-xs font-medium text-[#78716C] mt-0.5">{activeNode.system}</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs font-semibold text-[#1C1917]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8A29E] block">Latency</span>
            <span className="text-sm font-black tabular-nums text-[#15803D]">{activeNode.latency}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8A29E] block">Throughput</span>
            <span className="text-sm font-black tabular-nums text-[#881337]">{activeNode.throughput}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
