"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, X } from "lucide-react";
import { usePrive } from "../../lib/prive/store";
import { askPrive, SUGGESTIONS, type PriveAnswer } from "../../lib/prive/askPrive";

const COMMAND_MODULES = [
  { group: "General Manager", label: "Command Center & Brief", to: "/gm/home", keywords: "gm home brief readiness forecast" },
  { group: "General Manager", label: "Staffing & Labor Coverage", to: "/gm/staffing", keywords: "staffing gap shift schedule overtime" },
  { group: "General Manager", label: "Inventory Depletion Risk", to: "/gm/inventory", keywords: "inventory potatoes stockout supplier order transfer" },
  { group: "General Manager", label: "Guest Complaint Center", to: "/gm/guests", keywords: "complaints guest recovery credit refund" },
  { group: "General Manager", label: "Workforce & Onboarding", to: "/gm/workforce", keywords: "workforce employee separation onboarding i9" },
  { group: "General Manager", label: "Cleanliness & Facility Score", to: "/gm/facility", keywords: "facility cleanliness score kitchen restrooms" },
  { group: "General Manager", label: "Corporate Communications", to: "/gm/communications", keywords: "communications corporate policy announcement" },
  { group: "General Manager", label: "Pending Approvals Queue", to: "/gm/approvals", keywords: "approvals pending queue decisions" },

  { group: "Employee", label: "Today's Shift & Greeting", to: "/employee/home", keywords: "employee shift maya today" },
  { group: "Employee", label: "Training & Certification", to: "/employee/training", keywords: "training allergen servsafe onboarding" },
  { group: "Employee", label: "Schedule & Shift Pickup", to: "/employee/schedule", keywords: "schedule saturday shift pickup open" },
  { group: "Employee", label: "Policy Q&A & Knowledge Base", to: "/employee/announcements", keywords: "policy gluten timeoff closing fryer" },

  { group: "Regional Director", label: "Carolinas Portfolio Health", to: "/regional/portfolio", keywords: "regional portfolio locations health stores" },
  { group: "Regional Director", label: "Regional Intelligence & Root Cause", to: "/regional/intelligence", keywords: "intelligence correlation charlotte troubled" },
  { group: "Regional Director", label: "Supply Chain & Transfer Risk", to: "/regional/supply-chain", keywords: "supply chain avocado supplier delivery" },

  { group: "Executive", label: "Enterprise Pulse & KPIs", to: "/executive/pulse", keywords: "executive pulse margin revenue ebitda" },
  { group: "Executive", label: "What-If Scenario Engine", to: "/executive/scenario", keywords: "scenario what-if traffic slider forecast" },
  { group: "Executive", label: "Portfolio Performance Table", to: "/executive/portfolio", keywords: "portfolio ranking stores metrics" },

  { group: "Guest", label: "Voice AI Call Simulation", to: "/guest/service", keywords: "guest voice ai call order missing" },
  { group: "Guest", label: "Digital Recovery Credits", to: "/guest/credits", keywords: "gift credits redeem code single-use" },

  { group: "System", label: "Integrations & Audit Trail", to: "/integrations", keywords: "integrations toast paycor restaurant365 audit log" },
];

