import { useState, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Sparkles, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { SUGGESTIONS, askPrive, type PriveAnswer } from "@/lib/prive/askPrive";
import { usePrive, type Persona } from "@/lib/prive/store";
import { Button, ConfidenceTag, Pill, Skeleton } from "./ui";

interface Turn {
  q: string;
  a: PriveAnswer;
  actionDone?: boolean;
}

export function AskPriveConsole({ persona, compact = false }: { persona: Persona; compact?: boolean }) {
  const { derived, state, dispatch } = usePrive();
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [thinkingQuery, setThinkingQuery] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Consume pendingQuestion injected by quick-action buttons (e.g. "Can we handle tomorrow?")
  useEffect(() => {
    if (state.pendingQuestion) {
      ask(state.pendingQuestion);
      dispatch({ type: "clearPendingQuestion" });
    }
  }, [state.pendingQuestion]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll to latest turn
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns, thinking]);

  function ask(question: string) {
    const q = question.trim();
    if (!q || thinking) return;

    setThinking(true);
    setThinkingQuery(q);
    setInput("");

    // Simulate realistic Cognitive Intelligence Layer processing (450ms)
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
      dispatch({ type: "potatoOrderIncrease" });
    } else if (a.actionType === "approveStaffing") {
      dispatch({ type: "approveStaffing" });
    } else if (a.actionType === "openRoute" && a.actionPayload) {
      navigate({ to: a.actionPayload });
    }

    setTurns((prev) =>
      prev.map((t, idx) => (idx === turnIdx ? { ...t, actionDone: true } : t))
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className={`flex-1 space-y-4 overflow-y-auto ${compact ? "" : "pr-1"}`}>
        {turns.length === 0 && !thinking ? (
          <div className="rounded-xl border border-[#7C3AED]/20 bg-[#7C3AED]/[0.04] p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#7C3AED] mb-1">
              <Sparkles className="size-3.5" /> Privé Cognitive Engine Active
            </div>
            <p className="text-sm text-[#101828]/70">
              Ask Privé anything about POS sales, inventory velocity, staffing coverage, guest complaints, training, or financial margins.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {SUGGESTIONS[persona].map((s) => (
                <button
                  key={s}
                  onClick={() => ask(s)}
                  className="rounded-full border border-[#7C3AED]/25 bg-white px-3 py-1.5 text-xs font-medium text-[#7C3AED] hover:bg-[#7C3AED]/8 transition-all text-left"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {turns.map((t, i) => (
          <div key={i} className="space-y-2">
            <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-[#101828] px-4 py-2 text-sm text-white font-medium shadow-xs">
              {t.q}
            </div>
            <div className="rounded-2xl rounded-bl-sm border border-[#7C3AED]/20 bg-white p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between gap-2 border-b border-[#101828]/8 pb-2">
                <div className="flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-md bg-[#7C3AED] text-[11px] font-bold text-white shadow-xs">
                    P
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#7C3AED]">
                    Privé AI
                  </span>
                </div>
                {t.a.confidence ? <ConfidenceTag level={t.a.confidence} /> : null}
              </div>

              <p className="whitespace-pre-line text-sm font-medium leading-relaxed text-[#101828]">
                {t.a.answer}
              </p>

              {t.a.evidence?.length ? (
                <div className="rounded-xl bg-[#101828]/[0.03] border border-[#101828]/8 p-3 space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#101828]/45">
                    Live System Evidence
                  </div>
                  <ul className="space-y-1">
                    {t.a.evidence.map((e) => (
                      <li key={e} className="flex items-start gap-2 text-xs font-medium text-[#101828]/80">
                        <span className="mt-[5px] size-1.5 shrink-0 rounded-full bg-[#5146E5]" />
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {t.a.forecast ? (
                <div className="rounded-xl border border-[#0F9D8A]/30 bg-[#0F9D8A]/8 p-3 text-xs text-[#0B7A6C]">
                  <span className="font-bold uppercase tracking-wider text-[10px]">Forecast Signal · </span>
                  <span className="font-semibold">{t.a.forecast}</span>
                </div>
              ) : null}

              {t.a.recommendation ? (
                <div className="rounded-xl border border-[#5146E5]/25 bg-[#5146E5]/8 p-3 text-xs text-[#3f36bd]">
                  <span className="font-bold uppercase tracking-wider text-[10px]">AI Recommendation · </span>
                  <span className="font-semibold">{t.a.recommendation}</span>
                </div>
              ) : null}

              {/* Interactive 1-Click Action Trigger inside AI Response */}
              {t.a.action ? (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => handleActionClick(i, t)}
                    disabled={t.actionDone}
                    className={`w-full flex items-center justify-between rounded-xl px-4 py-2.5 text-xs font-bold transition-all shadow-xs ${
                      t.actionDone
                        ? "bg-[#0F9D8A]/10 border border-[#0F9D8A]/30 text-[#0B7A6C] cursor-default"
                        : "bg-[#7C3AED] text-white hover:bg-[#6d28d9] shadow-[#7C3AED]/20 active:scale-[0.98]"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {t.actionDone ? <CheckCircle className="size-4" /> : <Sparkles className="size-4" />}
                      {t.actionDone ? "Executed Successfully" : t.a.action}
                    </span>
                    {!t.actionDone ? <ArrowRight className="size-4" /> : null}
                  </button>
                </div>
              ) : null}

              <div className="flex flex-wrap items-center gap-1.5 border-t border-[#101828]/8 pt-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#101828]/40">
                  Data Feeds
                </span>
                {t.a.sources.map((s) => (
                  <Pill key={s}>{s}</Pill>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Real Cognitive Processing Thinking State */}
        {thinking ? (
          <div className="space-y-2 animate-in fade-in duration-150">
            <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-[#101828] px-4 py-2 text-sm text-white font-medium">
              {thinkingQuery}
            </div>
            <div className="rounded-2xl rounded-bl-sm border border-[#7C3AED]/25 bg-white p-4 shadow-xs space-y-3">
              <div className="flex items-center gap-2.5 text-xs font-bold text-[#7C3AED]">
                <Loader2 className="size-4 animate-spin text-[#7C3AED]" />
                <span>Privé Cognitive Layer is evaluating POS, inventory & scheduling data...</span>
              </div>
              <div className="space-y-2 pt-1">
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </div>
          </div>
        ) : null}

        <div ref={bottomRef} />
      </div>

      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Privé anything (e.g. 'Can we handle tomorrow?')..."
          className="w-full rounded-xl border border-[#101828]/15 bg-white px-3.5 py-2.5 text-sm font-medium outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/15 shadow-xs"
        />
        <Button type="submit" variant="violet" disabled={thinking} className="rounded-xl px-5">
          Ask
        </Button>
      </form>
      <p className="mt-2 text-[11px] text-[#101828]/40">
        Privé operates under human-in-the-loop governance. Consequential actions require GM confirmation.
      </p>
    </div>
  );
}

export function AskPriveDrawer({ persona }: { persona: Persona }) {
  const { state } = usePrive();
  const [open, setOpen] = useState(false);

  // Auto-open the drawer when a question is injected from a quick-action button
  useEffect(() => {
    if (state.pendingQuestion) {
      setOpen(true);
    }
  }, [state.pendingQuestion]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#7C3AED] px-5 py-3 text-sm font-bold text-white shadow-xl shadow-[#7C3AED]/30 hover:bg-[#6d28d9] transition-all hover:scale-105 active:scale-95"
      >
        <Sparkles className="size-4" />
        Ask Privé AI
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs" onClick={() => setOpen(false)}>
          <div
            className="flex h-full w-full max-w-md flex-col bg-[#F7F6F2] p-5 shadow-2xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between border-b border-[#101828]/10 pb-3">
              <div>
                <div className="text-base font-bold text-[#101828]">Privé Cognitive Console</div>
                <div className="text-xs font-semibold text-[#101828]/50 capitalize">{persona} context · role-scoped live data</div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg border border-[#101828]/10 bg-white px-2.5 py-1 text-xs font-semibold text-[#101828]/60 hover:bg-[#101828]/5 hover:text-[#101828]"
              >
                Close
              </button>
            </div>
            <AskPriveConsole persona={persona} compact />
          </div>
        </div>
      ) : null}
    </>
  );
}
