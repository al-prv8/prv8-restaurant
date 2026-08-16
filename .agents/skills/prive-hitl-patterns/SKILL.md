---
name: prive-hitl-patterns
description: >
  Human-in-the-Loop (HITL) UI patterns for the Privé project. Use this skill
  whenever implementing any workflow where a GM, regional director, or executive
  must review, approve, edit, or reject an AI-generated recommendation before
  it executes. This is one of the strongest design pillars of the product.
---

# Human-in-the-Loop UI Patterns

## Core Principle

> "Instead of repeating 'Human-in-the-Loop' everywhere, visually demonstrate it."  
> — notes.md §7

The system does NOT auto-execute. Every Privé recommendation:
1. Is **held in a pending queue**
2. Shows a **confidence score**
3. Presents a **draft action** (response, order, credit amount, schedule change)
4. Requires **explicit GM approval** via Approve / Edit / Reject
5. Records a **timestamped attribution stamp** after the action

---

## Pattern 1 — Guest Complaint Approval Workflow

**Location:** `app/gm/guests/page.tsx`

This is the flagship HITL workflow. Each complaint card shows:

```tsx
{/* Privé Recommendation block */}
<div className="mt-3 rounded-lg bg-[#F7F5F2] border border-[#E7E5E0] p-3 space-y-2">
  <div className="text-[10px] font-bold uppercase tracking-widest text-[#A8A29E]">Privé Recommendation</div>
  <div className="text-sm text-[#1C1917] leading-relaxed">{complaint.draftResponse}</div>
  <div className="flex items-center justify-between pt-2 border-t border-[#F3F2F0]">
    <span className="text-xs font-bold text-[#15803D]">Recommended: ${complaint.recommendedCredit} credit</span>
    <span className="text-xs text-[#A8A29E]">94% confidence</span>
  </div>
</div>

{/* Action buttons — only shown while awaiting approval */}
{complaint.status === "Awaiting Approval" ? (
  <div className="flex flex-col sm:flex-row gap-2 pt-4 mt-4 border-t border-[#E7E5E0]">
    <button
      onClick={() => {
        dispatch({ type: "resolveComplaint", id: complaint.id, amount: complaint.recommendedCredit });
        setApprovedAt(prev => ({ ...prev, [complaint.id]: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }));
      }}
      className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#881337] px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-[#6B0F2A] transition-all"
    >
      <Gift className="size-4" />
      Approve
    </button>
    <button className="flex-1 rounded-lg bg-white border border-[#E7E5E0] px-4 py-2 text-sm font-bold text-[#1C1917] shadow-sm hover:bg-[#F7F5F2] transition-all">
      Edit
    </button>
    <button
      onClick={() => {
        dispatch({ type: "resolveComplaint", id: complaint.id, amount: 0 });
        setApprovedAt(prev => ({ ...prev, [complaint.id]: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }));
      }}
      className="flex-1 rounded-lg bg-white border border-[#E7E5E0] px-4 py-2 text-sm font-bold text-[#1C1917] shadow-sm hover:bg-[#F7F5F2] transition-all"
    >
      Apology Only
    </button>
  </div>
) : (
  {/* Attribution stamp — appears after approval */}
  <div className="text-sm font-bold text-[#15803D] flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-4 mt-4 border-t border-[#E7E5E0]">
    <span className="flex items-center gap-2">
      <CheckCircle className="size-5" /> Complaint resolved & logged in CRM.
    </span>
    {approvedAt[complaint.id] && (
      <div className="text-xs font-semibold text-[#15803D]">
        ✓ Approved by Jordan Ellis · {approvedAt[complaint.id]}
      </div>
    )}
  </div>
)}
```

### State management for attribution timestamps

```tsx
const [approvedAt, setApprovedAt] = useState<Record<string, string>>({});

// On approve:
setApprovedAt(prev => ({
  ...prev,
  [id]: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}));
```

---

## Pattern 2 — Employee Lifecycle Decision (Separation Review)

**Location:** `app/gm/workforce/page.tsx`

```tsx
{/* Inactivity alert */}
<div className="rounded-lg bg-[#FEF2F2] border border-[#B91C1C]/20 border-l-4 border-l-[#B91C1C] p-4 mb-4">
  <div className="text-xs font-bold uppercase tracking-wider text-[#B91C1C] mb-1">Inactivity Detected</div>
  <div className="text-sm font-semibold text-[#1C1917]">Jordan Smith has not worked a shift in 45 days.</div>
  <p className="text-xs text-[#78716C] mt-1">
    Privé recommends initiating a separation review or conducting a retention conversation.
    This employee is still on payroll.
  </p>
</div>

{!state.separationDecision ? (
  <div className="flex flex-col sm:flex-row gap-3">
    <button
      onClick={() => dispatch({ type: "separation", decision: "Retain" })}
      className="flex-1 rounded-md bg-[#881337] px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#6B0F2A] transition-all"
    >
      Initiate Retention Plan
    </button>
    <button
      onClick={() => dispatch({ type: "separation", decision: "Proceed" })}
      className="flex-1 rounded-md bg-white border border-[#E7E5E0] px-4 py-2.5 text-sm font-bold text-[#1C1917] hover:bg-[#F7F5F2] transition-all"
    >
      Proceed with Separation
    </button>
  </div>
) : (
  {/* Attribution stamp */}
  <div className="text-xs font-semibold text-[#15803D] mt-2">
    Reviewed by Jordan Ellis · {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} — {state.separationDecision}
  </div>
)}
```