// Group colour chips (neutral, no purple)
const GROUP_COLORS: Record<string, string> = {
  "General Manager": "bg-[#881337]/8 text-[#881337]",
  Employee: "bg-[#B45309]/8 text-[#B45309]",
  "Regional Director": "bg-[#15803D]/8 text-[#15803D]",
  Executive: "bg-[#1C1917]/8 text-white",
  Guest: "bg-[#B91C1C]/8 text-[#B91C1C]",
  System: "bg-[#78716C]/8 text-white/55",
};

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [aiAnswer, setAiAnswer] = useState<PriveAnswer | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { state, derived } = usePrive();
  const router = useRouter();

  const filteredModules = COMMAND_MODULES.filter(
    (m) =>
      m.label.toLowerCase().includes(query.toLowerCase()) ||
      m.group.toLowerCase().includes(query.toLowerCase()) ||
      m.keywords.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => { setSelectedIndex(0); }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) onClose(); else setQuery("");
      }
      if (e.key === "Escape" && open) onClose();
      if (open) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((idx) => (idx + 1) % Math.max(1, filteredModules.length));
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex((idx) => (idx - 1 + filteredModules.length) % Math.max(1, filteredModules.length));
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, filteredModules.length]);

  if (!open) return null;

  const handleAsk = (qStr: string) => {
    const ans = askPrive(qStr, state.persona, derived);
    setAiAnswer(ans);
  };

  const handleSelectRoute = (to: string) => { onClose(); router.push(to); };
  const currentSuggestions = SUGGESTIONS[state.persona] ?? [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/40 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[#E7E5E0] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search header */}
        <div className="relative flex items-center border-b border-[#E7E5E0] bg-white px-4 py-3.5">
          <Search className="size-5 shrink-0 text-white/40" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setAiAnswer(null); }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (query.trim() && (query.includes("?") || query.toLowerCase().startsWith("why") || query.toLowerCase().startsWith("how") || query.toLowerCase().startsWith("can"))) {
                  handleAsk(query);
                } else if (filteredModules[selectedIndex]) {
                  handleSelectRoute(filteredModules[selectedIndex].to);
                }
              }
            }}
            placeholder="Search modules or ask Privé (e.g. 'Why is labor high?')…"
            className="flex-1 bg-transparent px-3 text-[13px] font-medium text-white placeholder-[#A8A29E] outline-none"
            autoFocus
          />
          {query ? (
            <button
              type="button"
              onClick={() => { setQuery(""); setAiAnswer(null); }}
              className="mr-2 text-[12px] font-semibold text-white/40 hover:text-white transition-colors"
            >
              Clear
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-white/40 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* AI answer box */}
        {aiAnswer ? (
          <div className="border-b border-white/10 bg-white/8 p-4 space-y-3">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[#881337]">
              <span>✦</span> Privé Answer
            </div>
            <p className="text-[13px] font-semibold leading-relaxed text-white">{aiAnswer.answer}</p>
            {aiAnswer.evidence && aiAnswer.evidence.length > 0 ? (
              <div className="rounded-lg bg-white border border-[#E7E5E0] p-2.5 space-y-1">
                <span className="text-[10px] font-bold uppercase text-white/40">Evidence:</span>
                {aiAnswer.evidence.map((ev, i) => (
                  <div key={i} className="text-[12px] font-medium text-white">• {ev}</div>
                ))}
              </div>
            ) : null}
            {aiAnswer.recommendation ? (
              <div className="rounded-lg border border-[#15803D]/25 bg-[#15803D]/6 p-2.5 text-[12px] font-medium text-[#15803D]">
                <span className="font-bold">Recommendation:</span> {aiAnswer.recommendation}
              </div>
            ) : null}
            <div className="flex items-center justify-between text-[11px] text-white/40">
              <span>Sources: {aiAnswer.sources.join(" · ")}</span>
              {aiAnswer.confidence ? (
                <span className="font-bold text-[#15803D]">{aiAnswer.confidence} confidence</span>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* Results */}
        <div className="max-h-[360px] overflow-y-auto bg-white">
          {/* Suggestion pills */}
          {!query && !aiAnswer ? (
            <div className="px-4 pt-3 pb-2 border-b border-[#F5F4F0]">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40 mb-2">
                Quick Ask ({state.persona.toUpperCase()})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {currentSuggestions.map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => { setQuery(sug); handleAsk(sug); }}
                    className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white/80 hover:bg-white/20 hover:text-[#881337] transition-all"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {/* Module list */}
          <div className="p-2 space-y-0.5">
            <p className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">
              Workspace Modules ({filteredModules.length})
            </p>
            {filteredModules.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const chipClass = GROUP_COLORS[item.group] ?? "bg-[#1C1917]/6 text-white/80";
              return (
                <button
                  key={item.to}
                  type="button"
                  onClick={() => handleSelectRoute(item.to)}
                  className={`w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-[13px] transition-all group ${
                    isSelected ? "bg-[#881337]/8 text-[#881337]" : "hover:bg-white/10 text-white"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold shrink-0 ${chipClass}`}>
                      {item.group}
                    </span>
                    <span className={`font-semibold truncate ${isSelected ? "text-[#881337]" : "text-white"}`}>
                      {item.label}
                    </span>
                  </div>
                  <div className={`flex items-center gap-1 shrink-0 transition-colors ${isSelected ? "text-[#881337]" : "text-white/40 group-hover:text-white/80"}`}>
                    <span className="text-[11px] hidden sm:inline">{item.to}</span>
                    <ArrowRight className="size-3.5" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/10 bg-white/8 px-4 py-2.5 text-[11px] text-white/40">
          <div className="flex items-center gap-3">
            <span>
              Press <kbd className="rounded border border-[#E7E5E0] bg-white px-1 py-0.5 text-[10px] text-white/80">Enter</kbd> to navigate or ask
            </span>
            <span>
              <kbd className="rounded border border-[#E7E5E0] bg-white px-1 py-0.5 text-[10px] text-white/80">Esc</kbd> to close
            </span>
          </div>
          <span className="font-semibold text-[#881337]">Privé</span>
        </div>
      </div>
    </div>
  );
}
