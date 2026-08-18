"use client";

import React, { useState, useEffect } from "react";
import { X, Sliders, Check, User, Mail, Building2, MapPin, Sparkles } from "lucide-react";
import { usePrive, DEMO_PRESETS, type DemoConfig } from "@/lib/prive/store";

export function DemoConfigModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { state, dispatch } = usePrive();
  const current = state.demoConfig;

  const [firstName, setFirstName] = useState(current.firstName);
  const [email, setEmail] = useState(current.email);
  const [companyName, setCompanyName] = useState(current.companyName);
  const [location, setLocation] = useState(current.location);

  useEffect(() => {
    setFirstName(current.firstName);
    setEmail(current.email);
    setCompanyName(current.companyName);
    setLocation(current.location);
  }, [current]);

  if (!open) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: "updateDemoConfig",
      config: { firstName, email, companyName, location },
    });
    onClose();
  };

  const applyPreset = (key: keyof typeof DEMO_PRESETS) => {
    const preset = DEMO_PRESETS[key];
    if (preset) {
      setFirstName(preset.firstName);
      setEmail(preset.email);
      setCompanyName(preset.companyName);
      setLocation(preset.location);
      dispatch({
        type: "updateDemoConfig",
        config: preset,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg rounded-2xl border border-[#E7E5E0] bg-white p-6 shadow-2xl z-10 text-[#1C1917]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E7E5E0] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-xl bg-[#881337] text-white">
              <Sliders className="size-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-[#1C1917]">
                Configure Demo Prospect & Restaurant
              </h2>
              <p className="text-xs font-medium text-[#78716C]">
                Set prospect name, email, company, and location before meeting.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#78716C] hover:bg-[#F7F5F2] hover:text-[#1C1917] transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Quick Presets Bar */}
        <div className="my-4 space-y-2">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#881337] flex items-center gap-1">
            <Sparkles className="size-3 text-[#F59E0B]" />
            <span>Quick Prospect Presets</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => applyPreset("morningTable")}
              className={`rounded-xl border p-2.5 text-left text-xs transition-all cursor-pointer ${
                companyName === "The Morning Table"
                  ? "border-[#881337] bg-[#881337]/5 font-bold text-[#881337] shadow-2xs"
                  : "border-[#E7E5E0] bg-[#FAFAF8] text-[#1C1917] hover:bg-[#F7F5F2]"
              }`}
            >
              <div className="truncate font-black">The Morning Table</div>
              <div className="text-[10px] text-[#78716C] truncate mt-0.5">Larry · Ballantyne</div>
            </button>

            <button
              type="button"
              onClick={() => applyPreset("fiveGuys")}
              className={`rounded-xl border p-2.5 text-left text-xs transition-all cursor-pointer ${
                companyName === "Five Guys"
                  ? "border-[#881337] bg-[#881337]/5 font-bold text-[#881337] shadow-2xs"
                  : "border-[#E7E5E0] bg-[#FAFAF8] text-[#1C1917] hover:bg-[#F7F5F2]"
              }`}
            >
              <div className="truncate font-black">Five Guys</div>
              <div className="text-[10px] text-[#78716C] truncate mt-0.5">Larry · Store #104</div>
            </button>

            <button
              type="button"
              onClick={() => applyPreset("anotherBrokenEgg")}
              className={`rounded-xl border p-2.5 text-left text-xs transition-all cursor-pointer ${
                companyName === "Another Broken Egg"
                  ? "border-[#881337] bg-[#881337]/5 font-bold text-[#881337] shadow-2xs"
                  : "border-[#E7E5E0] bg-[#FAFAF8] text-[#1C1917] hover:bg-[#F7F5F2]"
              }`}
            >
              <div className="truncate font-black">Another Broken Egg</div>
              <div className="text-[10px] text-[#78716C] truncate mt-0.5">Adam · South End</div>
            </button>
          </div>
        </div>

        {/* Custom Input Form */}
        <form onSubmit={handleSave} className="space-y-4 pt-2 border-t border-[#E7E5E0]">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1C1917] mb-1">
                Prospect First Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#78716C]" />
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Larry"
                  className="w-full rounded-xl border border-[#E7E5E0] bg-[#FAFAF8] py-2.5 pl-9 pr-3 text-xs font-semibold text-[#1C1917] outline-none focus:border-[#881337]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1917] mb-1">
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#78716C]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. larry@fiveguys.com"
                  className="w-full rounded-xl border border-[#E7E5E0] bg-[#FAFAF8] py-2.5 pl-9 pr-3 text-xs font-semibold text-[#1C1917] outline-none focus:border-[#881337]"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1C1917] mb-1">
                Company / Restaurant Name
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#78716C]" />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Five Guys"
                  className="w-full rounded-xl border border-[#E7E5E0] bg-[#FAFAF8] py-2.5 pl-9 pr-3 text-xs font-semibold text-[#1C1917] outline-none focus:border-[#881337]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1917] mb-1">
                Store Location / Identifier
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#78716C]" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Store #104"
                  className="w-full rounded-xl border border-[#E7E5E0] bg-[#FAFAF8] py-2.5 pl-9 pr-3 text-xs font-semibold text-[#1C1917] outline-none focus:border-[#881337]"
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#E7E5E0]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#E7E5E0] bg-white px-4 py-2.5 text-xs font-bold text-[#1C1917] hover:bg-[#F7F5F2]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-[#881337] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#6B0F2A]"
            >
              Save Prospect Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
