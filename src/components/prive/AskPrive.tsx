"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle, Loader2, X, Sparkles, Send } from "lucide-react";
import { SUGGESTIONS, askPrive, type PriveAnswer } from "@/lib/prive/askPrive";
import { usePrive, type Persona } from "@/lib/prive/store";
import { Button, ConfidenceTag, Pill, Skeleton } from "./ui";

interface Turn {
  q: string;
  a: PriveAnswer;
  actionDone?: boolean;
}

// ─── AskPriveConsole ──────────────────────────────────────────────────────────
export function AskPriveConsole({ persona, compact = false }: { persona: Persona; compact?: boolean }) {
  const { derived, state, dispatch } = usePrive();
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [thinkingQuery, setThinkingQuery] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Consume pendingQuestion injected by quick-action buttons
  useEffect(() => {
    if (state.pendingQuestion) {
      ask(state.pendingQuestion);
      dispatch({ type: "clearPendingQuestion" });
    }
  }, [state.pendingQuestion]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns, thinking]);

  function ask(question: string) {
    const q = question.trim();
    if (!q || thinking) return;
    setThinking(true);
    setThinkingQuery(q);
    setInput("");
    setTimeout(() => {
      const answer = askPrive(q, persona, derived);
      setTurns((t) => [...t, { q, a: answer }]);
      setThinking(false);
      setThinkingQuery("");
    }, 450);
  }

  function handleActionClick(turnIdx: number, turn: Turn) {
    const a = turn.a;
    if (a.actionType === "potatoOrderIncrease") {
      dispatch({ type: "increasePotatoOrder", lbs: 35 });
    } else if (a.actionType === "approveStaffing") {
      dispatch({ type: "approveStaffing" });
    } else if (a.actionType === "openRoute" && a.actionPayload) {
      router.push(a.actionPayload);
    }
    setTurns((prev) =>
      prev.map((t, idx) => (idx === turnIdx ? { ...t, actionDone: true } : t))
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className={`flex-1 space-y-4 overflow-y-auto ${compact ? "" : "pr-1"}`}>
        {/* Empty state — suggestions */}
        {turns.length === 0 && !thinking ? (
          <div className="relative overflow-hidden rounded-2xl bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] ring-1 ring-black/[0.03] before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/90 before:to-transparent p-5">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[#881337] mb-2">
              <Sparkles className="size-3.5" /> Privé Intelligence Console
            </div>
            <p className="text-[13px] font-medium text-[#78716C] leading-relaxed">
              Ask Privé anything about POS sales, inventory velocity, staffing coverage, guest complaints, training, or financial margins.
            </p>
            <div className="mt-3.5 flex flex-wrap gap-2">
              {SUGGESTIONS[persona].map((s) => (
                <button
                  key={s}
                  onClick={() => ask(s)}
                  className="rounded-full border border-[#881337]/20 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 text-[12px] font-medium text-[#881337] hover:bg-[#881337] hover:text-white transition-all shadow-xs text-left"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {/* Conversation turns */}
        {turns.map((t, i) => (
          <div key={i} className="space-y-2">
            {/* User message */}
            <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-[#1C1917] px-4 py-2.5 text-[13px] text-white font-medium shadow-md">
              {t.q}
            </div>

            {/* Privé response */}
            <div className="relative overflow-hidden rounded-2xl rounded-bl-sm bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] ring-1 ring-black/[0.03] before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/90 before:to-transparent p-4 space-y-3">
              <div className="flex items-center justify-between gap-2 border-b border-[#E7E5E0] pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="grid size-6 place-items-center rounded-md bg-[#881337] text-[11px] font-black text-white shadow-xs">
                    P
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#881337]">
                    Privé
                  </span>
                </div>
                {t.a.confidence ? <ConfidenceTag level={t.a.confidence} /> : null}
              </div>

              <p className="whitespace-pre-line text-[13px] font-medium leading-relaxed text-[#1C1917]">
                {t.a.answer}
              </p>

              {t.a.evidence?.length ? (
                <div className="rounded-xl bg-white/50 backdrop-blur-sm border border-white/60 p-3 space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#A8A29E]">
                    Live System Evidence
                  </div>
                  <ul className="space-y-1">
                    {t.a.evidence.map((e) => (
                      <li key={e} className="flex items-start gap-2 text-[12px] font-medium text-[#44403C]">
                        <span className="mt-[5px] size-1.5 shrink-0 rounded-full bg-[#881337]" />
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {t.a.forecast ? (
                <div className="rounded-lg border border-[#15803D]/25 bg-[#15803D]/8 p-3 text-[12px] text-[#15803D]">
                  <span className="font-bold uppercase tracking-wider text-[10px]">Forecast · </span>
                  <span className="font-semibold">{t.a.forecast}</span>
                </div>
              ) : null}

              {t.a.action && t.a.actionType ? (
                <div className="pt-2">
                  {t.actionDone ? (
                    <div className="flex items-center gap-2 rounded-xl bg-[#15803D]/10 p-3 text-[12px] font-bold text-[#15803D]">
                      <CheckCircle className="size-4 shrink-0" />
                      Action executed & recorded in audit ledger
                    </div>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={() => handleActionClick(i, t)}
                      className="w-full bg-[#881337] text-white hover:bg-[#6B0F2A] font-bold text-xs py-2.5 rounded-xl border-none shadow-sm"
                    >
                      {t.a.action}
                      <ArrowRight className="size-3.5 ml-1.5" />
                    </Button>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        ))}

        {/* Thinking state */}
        {thinking ? (
          <div className="space-y-2 animate-in fade-in duration-150">
            <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-[#1C1917] px-4 py-2.5 text-[13px] text-white font-medium">
              {thinkingQuery}
            </div>
            <div className="relative overflow-hidden rounded-2xl rounded-bl-sm bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] ring-1 ring-black/[0.03] p-4 space-y-3">
              <div className="flex items-center gap-2.5 text-[12px] font-semibold text-[#881337]">
                <Loader2 className="size-4 animate-spin text-[#881337]" />
                Privé is analyzing live POS, inventory & scheduling data…
              </div>
              <div className="space-y-2 pt-1">
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>
          </div>
        ) : null}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => { e.preventDefault(); ask(input); }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Privé anything (e.g. 'Can we handle tomorrow?')..."
          className="w-full rounded-xl bg-white/70 backdrop-blur-md border border-white/80 px-3.5 py-2.5 text-[13px] font-medium text-[#1C1917] placeholder-[#A8A29E] outline-none focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/15 shadow-sm transition-all"
        />
        <Button type="submit" variant="primary" disabled={thinking} className="rounded-xl px-5 shrink-0 shadow-md bg-[#881337] text-white hover:bg-[#6B0F2A] border-none font-bold">
          Ask
        </Button>
      </form>
      <p className="mt-2 text-[11px] font-medium text-[#78716C]">
        Privé operates under human-in-the-loop governance. Consequential actions require GM confirmation.
      </p>
    </div>
  );
}

// ─── AskPriveDrawer ───────────────────────────────────────────────────────────
export function AskPriveDrawer({
  persona,
  open,
  onClose,
}: {
  persona: Persona;
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative flex h-full w-full max-w-md flex-col bg-[#F7F5F2] border-l border-[#E7E5E0] p-6 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer header */}
        <div className="mb-4 flex items-center justify-between border-b border-[#E7E5E0] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-md bg-[#881337] text-[11px] font-black text-white">P</span>
              <div className="text-[14px] font-bold text-[#1C1917]">Privé Intelligence</div>
            </div>
            <div className="mt-0.5 text-[11px] font-medium text-[#78716C] capitalize pl-8">
              {persona} · role-scoped live data
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-[#E7E5E0] bg-white p-1.5 text-[#78716C] hover:text-[#1C1917] transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>
        <AskPriveConsole persona={persona} compact />
      </div>
    </div>
  );
}
