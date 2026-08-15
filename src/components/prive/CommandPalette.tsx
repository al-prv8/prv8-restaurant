import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, Sparkles, ArrowRight, X } from "lucide-react";
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

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [aiAnswer, setAiAnswer] = useState<PriveAnswer | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { state, derived } = usePrive();
  const navigate = useNavigate();

  const filteredModules = COMMAND_MODULES.filter(
    (m) =>
      m.label.toLowerCase().includes(query.toLowerCase()) ||
      m.group.toLowerCase().includes(query.toLowerCase()) ||
      m.keywords.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) onClose();
        else setQuery("");
      }
      if (e.key === "Escape" && open) {
        onClose();
      }
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

  const handleSelectRoute = (to: string) => {
    onClose();
    navigate({ to });
  };

  const currentSuggestions = SUGGESTIONS[state.persona] ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/40 backdrop-blur-sm transition-all animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[#101828]/12 bg-white text-[#101828] shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* White Search Bar Header */}
        <div className="relative flex items-center border-b border-[#101828]/10 bg-white px-4 py-3.5">
          <Search className="size-5 shrink-0 text-[#101828]/40" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setAiAnswer(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (
                  query.trim() &&
                  (query.includes("?") ||
                    query.toLowerCase().startsWith("why") ||
                    query.toLowerCase().startsWith("how") ||
                    query.toLowerCase().startsWith("can"))
                ) {
                  handleAsk(query);
                } else if (filteredModules[selectedIndex]) {
                  handleSelectRoute(filteredModules[selectedIndex].to);
                }
              }
            }}
            placeholder="Search modules or ask Privé a question (e.g. 'Why is labor high?')..."
            className="flex-1 bg-white px-3 text-sm font-medium text-[#101828] placeholder-[#101828]/40 outline-none"
            autoFocus
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setAiAnswer(null);
              }}
              className="mr-2 text-xs font-semibold text-[#101828]/40 hover:text-[#101828]"
            >
              Clear
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-[#101828]/40 hover:bg-[#101828]/5 hover:text-[#101828]"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Ask Privé Answer Box */}
        {aiAnswer ? (
          <div className="border-b border-[#101828]/10 bg-[#FAFAFC] p-4 text-xs space-y-3">
            <div className="flex items-center gap-2 text-[#101828] font-bold text-[11px] uppercase tracking-wider">
              <Sparkles className="size-3.5 text-[#0F9D8A]" /> Ask Privé Cognitive Answer
            </div>
            <p className="text-sm font-semibold leading-relaxed text-[#101828]">{aiAnswer.answer}</p>

            {aiAnswer.evidence && aiAnswer.evidence.length > 0 ? (
              <div className="space-y-1 rounded-lg bg-white border border-[#101828]/10 p-2.5">
                <span className="text-[10px] font-bold uppercase text-[#101828]/50">Evidence:</span>
                {aiAnswer.evidence.map((ev, i) => (
                  <div key={i} className="text-[#101828]/80">• {ev}</div>
                ))}
              </div>
            ) : null}

            {aiAnswer.recommendation ? (
              <div className="rounded-lg border border-[#0F9D8A]/30 bg-[#0F9D8A]/10 p-2.5 text-[#0B7A6C] font-medium">
                💡 <span className="font-bold">Recommendation:</span> {aiAnswer.recommendation}
              </div>
            ) : null}

            <div className="flex items-center justify-between text-[10px] text-[#101828]/50 pt-1">
              <span>Sources: {aiAnswer.sources.join(" · ")}</span>
              {aiAnswer.confidence ? (
                <span className="font-bold text-[#0F9D8A]">{aiAnswer.confidence} confidence</span>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* Results List */}
        <div className="max-h-[340px] overflow-y-auto p-2 space-y-3 bg-white">
          {/* Quick AI Suggestion Pills */}
          {!query && !aiAnswer ? (
            <div className="px-2 pt-1 pb-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#101828]/40 mb-2 flex items-center gap-1.5">
                <Sparkles className="size-3 text-[#0F9D8A]" /> Quick Ask Privé Suggestions ({state.persona.toUpperCase()})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {currentSuggestions.map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => {
                      setQuery(sug);
                      handleAsk(sug);
                    }}
                    className="rounded-full border border-[#101828]/12 bg-[#F9FAFB] px-3 py-1 text-[11px] font-medium text-[#101828]/80 hover:bg-[#101828]/5 hover:text-[#101828] transition-all text-left"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {/* Module Links */}
          <div className="space-y-1">
            <p className="px-2.5 text-[10px] font-extrabold uppercase tracking-wider text-[#101828]/40">
              Workspace Modules ({filteredModules.length})
            </p>
            {filteredModules.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.to}
                  type="button"
                  onClick={() => handleSelectRoute(item.to)}
                  className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition-all group ${
                    isSelected ? "bg-[#5146E5]/10 text-[#5146E5]" : "hover:bg-[#101828]/5 text-[#101828]"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-semibold transition-colors ${
                        isSelected ? "bg-[#5146E5] text-white" : "bg-[#101828]/5 text-[#101828]/70"
                      }`}
                    >
                      {item.group}
                    </span>
                    <span className={`font-semibold truncate ${isSelected ? "text-[#5146E5]" : "text-[#101828]"}`}>
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[#101828]/40 group-hover:text-[#101828]">
                    <span className="text-[11px]">{item.to}</span>
                    <ArrowRight className="size-3.5" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#101828]/10 bg-[#FAFAFC] px-4 py-2.5 text-[11px] text-[#101828]/50">
          <div className="flex items-center gap-3">
            <span>Press <kbd className="rounded border border-[#101828]/15 bg-white px-1 py-0.5 text-[10px] text-[#101828]">Enter</kbd> to ask AI</span>
            <span>Use <kbd className="rounded border border-[#101828]/15 bg-white px-1 py-0.5 text-[10px] text-[#101828]">Esc</kbd> to close</span>
          </div>
          <span className="font-semibold text-[#101828]/60">Privé Intelligence Layer</span>
        </div>
      </div>
    </div>
  );
}
