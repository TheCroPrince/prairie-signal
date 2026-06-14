import type { DashboardPayload } from "./types";

// Offline snapshot of the backend /dashboard/today payload. The dashboard
// falls back to this when the API is unreachable, so it mirrors what the
// pipeline computes from backend/seed_data.py — keep the two in sync.
export const dashboardPayload: DashboardPayload = {
  business: {
    name: "Prairie Signal Supply Co.",
    industry: "B2B supply and field-service coordination",
    location: "Southern Alberta",
  },
  operator: {
    name: "Maya Singh",
    role: "Operations Coordinator",
  },
  dateLabel: "Friday, June 12 · 7:56 AM",
  metrics: [
    { label: "Open Orders", value: 14, delta: "5 need review", status: "watch" },
    { label: "Delayed Orders", value: 3, delta: "2 more blocked", status: "risk" },
    { label: "Revenue at Risk", value: "$26,140", delta: "2 blocked, 3 delayed", status: "risk" },
    { label: "Overdue Invoices", value: 3, delta: "$9,140 outstanding", status: "risk" },
    { label: "Tickets Waiting", value: 5, delta: "2 escalated", status: "watch" },
    { label: "New Leads", value: 2, delta: "2 follow-ups due", status: "good" },
  ],
  aiDailyBrief: {
    generatedAt: "7:38 AM",
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
  },
  priorityQueue: [
    {
      id: "priority-PS-1048",
      level: "high",
      title: "Priority order blocked by low stock",
      affectedRecord: "Order PS-1048 / Job J-220",
      whyItMatters:
        "Apex Facility Services has a $8,420 order due tomorrow and is a priority customer.",
      recommendedAction:
        "Call the supplier for REL-220 status and offer a split shipment option today.",
      owner: "Maya Singh",
      due: "Tomorrow",
    },
    {
      id: "priority-PS-1051",
      level: "high",
      title: "Order delayed — awaiting dispatch confirmation",
      affectedRecord: "Order PS-1051",
      whyItMatters:
        "North Gate Maintenance has a $6,230 order due today and is a priority customer.",
      recommendedAction: "Confirm new timing with North Gate Maintenance and update the order status.",
      owner: "Maya Singh",
      due: "Today",
    },
    {
      id: "priority-INV-3101",
      level: "high",
      title: "High-value invoice is 16 days overdue",
      affectedRecord: "Invoice INV-3101",
      whyItMatters: "North Gate Maintenance owes $6,230, now 16 days past terms.",
      recommendedAction: "Send payment follow-up before confirming additional dispatch work.",
      owner: "Lena Hart",
      due: "Today",
    },
    {
      id: "priority-L-710",
      level: "medium",
      title: "Warm lead needs follow-up",
      affectedRecord: "Lead L-710",
      whyItMatters:
        "Foothills Commercial HVAC has an estimated value of $9,200 and has not been touched in 56 hours.",
      recommendedAction: "Send a same-day follow-up and offer a quick discovery call.",
      owner: "Maya Singh",
      due: "Today",
    },
    {
      id: "priority-L-712",
      level: "medium",
      title: "Warm lead needs follow-up",
      affectedRecord: "Lead L-712",
      whyItMatters:
        "Cedar Park Property Group has an estimated value of $5,400 and has not been touched in 50 hours.",
      recommendedAction: "Reach out to Cedar Park Property Group with a short follow-up note today.",
      owner: "Maya Singh",
      due: "Today",
    },
    {
      id: "priority-VLV-085",
      level: "medium",
      title: "Pressure valve assembly out of stock",
      affectedRecord: "SKU VLV-085",
      whyItMatters: "Stock is at 0 against a reorder point of 5 and the supplier is backordered.",
      recommendedAction: "Add VLV-085 to this week's replenishment order.",
      owner: "Cole Nguyen",
      due: "This week",
    },
  ],
  sources: [
    { id: "crm", name: "CRM export", status: "synced", lastSync: "7:30 AM", recordsProcessed: 42 },
    { id: "orders", name: "Orders CSV", status: "synced", lastSync: "7:32 AM", recordsProcessed: 14 },
    { id: "invoices", name: "Invoice export", status: "warning", lastSync: "7:35 AM", recordsProcessed: 10 },
    { id: "leads", name: "Website leads", status: "synced", lastSync: "7:37 AM", recordsProcessed: 7 },
    { id: "tickets", name: "Ticket list", status: "synced", lastSync: "7:38 AM", recordsProcessed: 9 },
  ],
  automations: [
    {
      id: "daily-owner-brief",
      name: "Daily owner brief",
      schedule: "Weekdays · 7:30 AM",
      lastRun: "7:30 AM",
      status: "active",
      result: "Generated report with 3 recommended actions.",
    },
    {
      id: "dispatch-risk-scan",
      name: "Dispatch risk scan",
      schedule: "Every 2 hours",
      lastRun: "8:00 AM",
      status: "active",
      result: "Flagged 1 blocked job and 2 at-risk appointments.",
    },
    {
      id: "overdue-invoice-scan",
      name: "Overdue invoice scan",
      schedule: "Weekdays · 9:00 AM",
      lastRun: "Yesterday 9:00 AM",
      status: "active",
      result: "3 invoices over threshold, 1 flagged high-value.",
    },
    {
      id: "lead-follow-up-digest",
      name: "Lead follow-up digest",
      schedule: "Weekdays · 3:00 PM",
      lastRun: "Yesterday 3:00 PM",
      status: "active",
      result: "2 leads queued for same-day follow-up.",
    },
  ],
  activity: [
    { id: "a1", time: "7:30 AM", label: "CRM export synced — 42 records processed", kind: "sync" },
    { id: "a2", time: "7:32 AM", label: "Orders CSV synced — 14 records processed", kind: "sync" },
    { id: "a3", time: "7:35 AM", label: "Invoice export synced with 1 format warning", kind: "sync" },
    { id: "a4", time: "7:38 AM", label: "AI daily brief generated", kind: "report" },
    { id: "a5", time: "7:41 AM", label: "Alert triggered — REL-220 below reorder point", kind: "alert" },
    { id: "a6", time: "7:56 AM", label: "Maya Singh opened the daily brief", kind: "user" },
  ],
};
