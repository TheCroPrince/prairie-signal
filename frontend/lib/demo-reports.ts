import type { StructuredReport } from "./types";

// Offline snapshot of the seeded report history — mirrors what the backend
// produces at startup so the reports page still reads well without the API.
export const reportHistory: StructuredReport[] = [
  {
    id: "report_dispatch_risk_scan_seed",
    title: "Dispatch Risk Scan",
    reportType: "dispatch_risk_scan",
    tone: "owner_friendly",
    audience: "Dispatch lead",
    generatedAt: "2026-06-12T08:00:00-06:00",
    generatedAtLabel: "Jun 12 · 8:00 AM",
    summary: "1 job is blocked and 2 are at risk out of 6 open dispatch jobs.",
    changes: [
      "Job J-220 (Apex Facility Services) is blocked — Required part REL-220 is below reorder point.",
      "Job J-221 (Canyon Ridge Mechanical) is at risk — Order PS-1049 delayed by late supplier shipment.",
      "Job J-223 (Calgary West Property) is at risk — Technician double-booked for the morning window.",
    ],
    risks: [
      "Job J-220 depends on inventory that is below reorder point.",
      "Cole Nguyen carries 2 of the 6 open jobs — little slack if anything slips.",
    ],
    recommendedActions: [
      "Resolve REL-220 supply before tomorrow's Apex install window.",
      "Rebalance the double-booked morning window with a second technician.",
      "Confirm new timing with Canyon Ridge Mechanical before the crew rolls.",
    ],
    sourceRecords: ["J-220", "J-221", "J-223", "REL-220"],
  },
  {
    id: "report_daily_owner_brief_seed",
    title: "Daily Owner Brief",
    reportType: "daily_owner_brief",
    tone: "owner_friendly",
    audience: "Owner / GM",
    generatedAt: "2026-06-12T07:30:00-06:00",
    generatedAtLabel: "Jun 12 · 7:30 AM",
    summary:
      "Operations have a manageable workload today, but 3 operational items need attention before noon: a priority order blocked by low stock, a delayed dispatch dependency, and one high-value overdue invoice.",
    changes: [
      "3 orders are now delayed or need review.",
      "1 dispatch job is blocked by inventory availability.",
      "2 warm leads crossed the 48-hour follow-up threshold.",
    ],
    risks: [
      "Apex Facility Services may miss the scheduled install window if the blocker is not resolved today (SKU REL-220 below reorder point).",
      "1 high-value invoice requires finance follow-up before more work is scheduled.",
      "3 leads are at risk of going cold without contact this week.",
    ],
    recommendedActions: [
      "Call the supplier for REL-220 status and offer a split shipment option today.",
      "Confirm new timing with North Gate Maintenance and update the order status.",
      "Send payment follow-up before confirming additional dispatch work.",
    ],
    sourceRecords: ["Order PS-1048 / Job J-220", "Order PS-1051", "Invoice INV-3101", "Lead L-710"],
  },
  {
    id: "report_lead_follow_up_digest_seed",
    title: "Lead Follow-up Digest",
    reportType: "lead_follow_up_digest",
    tone: "owner_friendly",
    audience: "Sales / admin",
    generatedAt: "2026-06-11T15:00:00-06:00",
    generatedAtLabel: "Jun 11 · 3:00 PM",
    summary: "2 new leads and 2 follow-ups due, with $29,500 of active pipeline needing a touch.",
    changes: [
      "L-711 — Bridgeway Builders (Referral), est. $4,100.",
      "L-713 — Highline Electrical (Website form), est. $3,000.",
      "L-710 — Foothills Commercial HVAC (Website form), est. $9,200.",
      "L-712 — Cedar Park Property Group (Website form), est. $5,400.",
    ],
    risks: [
      "L-710 — Foothills Commercial HVAC untouched for 56 hours and going cold.",
      "L-712 — Cedar Park Property Group untouched for 50 hours and going cold.",
      "L-708 — Chinook Commercial Services untouched for 216 hours and going cold.",
    ],
    recommendedActions: [
      "Foothills Commercial HVAC: check in and offer a quick discovery call.",
      "Cedar Park Property Group: check in and offer a quick discovery call.",
      "Chinook Commercial Services: re-engage with a recent delivery win and a low-pressure ask.",
      "Bridgeway Builders: send an intro with a same-day quote turnaround offer.",
      "Highline Electrical: send an intro with a same-day quote turnaround offer.",
    ],
    sourceRecords: ["L-711", "L-713", "L-710", "L-712", "L-708"],
  },
];
