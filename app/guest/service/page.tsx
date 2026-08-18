"use client";

import { useState, useEffect } from "react";
import { Volume2, Pause, Radio, PhoneCall, Mic } from "lucide-react";
import { SectionTitle, Pill, Pagination } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";
import { GM_RESTAURANT_ID, TODAY, iso } from "@/lib/prive/data";
import { AskPriveConsole } from "@/components/prive/AskPrive";

const statusTone = (s: string) =>
  s === "Resolved" ? "teal" : s === "Escalated" ? "violet" : s === "Rejected" ? "neutral" : "amber";

function AudioWaveform({ active, speaker }: { active: boolean; speaker: "ai" | "guest" | null }) {
  const bars = [24, 45, 68, 30, 85, 52, 95, 60, 40, 80, 55, 35, 75, 45, 65, 25, 50, 82, 40, 20];

  return (
    <div className="relative overflow-hidden flex items-center justify-between gap-1 h-14 px-5 rounded-2xl bg-[#1C1917] border border-white/15 shadow-2xl my-4">
      <div className="flex items-center gap-2 text-xs font-bold text-white min-w-[120px]">
        {active ? (
          <>
            <span className={`size-2.5 rounded-full animate-ping ${speaker === "ai" ? "bg-[#4ADE80]" : "bg-[#F87171]"}`} />
            <span className={speaker === "ai" ? "text-[#4ADE80]" : "text-[#F87171]"}>
              {speaker === "ai" ? "Privé Voice AI" : "Priya (Guest)"}
            </span>
          </>
        ) : (
          <span className="text-[#A8A29E] flex items-center gap-1.5"><Mic className="size-3.5" /> Standby</span>
        )}
      </div>

      <div className="flex items-center justify-center gap-1.5 h-full flex-1 max-w-xs px-4">
        {bars.map((height, i) => (
          <span
            key={i}
            className={`w-1 rounded-full transition-all duration-150 ${
              active
                ? speaker === "ai"
                  ? "bg-[#4ADE80] animate-pulse"
                  : "bg-[#F87171] animate-bounce"
                : "bg-white/20 h-1.5"
            }`}
            style={{
              height: active ? `${Math.max(8, height * 0.45)}px` : "6px",
              animationDelay: active ? `${(i * 70) % 500}ms` : "0ms",
            }}
          />
        ))}
      </div>

      <div className="text-[10px] font-bold uppercase tracking-widest text-white/60 text-right">
        {active ? (speaker === "ai" ? "Synthesizing" : "Live Audio") : "Ready"}
      </div>
    </div>
  );
}