---

## Pattern 3 — Batch Approval Toolbar

**Location:** `app/gm/guests/page.tsx` (top of page, conditionally rendered)

```tsx
{awaitingItems.length > 0 && (
  <div className="mb-6 bg-[#FEF3C7] border border-[#B45309]/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <div>
      <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#881337]">
        Batch Resolution Queue
      </div>
      <div className="text-base font-black text-[#1C1917]">
        {awaitingItems.length} Drafts Pending GM Approval
      </div>
    </div>

    <button
      type="button"
      onClick={() => {
        awaitingItems.forEach(item => {
          dispatch({ type: "resolveComplaint", id: item.id, amount: item.recommendedCredit });
          setApprovedAt(prev => ({ ...prev, [item.id]: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }));
        });
      }}
      className="rounded-xl bg-[#881337] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#6B0F2A] active:scale-95 transition-all shrink-0"
    >
      ✦ Approve All & Issue ${awaitingItems.reduce((s, i) => s + i.recommendedCredit, 0)} Total
    </button>
  </div>
)}
```

---

## Pattern 4 — Audit Trail Entry

**Location:** `app/integrations/page.tsx` · `src/lib/prive/store.tsx` (audit state)

Every approved action is logged to `state.audit`:

```ts
// Audit entry shape
type AuditEntry = {
  id: string;
  action: string;       // e.g. "Guest credit issued — $25"
  at: string;           // e.g. "3:42 PM"
  actor: string;        // e.g. "Jordan Ellis (GM)"
  agent: string;        // e.g. "Privé · Guest Recovery Engine"
  approval: "Approved" | "Pending";
  detail?: string;
};
```

How to render an audit entry:
```tsx
<div className="flex items-start justify-between gap-2 py-3 border-b border-[#F3F2F0]">
  <div className="space-y-1.5">
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md bg-[#881337]/8">
        <Lock className="size-3 text-[#881337]" />
      </div>
      <span className="text-[13px] font-bold text-[#1C1917]">{entry.action}</span>
    </div>
    <div className="flex items-center gap-3 pl-8 text-[11px] font-medium text-[#A8A29E]">
      <span className="flex items-center gap-1"><Clock className="size-3" /> {entry.at}</span>
      <span className="flex items-center gap-1"><ArrowRight className="size-3" /> {entry.actor}</span>
      <span className="text-[#78716C]">{entry.agent}</span>
    </div>
  </div>
  <Pill tone={entry.approval === "Pending" ? "amber" : "teal"}>{entry.approval}</Pill>
</div>
```

---

## Attribution Stamp Format

The standard attribution stamp format (always `text-xs font-semibold text-[#15803D]`):

```
✓ Approved by Jordan Ellis · 4:32 PM
✓ Reviewed by Jordan Ellis · 4:32 PM — Retain
```

Generate the timestamp:
```ts
new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
// → "04:32 PM"
```

---

## HITL Checklist for New Workflows

When implementing any new approval workflow, verify:

- [ ] Privé recommendation is shown **before** GM sees the action buttons
- [ ] Confidence score or source data is shown (`94% confidence` or `"Based on Toast POS data"`)
- [ ] Three options minimum: **Approve / Edit / Reject** (or contextual equivalents)
- [ ] After approval: attribution stamp replaces buttons — `✓ Approved by [name] · [time]`
- [ ] Action is dispatched to store so it persists across navigation
- [ ] If financial: total credit/amount is shown before approval
- [ ] Integrations page Audit Trail receives a new entry on dispatch
- [ ] Never auto-execute — buttons must always require a real click

---

## Governance Copy Standards

| Context | Copy |
|---------|------|
| Credit disclaimer | "No funds are issued without explicit GM approval." |
| Audit trail tagline | "Every recommendation, approval and action is timestamped and attributable." |
| Integrations blurb | "Privé reads from connected systems in real time and records a complete audit trail for every human approval — nothing executes without a traceable actor." |
| Empty audit state | "No actions recorded yet. Approve an action in the GM Command Center to see it logged here." |
| Governance footer | "No action executes without explicit GM sign-off" |
