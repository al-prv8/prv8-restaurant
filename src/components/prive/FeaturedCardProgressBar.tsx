"use client";

import React from "react";

export interface FeaturedCardProgressBarProps {
  title: string;
  description: string;
  confirmLabel?: string;
  progress: number;
  onConfirm?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function FeaturedCardProgressBar({
  title,
  description,
  confirmLabel,
  progress,
  onConfirm,
  onDismiss,
  className = "",
}: FeaturedCardProgressBarProps) {
  const barColor = progress >= 85 ? "#15803D" : progress >= 70 ? "#B45309" : "#B91C1C";

  return (
    <div
      className={`relative rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-4 ${className}`}
    >
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="absolute right-3 top-3 text-[#A8A29E] hover:text-[#1C1917] text-xs transition-colors"
          aria-label="Dismiss card"
        >
          ✕
        </button>
      ) : null}

      <div className="flex items-center justify-between text-xs font-bold text-[#1C1917]">
        <span>{title}</span>
        <span className="tabular-nums font-extrabold" style={{ color: barColor }}>
          {progress}%
        </span>
      </div>

      <p className="mt-1 text-[11px] leading-relaxed text-[#78716C]">{description}</p>

      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-[#1C1917]/8">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${progress}%`, background: barColor }}
        />
      </div>

      {confirmLabel ? (
        <div className="mt-3">
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg px-3 py-1.5 text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: "#881337" }}
          >
            {confirmLabel}
          </button>
        </div>
      ) : null}
    </div>
  );
}
