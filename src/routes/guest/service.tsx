import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Volume2, Pause, Radio, Phone, Gift, CheckCircle2 } from "lucide-react";
import { Card, SectionTitle, Button, Pill, PriveIntelBanner, Pagination } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";
import { GM_RESTAURANT_ID, TODAY, iso } from "@/lib/prive/data";
import { AskPriveConsole } from "@/components/prive/AskPrive";

export const Route = createFileRoute("/guest/service")({
  head: () => ({ meta: [{ title: "Guest Service Portal — Privé" }] }),
  component: GuestServicePage,
});

const statusTone = (s: string) =>
  s === "Resolved" ? "teal" : s === "Escalated" ? "violet" : s === "Rejected" ? "neutral" : "amber";

function GuestServicePage() {
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Guest Service Portal</h1>
        <p className="mt-1 max-w-3xl text-sm text-[#101828]/60">
          Voice AI & digital contact intake — 24/7 guest service held for GM approval.
        </p>
      </div>

      <PriveIntelBanner
        summary="Voice AI 24/7 Call Center Active. All inbound guest complaints are transcribed, matched to Toast POS orders, and drafted for GM approval."
        details={[
          "Zero auto-issuance of funds: Every recovery credit requires explicit manager sign-off.",
          "Single-use tokenized barcodes prevent duplicate redemptions across stores.",
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <Card tone="alert">
            <div className="flex items-center justify-between gap-3 mb-4">
              <SectionTitle hint="Voice AI · 24/7 · Ballantyne #02">Simulate Inbound Voice Call</SectionTitle>
              {isPlaying ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#7C3AED]/15 px-3 py-1 text-xs font-bold text-[#7C3AED] animate-pulse">
                  <Radio className="size-3.5 text-[#7C3AED]" /> Playing Audio...
                </span>
              ) : null}
            </div>

            <div className="space-y-3 text-sm text-[#101828]/70">
              <div className="rounded-xl bg-[#101828] p-4 font-mono text-xs text-white leading-relaxed shadow-sm space-y-3">
                <div className={`rounded-lg p-2.5 transition-all ${activeSpeaker === "ai" ? "bg-[#7C3AED]/30 border border-[#7C3AED]" : ""}`}>
                  <p><span className="font-bold text-[#0F9D8A]">Privé Voice AI:</span> Thank you for calling The Morning Table — Ballantyne location. How can I help you today?</p>
                </div>
                <div className={`rounded-lg p-2.5 transition-all ${activeSpeaker === "guest" ? "bg-[#5146E5]/30 border border-[#5146E5]" : ""}`}>
                  <p><span className="font-bold text-[#818CF8]">Guest (Priya):</span> Hi, I ordered curbside pickup earlier and two sides of bacon were missing.</p>
                </div>
                <div className={`rounded-lg p-2.5 transition-all ${activeSpeaker === "ai" ? "bg-[#7C3AED]/30 border border-[#7C3AED]" : ""}`}>
                  <p><span className="font-bold text-[#0F9D8A]">Privé Voice AI:</span> I'm sorry about that, Priya. I found your order ORD-51993 from 9:42 AM. I'm creating a service case now and routing it to your location's general manager for review. You'll hear back within the hour.</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button onClick={playVoiceCall} variant="ghost" className="border-[#7C3AED]/30 text-[#7C3AED] hover:bg-[#7C3AED]/10">
                {isPlaying ? <Pause className="size-4" /> : <Volume2 className="size-4" />}
                {isPlaying ? "Pause Call Audio" : "▶ Play Voice AI Audio Script"}
              </Button>

              <Button onClick={logComplaint} disabled={!!liveComplaint} variant="violet">
                {liveComplaint ? "Call Logged — Awaiting GM Approval" : "Simulate Guest Call — Missing Item"}
              </Button>
            </div>
          </Card>

          {liveComplaint ? (
            <Card>
              <SectionTitle hint="Live Case Tracking">Your Service Case Status</SectionTitle>
              <div className="rounded-xl border border-[#101828]/8 bg-white p-4 shadow-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-[#101828]">{liveComplaint.customer}</span>
                  <Pill tone={statusTone(liveComplaint.status) as "amber"}>
                    {liveComplaint.status === "Awaiting Approval"
                      ? "With Restaurant — Reviewing Now"
                      : liveComplaint.status === "Resolved"
                      ? "Resolved — Credit Issued"
                      : liveComplaint.status}
                  </Pill>
                </div>
                <p className="mt-1 text-xs text-[#101828]/60 font-semibold">
                  {liveComplaint.type} · {liveComplaint.orderRef} · reported via {liveComplaint.channel}
                </p>
                <p className="mt-2 text-xs text-[#101828]/80 leading-relaxed font-medium">{liveComplaint.summary}</p>
                {liveComplaint.status === "Awaiting Approval" ? (
                  <div className="mt-3 rounded-lg bg-[#F59E0B]/10 p-3 text-xs text-[#92400E] font-bold">
                    Your GM has been notified and is reviewing the drafted recovery. You'll receive a response and any credit by email.
                  </div>
                ) : null}
              </div>
            </Card>
          ) : null}

          <Card>
            <SectionTitle hint={`${d.gmComplaints.length} Issues`}>Guest Issues Queue — GM View</SectionTitle>
            <div className="space-y-2.5">
              {paginatedComplaints.map((c) => (
                <div key={c.id} className="rounded-xl border border-[#101828]/8 bg-white p-3.5 shadow-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-[#101828]">{c.customer}</span>
                    <Pill tone={statusTone(c.status) as "amber"}>{c.status}</Pill>
                  </div>
                  <p className="mt-1 text-xs text-[#101828]/60 font-semibold">
                    {c.type} · {c.severity} severity · {c.channel} · {c.orderRef}
                  </p>
                </div>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={d.gmComplaints.length}
              pageSize={pageSize}
            />
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-5">
          <Card tone="intel" className="lg:sticky lg:top-20 min-h-[520px]">
            <SectionTitle>Ask Privé Guest Support</SectionTitle>
            <AskPriveConsole persona="guest" compact />
          </Card>
        </div>
      </div>
    </>
  );
}
