"use client";

import React from "react";
import {
  Bell,
  X,
  AlertTriangle,
  FileCheck,
  MessageSquare,
  Package,
  Check,
  Trash2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { usePrive } from "@/lib/prive/store";

export function NotificationsDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { derived: d, dispatch } = usePrive();

  if (!open) return null;

  const notifications = [
    {
      id: "n1",
      title: "Airport Badge Expirations",
      desc: "Taylor Morgan & 6 BOH staff badges expire in 12 days.",
      type: "HIGH",
      time: "10 mins ago",
      icon: FileCheck,
      color: "#B91C1C",
      href: "/gm/workforce",
    },
    {
      id: "n2",
      title: "Guest Complaints Pending",
      desc: "3 guest issues awaiting manager review & approval.",
      type: "HIGH",
      time: "25 mins ago",
      icon: MessageSquare,
      color: "#B91C1C",
      href: "/gm/guests",
    },
    {
      id: "n3",
      title: "Inventory Stockout Risk",
      desc: "Russet Potatoes projected below par (35 lbs) by 6:42 PM.",
      type: "PREDICTIVE",
      time: "1 hour ago",
      icon: Package,
      color: "#B45309",
      href: "/gm/inventory",
    },
    {
      id: "n4",
      title: "Bi-Weekly Payroll Sign-Off",
      desc: "Cutoff today 5:00 PM. Total $14,280 gross wages.",
      type: "ACTION",
      time: "2 hours ago",
      icon: AlertTriangle,
      color: "#881337",
      href: "/gm/payroll",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="pointer-events-auto w-screen max-w-md bg-white text-[#1C1917] shadow-2xl flex flex-col border-l border-[#E7E5E0]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#E7E5E0] bg-[#FAFAF8] px-6 py-4">
            <div className="flex items-center gap-2.5">
              <div className="grid size-8 place-items-center rounded-lg bg-[#881337]/10 text-[#881337]">
                <Bell className="size-4" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-[#1C1917]">
                  Notifications
                </h2>
                <p className="text-[11px] font-semibold text-[#78716C]">
                  4 priority alerts requiring attention
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-[#78716C] hover:bg-[#E7E5E0] hover:text-[#1C1917] transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {notifications.map((n) => {
              const Icon = n.icon;
              return (
                <div
                  key={n.id}
                  className="group relative rounded-xl border border-[#E7E5E0] bg-white p-4 shadow-xs hover:border-[#881337]/30 hover:shadow-md transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className="grid size-8 shrink-0 place-items-center rounded-lg mt-0.5"
                        style={{ backgroundColor: `${n.color}15`, color: n.color }}
                      >
                        <Icon className="size-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className="rounded px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider"
                            style={{ backgroundColor: `${n.color}15`, color: n.color }}
                          >
                            ● {n.type}
                          </span>
                          <span className="text-[10px] font-semibold text-[#78716C]">
                            {n.time}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-[#1C1917] mt-1">
                          {n.title}
                        </h4>
                        <p className="text-[11px] font-medium text-[#78716C] mt-0.5 leading-relaxed">
                          {n.desc}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end border-t border-[#F3F2F0] pt-2">
                    <Link
                      href={n.href}
                      onClick={onClose}
                      className="text-xs font-bold text-[#881337] hover:underline flex items-center gap-1"
                    >
                      <span>Take Action</span>
                      <ExternalLink className="size-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="border-t border-[#E7E5E0] bg-[#FAFAF8] p-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => alert("All notifications marked as read.")}
              className="text-xs font-bold text-[#78716C] hover:text-[#1C1917] flex items-center gap-1.5"
            >
              <Check className="size-3.5" />
              <span>Mark all as read</span>
            </button>
            <Link
              href="/gm/approvals"
              onClick={onClose}
              className="text-xs font-bold text-[#881337] hover:underline"
            >
              View Approvals Hub &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
