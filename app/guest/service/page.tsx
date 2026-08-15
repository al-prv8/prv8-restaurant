"use client";

import { useState, useEffect } from "react";
import { Volume2, Pause, Radio, Gift, CheckCircle2 } from "lucide-react";
import { Card, SectionTitle, Button, Pill, PriveIntelBanner, Pagination } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";
import { GM_RESTAURANT_ID, TODAY, iso } from "@/lib/prive/data";
import { AskPriveConsole } from "@/components/prive/AskPrive";

const statusTone = (s: string) =>
 s === "Resolved" ? "teal" : s === "Escalated" ? "violet" : s === "Rejected" ? "neutral" : "amber";

function AudioWaveform({ active, speaker }: { active: boolean; speaker: "ai" | "guest" | null }) {
  const bars = [24, 45, 68, 30, 85, 52, 95, 60, 40, 80, 55, 35, 75, 45, 65, 25, 50, 82, 40, 20];

  return (
    <div className="relative overflow-hidden flex items-center justify-between gap-1 h-14 px-5 rounded-2xl bg-[#1C1917] border border-white/10 shadow-inner my-4">
      <div className="flex items-center gap-2 text-xs font-bold text-white/70 min-w-[100px]">
        {active ? (
          <>
            <span className={`size-2 rounded-full animate-ping ${speaker === "ai" ? "bg-[#15803D]" : "bg-[#881337]"}`} />
            <span className={speaker === "ai" ? "text-[#4ADE80]" : "text-[#F87171]"}>
              {speaker === "ai" ? "Voice AI" : "Priya (Guest)"}
            </span>
          </>
        ) : (
          <span className="text-[#A8A29E]">Voice Standby</span>
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

      <div className="text-[10px] font-bold uppercase tracking-widest text-white/50 text-right">
        {active ? (speaker === "ai" ? "Synthesizing" : "Live Input") : "Ready"}
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
   <div className="mb-8 space-y-1">
    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#881337]">24/7 AI Contact · Guest Services</p>
    <h1 className="text-3xl font-black tracking-tight text-[#1C1917]">Guest Service Portal</h1>
    <p className="text-sm font-medium text-[#78716C]">
     Voice AI & digital contact intake — 24/7 guest service held for GM approval.
    </p>
   </div>

   <div className="grid gap-6 lg:grid-cols-12">
    <div className="space-y-6 lg:col-span-7">
     <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
       <SectionTitle hint="Voice AI · 24/7 · Ballantyne #02">Simulate Inbound Voice Call</SectionTitle>
       {isPlaying ? (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#881337]/15 px-3 py-1 text-xs font-bold text-[#881337] animate-pulse">
         <Radio className="size-3.5 text-[#881337]" /> Live Audio
        </span>
       ) : null}
      </div>

      {/* Real-time Audio Waveform Visualizer */}
      <AudioWaveform active={isPlaying} speaker={activeSpeaker} />

      <div className="rounded-xl bg-[#1C1917] p-5 font-mono text-sm text-[#FAFAF8] shadow-inner space-y-4">
       <div className={`rounded-lg p-3 transition-all ${activeSpeaker === "ai" ? "bg-[#881337]/30 ring-1 ring-[#881337]" : ""}`}>
        <p><span className="font-bold text-[#15803D] uppercase tracking-wider text-xs">Privé Voice AI:</span><br/>Thank you for calling The Morning Table — Ballantyne location. How can I help you today?</p>
       </div>
       <div className={`rounded-lg p-3 transition-all ${activeSpeaker === "guest" ? "bg-[#881337]/30 ring-1 ring-[#881337]" : ""}`}>
        <p><span className="font-bold text-[#A8A29E] uppercase tracking-wider text-xs">Guest (Priya):</span><br/>Hi, I ordered curbside pickup earlier and two sides of bacon were missing.</p>
       </div>
       <div className={`rounded-lg p-3 transition-all ${activeSpeaker === "ai" ? "bg-[#881337]/30 ring-1 ring-[#881337]" : ""}`}>
        <p><span className="font-bold text-[#15803D] uppercase tracking-wider text-xs">Privé Voice AI:</span><br/>I'm sorry about that, Priya. I found your order ORD-51993 from 9:42 AM. I'm creating a service case now and routing it to your location's general manager for review. You'll hear back within the hour.</p>
       </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
       <Button onClick={playVoiceCall} variant="ghost" className="w-full sm:w-auto bg-white/60 backdrop-blur-sm text-[#1C1917] hover:bg-white/80 font-bold">
        {isPlaying ? <Pause className="size-4 mr-2" /> : <Volume2 className="size-4 mr-2" />}
        {isPlaying ? "Pause Call" : "Play Recording"}
       </Button>

       <Button onClick={logComplaint} disabled={!!liveComplaint} variant="primary" className="w-full sm:w-auto bg-[#881337] text-white hover:bg-[#881337]/90 font-bold border-none">
        {liveComplaint ? "Case Sent to GM" : "Simulate Guest Call"}
       </Button>
      </div>
     </div>

     {liveComplaint ? (
      <div className={`rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5`}>
       <SectionTitle hint="Live Case Tracking">Your Service Case Status</SectionTitle>
       <div className="mt-4">
        <div className="flex items-center justify-between gap-2 mb-2">
         <span className="text-xl font-black tracking-tight text-[#1C1917]">{liveComplaint.customer}</span>
         <Pill tone={statusTone(liveComplaint.status) as "amber"}>
          {liveComplaint.status === "Awaiting Approval" ? "Reviewing" : liveComplaint.status}
         </Pill>
        </div>
        <p className="text-sm font-medium text-[#78716C] mb-4">
         {liveComplaint.type} · {liveComplaint.orderRef} · {liveComplaint.channel}
        </p>
        <div className="bg-white/8 backdrop-blur-xl p-4 rounded-xl">
          <p className="text-sm text-[#1C1917] leading-relaxed font-medium">{liveComplaint.summary}</p>
        </div>
        {liveComplaint.status === "Awaiting Approval" && (
         <div className="mt-4 rounded-lg bg-[#B45309]/10 p-4 text-sm text-[#92400E] font-bold">
          Your GM is reviewing the drafted recovery. You'll receive a response and any credit by email shortly.
         </div>
        )}
       </div>
      </div>
     ) : null}

     <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5">
      <SectionTitle hint={`${d.gmComplaints.length} Issues`}>Past Issues Queue</SectionTitle>
      <div className="mt-4 space-y-4">
       {paginatedComplaints.map((c) => (
        <div key={c.id} className={`rounded-2xl bg-white/40 backdrop-blur-sm shadow-sm ring-1 ring-black/[0.04] p-4 shadow-sm`}>
         <div className="flex items-center justify-between gap-2">
          <span className="text-base font-black text-[#1C1917]">{c.customer}</span>
          <Pill tone={statusTone(c.status) as "amber"}>{c.status}</Pill>
         </div>
         <p className="mt-1.5 text-xs font-medium text-[#78716C]">
          {c.type} · {c.severity} · {c.channel} · {c.orderRef}
         </p>
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
