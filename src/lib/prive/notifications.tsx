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
      <div className="w-full max-w-[360px] rounded-2xl border border-[#101828]/12 bg-white p-3.5 shadow-xl shadow-[#101828]/8 transition-all flex items-center gap-3">
        {/* Left Badge / Avatar (Untitled UI style) */}
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar"
            className="size-9 rounded-full object-cover shrink-0 ring-2 ring-[#101828]/10"
          />
        ) : (
          <div
            className={`grid size-9 shrink-0 place-items-center rounded-xl border transition-colors my-auto ${
              type === "success"
                ? "border-[#0F9D8A]/30 bg-[#0F9D8A]/10 text-[#0F9D8A]"
                : type === "warning"
                ? "border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#B45309]"
                : type === "error"
                ? "border-[#DC3545]/30 bg-[#DC3545]/10 text-[#DC3545]"
                : type === "gray"
                ? "border-[#101828]/15 bg-[#101828]/5 text-[#101828]/70"
                : "border-[#5146E5]/30 bg-[#5146E5]/10 text-[#5146E5]"
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
            <h4 className="text-xs font-bold text-[#101828] leading-snug">{title}</h4>
            <button
              type="button"
              onClick={() => toast.dismiss(t)}
              className="text-[#101828]/35 hover:text-[#101828] text-xs font-bold transition-colors shrink-0 -mt-0.5"
              aria-label="Close notification"
            >
              ✕
            </button>
          </div>
          {description ? (
            <p className="mt-0.5 text-[11px] text-[#101828]/65 leading-relaxed">{description}</p>
          ) : null}

          {actionLabel ? (
            <div className="mt-2.5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onAction?.();
                  toast.dismiss(t);
                }}
                className="rounded-lg bg-[#5146E5] px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm hover:bg-[#4238cf] transition-all"
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