export default function GuestServicePage() {
  const { state, derived: d, dispatch } = usePrive();
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSpeaker, setActiveSpeaker] = useState<"ai" | "guest" | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  const liveComplaint = state.complaints.find((c) => c.id.startsWith("c-live-"));
  const totalPages = Math.ceil(d.gmComplaints.length / pageSize);
  const paginatedComplaints = d.gmComplaints.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const playVoiceCall = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setActiveSpeaker(null);
      return;
    }

    window.speechSynthesis.cancel();
    setIsPlaying(true);

    const script = [
      { speaker: "ai" as const, text: "Thank you for calling The Morning Table, Ballantyne location. How can I help you today?", pitch: 1.1, rate: 0.95 },
      { speaker: "guest" as const, text: "Hi, I ordered curbside pickup earlier and two sides of bacon were missing.", pitch: 0.9, rate: 1.0 },
      { speaker: "ai" as const, text: "I'm sorry about that, Priya. I found your order ORD-51993 from 9:42 AM. I'm creating a service case now and routing it to your location's general manager for review. You'll hear back within the hour.", pitch: 1.1, rate: 0.95 },
    ];

    const voices = window.speechSynthesis.getVoices();
    let currentIdx = 0;

    const speakNext = () => {
      if (currentIdx >= script.length) {
        setIsPlaying(false);
        setActiveSpeaker(null);
        return;
      }

      const item = script[currentIdx]!;
      setActiveSpeaker(item.speaker);

      const utterance = new SpeechSynthesisUtterance(item.text);
      utterance.pitch = item.pitch;
      utterance.rate = item.rate;

      if (voices.length > 0) {
        if (item.speaker === "ai") {
          utterance.voice = voices.find((v) => v.lang.startsWith("en") && (v.name.includes("Female") || v.name.includes("Samantha") || v.name.includes("Zira") || v.name.includes("Google"))) || voices[0] || null;
        } else {
          utterance.voice = voices.find((v) => v.lang.startsWith("en") && (v.name.includes("Male") || v.name.includes("Alex") || v.name.includes("David"))) || voices[1] || voices[0] || null;
        }
      }

      utterance.onend = () => {
        currentIdx++;
        setTimeout(speakNext, 300);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        setActiveSpeaker(null);
      };

      window.speechSynthesis.speak(utterance);
    };

    speakNext();
  };

  const logComplaint = () =>
    dispatch({
      type: "createComplaint",
      complaint: {
        id: `c-live-${state.complaints.length + 1}`,
        customer: "Priya Raman",
        restaurantId: GM_RESTAURANT_ID,
        date: iso(TODAY),
        channel: "Voice",
        type: "Missing item",
        summary: "Two sides of bacon missing from a curbside pickup order placed at 9:42 AM.",
        sentiment: "Negative",
        severity: "Medium",
        status: "Awaiting Approval",
        orderRef: "ORD-51993",
        recommendedCredit: 15,
        draftResponse:
          "Hi Priya, I'm sorry your order was incomplete, that's on us. I've flagged it with the expo team on duty. I'd like to make it right with a $AMOUNT dining credit and personally welcome you back on your next visit.\n\nGeneral Manager, The Morning Table",
      },
    });

  return (
    <>
      {/* Consumer Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight text-[#1C1917]">How can we help you?</h1>
        <p className="mt-1 text-sm text-[#78716C]">
          Our AI handles your request instantly, a manager reviews every resolution before it&apos;s sent.
        </p>
      </div>

      {/* Single-column consumer layout */}
      <div className="space-y-5">
        {/* Voice AI Call Simulator */}
        <div className="rounded-2xl bg-[#1C1917] border border-white/10 shadow-xl p-5 relative overflow-hidden text-white">
          <div className="flex items-center justify-between gap-3 mb-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-[#881337] flex items-center justify-center text-white font-black shadow-md">
                <PhoneCall className="size-4" />
              </div>
              <div>
                <div className="text-sm font-black text-white">Privé Voice AI</div>
                <div className="text-xs text-white/50 font-medium">Caller: Priya Raman · ORD-51993</div>
              </div>
            </div>
            {isPlaying ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#881337] px-3 py-1 text-xs font-bold text-white animate-pulse">
                <Radio className="size-3" /> Live
              </span>
            ) : (
              <span className="text-[11px] font-bold text-white/40">Ready</span>
            )}
          </div>

          <AudioWaveform active={isPlaying} speaker={activeSpeaker} />

          <div className="rounded-xl bg-black/40 border border-white/8 p-4 font-mono text-xs leading-relaxed space-y-3 mt-4">
            <div className={`rounded-lg p-3 transition-all ${activeSpeaker === "ai" ? "bg-[#881337]/40 ring-1 ring-[#881337]" : "opacity-60"}`}>
              <span className="font-bold text-[#4ADE80] text-[10px] block mb-1 uppercase tracking-wider">✦ Privé Voice AI</span>
              &ldquo;Thank you for calling The Morning Table, Ballantyne location. How can I help you today?&rdquo;
            </div>
            <div className={`rounded-lg p-3 transition-all ${activeSpeaker === "guest" ? "bg-white/10 ring-1 ring-white/20" : "opacity-60"}`}>
              <span className="font-bold text-[#F87171] text-[10px] block mb-1 uppercase tracking-wider">👤 Guest (Priya)</span>
              &ldquo;Hi, I ordered curbside pickup earlier and two sides of bacon were missing.&rdquo;
            </div>
            <div className={`rounded-lg p-3 transition-all ${activeSpeaker === "ai" ? "bg-[#881337]/40 ring-1 ring-[#881337]" : "opacity-60"}`}>
              <span className="font-bold text-[#4ADE80] text-[10px] block mb-1 uppercase tracking-wider">✦ Privé Voice AI</span>
              &ldquo;I&apos;m sorry about that, Priya. I found your order ORD-51993. I&apos;m routing this to your location&apos;s manager now. You&apos;ll hear back within the hour.&rdquo;
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={playVoiceCall}
              className="flex-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 px-4 py-3 text-xs font-bold text-white transition-all flex items-center justify-center gap-2"
            >
              {isPlaying ? <Pause className="size-4" /> : <Volume2 className="size-4" />}
              {isPlaying ? "Pause" : "Play Recording"}
            </button>
            <button
              onClick={logComplaint}
              disabled={!!liveComplaint}
              className={`flex-1 rounded-xl px-4 py-3 text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                liveComplaint ? "bg-[#15803D] text-white cursor-not-allowed" : "bg-[#881337] text-white hover:bg-[#6B0F2A]"
              }`}
            >
              {liveComplaint ? "✓ Case Sent to Manager" : "Log This Case"}
            </button>
          </div>
        </div>

        {/* Live Case Tracking */}
        {liveComplaint && (
          <div className="rounded-xl bg-white border border-[#E7E5E0] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#A8A29E]">Active Case</span>
              <Pill tone={statusTone(liveComplaint.status) as "amber"}>
                {liveComplaint.status === "Awaiting Approval" ? "GM Reviewing" : liveComplaint.status}
              </Pill>
            </div>
            <p className="font-bold text-[#1C1917] mb-1">{liveComplaint.customer}</p>
            <p className="text-xs text-[#78716C] mb-3">{liveComplaint.type} · Order {liveComplaint.orderRef}</p>
            <div className="bg-[#FAFAF8] p-3 rounded-lg border border-[#E7E5E0]">
              <p className="text-sm text-[#1C1917]">{liveComplaint.summary}</p>
            </div>
            <div className="mt-3 rounded-lg bg-[#FFFBEB] border border-[#F59E0B]/30 p-3 text-xs font-medium text-[#92400E]">
              Your manager is reviewing a recovery recommendation. You&apos;ll be notified when it&apos;s approved.
            </div>
          </div>
        )}

        {/* Ask Privé */}
        <div className="rounded-xl bg-white border border-[#E7E5E0] p-5 shadow-sm">
          <p className="text-sm font-bold text-[#1C1917] mb-1">Have a question?</p>
          <p className="text-xs text-[#78716C] mb-4">Ask about your order, hours, or anything else.</p>
          <AskPriveConsole persona="guest" compact />
        </div>

        {/* Past Issues */}
        <div className="rounded-xl bg-white border border-[#E7E5E0] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-[#1C1917]">Recent Cases</p>
            <span className="text-[11px] font-bold text-[#A8A29E]">{d.gmComplaints.length} total</span>
          </div>
          <div className="flex flex-col divide-y divide-[#F3F2F0]">
            {paginatedComplaints.map((c) => (
              <div key={c.id} className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div>
                  <span className="text-[13px] font-bold text-[#1C1917]">{c.customer}</span>
                  <p className="mt-0.5 text-xs text-[#78716C]">{c.type} · {c.channel}</p>
                </div>
                <Pill tone={statusTone(c.status) as "amber"}>{c.status}</Pill>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={d.gmComplaints.length} pageSize={pageSize} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
