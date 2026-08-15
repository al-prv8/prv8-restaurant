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
  return (
    <div
      className={`relative rounded-2xl border border-[#101828]/12 bg-[#F9FAFB] p-3.5 shadow-sm ${className}`}
    >
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="absolute right-2.5 top-2.5 text-[#101828]/35 hover:text-[#101828] text-xs transition-colors"
          aria-label="Dismiss card"
        >
          ✕
        </button>
      ) : null}

      <div className="flex items-center justify-between text-xs font-bold text-[#101828]">
        <span>{title}</span>
        <span className="tabular-nums font-extrabold text-[#0F9D8A]">{progress}%</span>
      </div>

      <p className="mt-1 text-[11px] leading-relaxed text-[#101828]/60">{description}</p>

      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-[#101828]/10">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${progress}%`,
            background: progress >= 85 ? "#0F9D8A" : "#F59E0B",
          }}
        />
      </div>

      {confirmLabel ? (
        <div className="mt-3 flex items-center justify-between">
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-[#5146E5] px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#4238cf] transition-all"
          >
            {confirmLabel}
          </button>
        </div>
      ) : null}
    </div>
  );
}
