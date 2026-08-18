"use client";

import React from "react";
import Link from "next/link";
import {
  MessageSquareHeart,
  Star,
  TrendingUp,
  ThumbsUp,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { Card, SectionTitle, KpiRow, Button, Pill, PriveIntelBanner } from "@/components/prive/ui";

export default function GmFeedbackPage() {
  const reviews = [
    { author: "Sarah M.", rating: 5, comment: "Amazing service! Taylor Morgan was fast and super attentive.", date: "Today", channel: "Google Reviews", sentiment: "Positive" },
    { author: "David K.", rating: 4, comment: "Great food, burgers were juicy. Slight wait at register.", date: "Yesterday", channel: "Yelp", sentiment: "Positive" },
    { author: "Marcus L.", rating: 5, comment: "Clean dining room, fast pickup order.", date: "2 days ago", channel: "Privé Guest Survey", sentiment: "Positive" },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#881337] mb-1">
            BALLANTYNE #02 · GUEST SATISFACTION
          </p>
          <h1 className="text-3xl font-black tracking-tight text-[#1C1917]">
            Guest Feedback & NPS Analytics
          </h1>
          <p className="mt-1 max-w-3xl text-sm font-medium text-[#78716C]">
            Aggregated guest reviews, Net Promoter Score, Voice AI transcripts, and sentiment trends across Google, Yelp, and Privé surveys.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link href="/guest/service">
            <Button variant="quiet">View Voice AI Agent</Button>
          </Link>
        </div>
      </div>

      {/* KPI Strip */}
      <KpiRow
        items={[
          { label: "Overall Rating", value: "4.8 ★", tone: "good", sub: "Based on 342 reviews" },
          { label: "NPS Score", value: "+72", tone: "good", sub: "Top 5% of Carolinas" },
          { label: "Positive Sentiment", value: "94.2%", tone: "good", sub: "+2.1% vs last month" },
          { label: "Resolved Complaints", value: "100%", tone: "good", sub: "Avg response < 45m" },
        ]}
      />

      <PriveIntelBanner
        summary="Guest NPS of +72 is in the top 5% of the Carolinas region. Top driver: server attentiveness. Watch area: table wait times during the 6, 8 PM dinner peak."
        details={[
          "94.2% positive sentiment across 342 reviews this month, up +2.1% vs last month.",
          "All complaints resolved within 45 minutes on average, the fastest response time in the district.",
          "Recommendation: Address dinner peak wait times to push NPS above +78 next month.",
        ]}
      />

      {/* Recent Guest Reviews */}
      <Card>
        <SectionTitle hint="Real-Time Sentiment Pipeline">
          Recent Guest Reviews & Ratings
        </SectionTitle>

        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.author + r.date} className="rounded-xl border border-[#E7E5E0] bg-[#FAFAF8] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-[#1C1917]">{r.author}</span>
                  <span className="text-[10px] font-bold text-[#B45309]">{"★".repeat(r.rating)}</span>
                  <span className="text-[10px] font-bold text-[#78716C] bg-white px-2 py-0.5 rounded border border-[#E7E5E0]">{r.channel}</span>
                </div>
                <p className="text-xs text-[#1C1917] font-medium mt-1">
                  &ldquo;{r.comment}&rdquo;
                </p>
              </div>

              <div className="shrink-0 text-right">
                <Pill tone="teal">{r.sentiment}</Pill>
                <div className="text-[10px] text-[#78716C] mt-1">{r.date}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
