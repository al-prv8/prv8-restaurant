import React from "react";
import { toast } from "sonner";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Sparkles,
  User,
  ShieldCheck,
  RefreshCw,
  Bell,
} from "lucide-react";

export interface ToastNotificationOptions {
  title: string;
  description?: string;
  type?: "default" | "gray" | "brand" | "success" | "warning" | "error";
  avatarUrl?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function notify({
  title,
  description,
  type = "brand",
  avatarUrl,
  actionLabel,
  onAction,
}: ToastNotificationOptions) {
  toast.custom(
    (t) => (
      <div className="w-full max-w-[360px] rounded-2xl border border-white/80 bg-white/80 backdrop-blur-xl p-3.5 shadow-xl ring-1 ring-black/[0.05] transition-all flex items-center gap-3">
        {/* Left Badge / Avatar */}
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar"
            className="size-9 rounded-full object-cover shrink-0 ring-2 ring-[#1C1917]/10"
          />
        ) : (
          <div
            className={`grid size-9 shrink-0 place-items-center rounded-xl border transition-colors my-auto ${
              type === "success"
                ? "border-[#15803D]/30 bg-[#15803D]/10 text-[#15803D]"
                : type === "warning"
                ? "border-[#B45309]/30 bg-[#B45309]/10 text-[#B45309]"
                : type === "error"
                ? "border-[#B91C1C]/30 bg-[#B91C1C]/10 text-[#B91C1C]"
                : type === "gray"
                ? "border-[#78716C]/30 bg-[#78716C]/10 text-[#78716C]"
                : "border-[#881337]/30 bg-[#881337]/10 text-[#881337]"
            }`}
          >
            {type === "success" ? (
              <CheckCircle2 className="size-5 shrink-0" />
            ) : type === "warning" ? (
              <AlertTriangle className="size-5 shrink-0" />
            ) : type === "error" ? (
              <XCircle className="size-5 shrink-0" />
            ) : type === "gray" ? (
              <Info className="size-5 shrink-0" />
            ) : (
              <Sparkles className="size-5 shrink-0" />
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-xs font-bold text-[#1C1917] leading-snug">{title}</h4>
            <button
              type="button"
              onClick={() => toast.dismiss(t)}
              className="text-[#A8A29E] hover:text-[#1C1917] text-xs font-bold transition-colors shrink-0 -mt-0.5"
              aria-label="Close notification"
            >
              ✕
            </button>
          </div>
          {description ? (
            <p className="mt-0.5 text-[11px] text-[#78716C] leading-relaxed">{description}</p>
          ) : null}

          {actionLabel ? (
            <div className="mt-2.5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onAction?.();
                  toast.dismiss(t);
                }}
                className="rounded-lg bg-[#881337] px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm hover:bg-[#6B0F2A] transition-all"
              >
                {actionLabel}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    ),
    { duration: 4000 }
  );
}

// Preset helper functions matching Untold UI demo categories
export const notifySuccess = (title: string, description?: string) =>
  notify({ title, description, type: "success" });

export const notifyWarning = (title: string, description?: string) =>
  notify({ title, description, type: "warning" });

export const notifyError = (title: string, description?: string) =>
  notify({ title, description, type: "error" });

export const notifyBrand = (title: string, description?: string) =>
  notify({ title, description, type: "brand" });

export const notifyGray = (title: string, description?: string) =>
  notify({ title, description, type: "gray" });
