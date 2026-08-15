"use client";

import { useState, useEffect } from "react";
import { Volume2, Pause, Radio, Gift, PhoneCall, Mic, UserCheck, CheckCircle2 } from "lucide-react";
import { Card, SectionTitle, Button, Pill, PriveIntelBanner, Pagination } from "@/components/prive/ui";
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
   { speaker: "ai" as const, text: "Thank you for calling The Morning Table — Ballantyne location. How can I help you today?", pitch: 1.1, rate: 0.95 },
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
     "Hi Priya, I'm sorry your order was incomplete — that's on us. I've flagged it with the expo team on duty. I'd like to make it right with a $AMOUNT dining credit and personally welcome you back on your next visit.\n\n— General Manager, The Morning Table",
   },
  });

 return (
  <>
   {/* Page Header */}
   <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
    <div>
     <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#881337] mb-1">
      24/7 AI Contact Intake · Guest Services
     </p>
     <h1 className="text-3xl font-black tracking-tight text-[#1C1917]">
      Voice AI Service Console
     </h1>
     <p className="mt-1 text-sm font-medium text-[#78716C]">
      Simulate inbound guest calls, inspect live speech synthesis, and route draft recoveries for GM sign-off.
     </p>
    </div>

    <div className="flex items-center gap-3">
     <span className="rounded-2xl bg-[#15803D]/10 text-[#15803D] border border-[#15803D]/30 px-4 py-2 text-xs font-bold flex items-center gap-1.5">
      <span className="size-2 rounded-full bg-[#15803D] animate-ping" /> 24/7 Voice AI Active
     </span>
    </div>
   </div>

   <div className="grid gap-6 lg:grid-cols-12">
    {/* Left Column — Call Simulator & Case Tracking */}
    <div className="space-y-6 lg:col-span-7">
     {/* High-End Voice AI Call Simulator Card */}
     <div className="rounded-3xl bg-[#1C1917] border border-white/15 shadow-2xl p-6 relative overflow-hidden text-white">
      <div className="flex items-center justify-between gap-3 mb-4 border-b border-white/10 pb-4">
       <div className="flex items-center gap-3">
        <div className="size-10 rounded-2xl bg-[#881337] flex items-center justify-center text-white font-black shadow-md">
         <PhoneCall className="size-5" />
        </div>
        <div>
         <div className="text-sm font-black text-white">Simulate Inbound Voice Call</div>
         <div className="text-xs text-white/50 font-medium">Ballantyne #02 · Caller: Priya Raman (ORD-51993)</div>
        </div>
       </div>

       {isPlaying ? (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#881337] px-3 py-1 text-xs font-bold text-white animate-pulse shadow-md">
         <Radio className="size-3.5" /> Live Call Active
        </span>
       ) : (
        <span className="text-xs font-bold text-white/40">Ready to Play</span>
       )}
      </div>

      {/* Audio Waveform Equalizer */}
      <AudioWaveform active={isPlaying} speaker={activeSpeaker} />

      {/* Transcript Terminal Container */}
      <div className="rounded-2xl bg-black/50 border border-white/10 p-5 font-mono text-xs leading-relaxed space-y-4 shadow-inner">
       <div className={`rounded-xl p-3 transition-all ${activeSpeaker === "ai" ? "bg-[#881337]/40 ring-1 ring-[#881337] text-white" : "text-white/70"}`}>
        <span className="font-bold text-[#4ADE80] uppercase tracking-wider text-[10px] block mb-1">✦ Privé Voice AI Agent</span>
        "Thank you for calling The Morning Table — Ballantyne location. How can I help you today?"
       </div>

       <div className={`rounded-xl p-3 transition-all ${activeSpeaker === "guest" ? "bg-[#881337]/40 ring-1 ring-[#881337] text-white" : "text-white/70"}`}>
        <span className="font-bold text-[#F87171] uppercase tracking-wider text-[10px] block mb-1">👤 Guest (Priya Raman)</span>
        "Hi, I ordered curbside pickup earlier and two sides of bacon were missing."
       </div>

       <div className={`rounded-xl p-3 transition-all ${activeSpeaker === "ai" ? "bg-[#881337]/40 ring-1 ring-[#881337] text-white" : "text-white/70"}`}>
        <span className="font-bold text-[#4ADE80] uppercase tracking-wider text-[10px] block mb-1">✦ Privé Voice AI Agent</span>
        "I'm sorry about that, Priya. I found your order ORD-51993 from 9:42 AM. I'm creating a service case now and routing it to your location's general manager for review. You'll hear back within the hour."
       </div>
      </div>

      {/* Control Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
       <button
        onClick={playVoiceCall}
        className="w-full sm:w-auto flex-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-3 text-xs font-bold text-white transition-all flex items-center justify-center gap-2"
       >
        {isPlaying ? <Pause className="size-4" /> : <Volume2 className="size-4" />}
        {isPlaying ? "Pause Recording" : "Play Audio Recording"}
       </button>

       <button
        onClick={logComplaint}
        disabled={!!liveComplaint}
        className={`w-full sm:w-auto flex-1 rounded-xl px-5 py-3 text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
         liveComplaint ? "bg-[#15803D] text-white cursor-not-allowed" : "bg-[#881337] text-white hover:bg-[#6B0F2A]"
        }`}
       >
        {liveComplaint ? "✓ Case Routed to GM Queue" : "Simulate Guest Call & Log Case"}
       </button>
      </div>
     </div>

     {/* Live Case Tracking Card */}
     {liveComplaint ? (
      <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5">
       <SectionTitle hint="Live Case Tracking">Active Guest Case</SectionTitle>
       <div className="mt-4">
        <div className="flex items-center justify-between gap-2 mb-2">
         <span className="text-xl font-black tracking-tight text-[#1C1917]">{liveComplaint.customer}</span>
         <Pill tone={statusTone(liveComplaint.status) as "amber"}>
          {liveComplaint.status === "Awaiting Approval" ? "GM Reviewing" : liveComplaint.status}
         </Pill>
        </div>
        <p className="text-xs font-bold text-[#78716C] mb-3">
         {liveComplaint.type} · Order {liveComplaint.orderRef} · {liveComplaint.channel}
        </p>
        <div className="bg-white/40 backdrop-blur-xl p-4 rounded-xl border border-white/60">
         <p className="text-sm text-[#1C1917] leading-relaxed font-medium">{liveComplaint.summary}</p>
        </div>
        {liveComplaint.status === "Awaiting Approval" && (
         <div className="mt-4 rounded-xl bg-[#B45309]/10 border border-[#B45309]/20 p-4 text-xs font-bold text-[#92400E]">
          ✦ Your GM is reviewing the drafted recovery response. You'll receive confirmation and single-use credit upon approval.
         </div>
        )}
       </div>
      </div>
     ) : null}

     {/* Past Issues Queue */}
     <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5">
      <SectionTitle hint={`${d.gmComplaints.length} Issues`}>Past Issues Queue</SectionTitle>
      <div className="mt-4 space-y-3">
       {paginatedComplaints.map((c) => (
        <div key={c.id} className="flex items-center justify-between rounded-2xl bg-white/40 backdrop-blur-sm p-4 shadow-sm ring-1 ring-black/[0.04]">
         <div>
          <span className="text-base font-black text-[#1C1917]">{c.customer}</span>
          <p className="mt-1 text-xs font-semibold text-[#78716C]">
           {c.type} · {c.severity} · {c.channel} · {c.orderRef}
          </p>
         </div>
         <Pill tone={statusTone(c.status) as "amber"}>{c.status}</Pill>
        </div>
       ))}
      </div>

      <div className="mt-6">
       <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={d.gmComplaints.length}
        pageSize={pageSize}
       />
      </div>
     </div>
    </div>

    {/* Right Sidebar Column */}
    <div className="space-y-6 lg:col-span-5">
     <div className="rounded-2xl bg-white/40 backdrop-blur-md shadow-md ring-1 ring-black/[0.04] p-5 lg:sticky lg:top-20 min-h-[520px]">
      <SectionTitle>Ask Privé Guest Support</SectionTitle>
      <div className="mt-4">
       <AskPriveConsole persona="guest" compact />
      </div>
     </div>
    </div>
   </div>
  </>
 );
}
