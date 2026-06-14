import { dashboardPayload } from "./demo-data";
import { reportHistory } from "./demo-reports";
import type {
  AssistantResponse,
  AutomationsPayload,
  DashboardPayload,
  ReportTone,
  ReportType,
  RulePreview,
  StructuredReport,
  ThresholdRules,
} from "./types";

const timezone = "America/Edmonton";

const reportTypes: ReportType[] = [
  "daily_owner_brief",
  "dispatch_risk_scan",
  "finance_follow_up",
  "lead_follow_up_digest",
];

const reportTones: ReportTone[] = ["concise", "owner_friendly", "detailed"];

const reportTitles: Record<ReportType, string> = {
  daily_owner_brief: "Daily Owner Brief",
  dispatch_risk_scan: "Dispatch Risk Scan",
  finance_follow_up: "Finance Follow-up Brief",
  lead_follow_up_digest: "Lead Follow-up Digest",
};

const reportAudiences: Record<ReportType, string> = {
  daily_owner_brief: "Owner / GM",
  dispatch_risk_scan: "Dispatch lead",
  finance_follow_up: "Finance / admin",
  lead_follow_up_digest: "Sales / admin",
};

export const defaultRules: ThresholdRules = {
  invoice_overdue_days: 7,
  lead_untouched_hours: 48,
  ticket_age_hours: 24,
  inventory_buffer_units: 0,
};

const ruleBounds: Record<keyof ThresholdRules, { min: number; max: number }> = {
  invoice_overdue_days: { min: 1, max: 30 },
  lead_untouched_hours: { min: 12, max: 168 },
  ticket_age_hours: { min: 6, max: 72 },
  inventory_buffer_units: { min: 0, max: 10 },
};

const invoices = [
  { id: "INV-3096", customer: "Stonegate Contracting", amount: 1070, status: "overdue", days_overdue: 21 },
  { id: "INV-3098", customer: "Calgary West Property", amount: 1840, status: "overdue", days_overdue: 9 },
  { id: "INV-3101", customer: "North Gate Maintenance", amount: 6230, status: "overdue", days_overdue: 16 },
  { id: "INV-3097", customer: "Lethbridge Service Group", amount: 3675, status: "open", days_overdue: 0 },
  { id: "INV-3100", customer: "Riverbend Facilities", amount: 4350, status: "open", days_overdue: 0 },
  { id: "INV-3104", customer: "Summit Ridge Contracting", amount: 5125, status: "open", days_overdue: 0 },
];

const leads = [
  { id: "L-708", company: "Chinook Commercial Services", source: "Trade show", status: "stale", estimated_value: 7800, last_touch_hours: 216 },
  { id: "L-710", company: "Foothills Commercial HVAC", source: "Website form", status: "follow_up_due", estimated_value: 9200, last_touch_hours: 56 },
  { id: "L-711", company: "Bridgeway Builders", source: "Referral", status: "new", estimated_value: 4100, last_touch_hours: 4 },
  { id: "L-712", company: "Cedar Park Property Group", source: "Website form", status: "follow_up_due", estimated_value: 5400, last_touch_hours: 50 },
  { id: "L-713", company: "Highline Electrical", source: "Website form", status: "new", estimated_value: 3000, last_touch_hours: 6 },
];

const tickets = [
  { id: "T-879", customer: "Lethbridge Service Group", status: "waiting", age_hours: 26 },
  { id: "T-881", customer: "Apex Facility Services", status: "escalated", age_hours: 18 },
  { id: "T-882", customer: "Westbrook Property Group", status: "waiting", age_hours: 9 },
  { id: "T-884", customer: "Calgary West Property", status: "escalated", age_hours: 41 },
  { id: "T-885", customer: "Riverbend Facilities", status: "waiting", age_hours: 14 },
];

const inventory = [
  { sku: "REL-220", name: "Relay control module", stock: 2, reorder_point: 8, supplier_status: "late" },
  { sku: "SNS-410", name: "Signal sensor kit", stock: 11, reorder_point: 10, supplier_status: "ok" },
  { sku: "CTRL-115", name: "Controller board", stock: 4, reorder_point: 6, supplier_status: "ok" },
  { sku: "VLV-085", name: "Pressure valve assembly", stock: 0, reorder_point: 5, supplier_status: "backordered" },
  { sku: "CBL-340", name: "Shielded cable spool", stock: 26, reorder_point: 12, supplier_status: "ok" },
  { sku: "PWR-510", name: "Power supply unit", stock: 9, reorder_point: 6, supplier_status: "ok" },
];

let demoRules: ThresholdRules = { ...defaultRules };
let demoReports: StructuredReport[] = [...reportHistory];

type ReportSections = {
  summary: string;
  changes: string[];
  risks: string[];
  recommendedActions: string[];
  sourceRecords: string[];
  detail: string;
};

function objectValue(payload: unknown, key: string): unknown {
  return payload && typeof payload === "object" ? (payload as Record<string, unknown>)[key] : undefined;
}

function asReportType(value: unknown): ReportType {
  return typeof value === "string" && reportTypes.includes(value as ReportType)
    ? (value as ReportType)
    : "daily_owner_brief";
}

function asReportTone(value: unknown): ReportTone {
  return typeof value === "string" && reportTones.includes(value as ReportTone)
    ? (value as ReportTone)
    : "owner_friendly";
}

function money(value: number): string {
  return `$${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function clampNumber(value: unknown, fallback: number, min: number, max: number): number {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, Math.round(parsed)));
}

function formatDateLabel(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
    .format(date)
    .replace(" at ", " - ");
}

function formatGeneratedAtLabel(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
    .format(date)
    .replace(",", " -");
}

function reportIdDate(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
    .format(date)
    .replace(/[-,:\s]/g, "");
}

function normalizeRules(payload: unknown): ThresholdRules {
  return (Object.keys(defaultRules) as (keyof ThresholdRules)[]).reduce(
    (rules, field) => {
      const bounds = ruleBounds[field];
      rules[field] = clampNumber(objectValue(payload, field), defaultRules[field], bounds.min, bounds.max);
      return rules;
    },
    { ...defaultRules },
  );
}

function ownerBriefSections(): ReportSections {
  return {
    summary: dashboardPayload.aiDailyBrief.summary,
    changes: dashboardPayload.aiDailyBrief.changes,
    risks: dashboardPayload.aiDailyBrief.risks,
    recommendedActions: dashboardPayload.aiDailyBrief.recommendedActions,
    sourceRecords: dashboardPayload.priorityQueue.slice(0, 4).map((item) => item.affectedRecord),
    detail: "Open book: 14 orders, 3 overdue invoices, and 5 tickets waiting for a next step.",
  };
}

function dispatchSections(): ReportSections {
  return {
    summary: "1 job is blocked and 2 are at risk out of 6 open dispatch jobs.",
    changes: [
      "Job J-220 (Apex Facility Services) is blocked because REL-220 is below reorder point.",
      "Job J-221 (Canyon Ridge Mechanical) is at risk because order PS-1049 is delayed.",
      "Job J-223 (Calgary West Property) is at risk because the technician window is double-booked.",
    ],
    risks: [
      "Job J-220 depends on inventory that is already below reorder point.",
      "Cole Nguyen carries 2 of the 6 open jobs, leaving little slack if anything slips.",
    ],
    recommendedActions: [
      "Resolve REL-220 supply before tomorrow's Apex install window.",
      "Rebalance the double-booked morning window with a second technician.",
      "Confirm new timing with Canyon Ridge Mechanical before the crew rolls.",
    ],
    sourceRecords: ["J-220", "J-221", "J-223", "REL-220"],
    detail: "Technician load: Cole Nguyen (2), Marcus Webb (2), Nadia Ellis (2).",
  };
}

function financeSections(): ReportSections {
  const overdue = invoices.filter((invoice) => invoice.status === "overdue");
  const total = overdue.reduce((sum, invoice) => sum + invoice.amount, 0);
  const highValue = overdue.filter((invoice) => invoice.amount > 5000);

  return {
    summary: `${overdue.length} invoices are overdue totalling ${money(total)}, with ${money(
      highValue.reduce((sum, invoice) => sum + invoice.amount, 0),
    )} of that in high-value accounts.`,
    changes: overdue.map(
      (invoice) =>
        `${invoice.id} - ${invoice.customer}, ${money(invoice.amount)}, ${invoice.days_overdue} days overdue.`,
    ),
    risks: [
      "North Gate Maintenance has both an overdue balance and delayed order work.",
      "INV-3096 has aged past 14 days and needs a firmer follow-up.",
      "Calgary West Property has an escalated ticket alongside an overdue invoice.",
    ],
    recommendedActions: overdue.map(
      (invoice) => `Send a payment follow-up to ${invoice.customer} for ${invoice.id} (${money(invoice.amount)}).`,
    ),
    sourceRecords: overdue.map((invoice) => invoice.id),
    detail: "Receivables snapshot: 3 open invoices worth $13,150 are still inside terms.",
  };
}

function leadSections(): ReportSections {
  const activeLeads = leads.filter((lead) => ["new", "follow_up_due", "stale"].includes(lead.status));
  const due = activeLeads.filter((lead) => lead.status === "follow_up_due");
  const stale = activeLeads.filter((lead) => lead.status === "stale");
  const newLeads = activeLeads.filter((lead) => lead.status === "new");
  const pipelineValue = activeLeads.reduce((sum, lead) => sum + lead.estimated_value, 0);

  return {
    summary: `${newLeads.length} new leads and ${due.length} follow-ups due, with ${money(
      pipelineValue,
    )} of active pipeline needing a touch.`,
    changes: [...newLeads, ...due].map(
      (lead) => `${lead.id} - ${lead.company} (${lead.source}), est. ${money(lead.estimated_value)}.`,
    ),
    risks: [...due, ...stale]
      .filter((lead) => lead.last_touch_hours > 48)
      .map((lead) => `${lead.id} - ${lead.company} untouched for ${lead.last_touch_hours} hours and going cold.`),
    recommendedActions: [
      "Foothills Commercial HVAC: check in and offer a quick discovery call.",
      "Cedar Park Property Group: check in and offer a quick discovery call.",
      "Chinook Commercial Services: re-engage with a recent delivery win and a low-pressure ask.",
      "Bridgeway Builders: send an intro with a same-day quote turnaround offer.",
      "Highline Electrical: send an intro with a same-day quote turnaround offer.",
    ],
    sourceRecords: activeLeads.map((lead) => lead.id),
    detail: "Sources this week: Referral, Trade show, Website form.",
  };
}

const sectionBuilders: Record<ReportType, () => ReportSections> = {
  daily_owner_brief: ownerBriefSections,
  dispatch_risk_scan: dispatchSections,
  finance_follow_up: financeSections,
  lead_follow_up_digest: leadSections,
};

function shapeSections(sections: ReportSections, tone: ReportTone): ReportSections {
  if (tone === "concise") {
    return {
      ...sections,
      summary: sections.summary.split(": ")[0],
      changes: sections.changes.slice(0, 3),
      risks: sections.risks.slice(0, 2),
      recommendedActions: sections.recommendedActions.slice(0, 3),
    };
  }

  if (tone === "detailed") {
    return {
      ...sections,
      summary: `${sections.summary} ${sections.detail}`,
    };
  }

  return sections;
}

export function getDemoDashboardPayload(): DashboardPayload {
  return {
    ...dashboardPayload,
    dateLabel: formatDateLabel(new Date()),
  };
}

export function getDemoAutomations(): AutomationsPayload {
  return {
    automations: dashboardPayload.automations,
    rules: { ...demoRules },
  };
}

export function getDemoReportHistory(): StructuredReport[] {
  return demoReports;
}

export function generateDemoReport(payload: unknown): StructuredReport {
  const reportType = asReportType(objectValue(payload, "report_type"));
  const tone = asReportTone(objectValue(payload, "tone"));
  const now = new Date();
  const sections = shapeSections(sectionBuilders[reportType](), tone);

  const report: StructuredReport = {
    id: `report_${reportType}_${reportIdDate(now)}`,
    title: reportTitles[reportType],
    reportType,
    tone,
    audience: reportAudiences[reportType],
    generatedAt: now.toISOString(),
    generatedAtLabel: formatGeneratedAtLabel(now),
    summary: sections.summary,
    changes: sections.changes,
    risks: sections.risks,
    recommendedActions: sections.recommendedActions,
    sourceRecords: sections.sourceRecords,
  };

  demoReports = [report, ...demoReports.filter((item) => item.id !== report.id)].slice(0, 25);
  return report;
}

export function previewDemoRules(payload: unknown): RulePreview {
  const rules = normalizeRules(payload);
  const overdue = invoices.filter(
    (invoice) => invoice.status === "overdue" && invoice.days_overdue >= rules.invoice_overdue_days,
  );
  const untouched = leads.filter((lead) => lead.last_touch_hours >= rules.lead_untouched_hours);
  const agingTickets = tickets.filter(
    (ticket) =>
      (ticket.status === "waiting" || ticket.status === "escalated") &&
      ticket.age_hours >= rules.ticket_age_hours,
  );
  const lowStock = inventory.filter((item) => item.stock <= item.reorder_point + rules.inventory_buffer_units);

  const matches = [
    {
      id: "invoice_overdue",
      label: `Invoices over ${rules.invoice_overdue_days} days overdue`,
      count: overdue.length,
      records: overdue.map((invoice) => invoice.id),
    },
    {
      id: "lead_untouched",
      label: `Leads untouched for ${rules.lead_untouched_hours}+ hours`,
      count: untouched.length,
      records: untouched.map((lead) => lead.id),
    },
    {
      id: "ticket_age",
      label: `Open tickets older than ${rules.ticket_age_hours} hours`,
      count: agingTickets.length,
      records: agingTickets.map((ticket) => ticket.id),
    },
    {
      id: "inventory_low",
      label: rules.inventory_buffer_units
        ? `Stock within ${rules.inventory_buffer_units} units of reorder point`
        : "Stock at or below reorder point",
      count: lowStock.length,
      records: lowStock.map((item) => item.sku),
    },
  ];

  return {
    rules: matches,
    total: matches.reduce((sum, match) => sum + match.count, 0),
  };
}

export function saveDemoRules(payload: unknown): ThresholdRules {
  demoRules = normalizeRules(payload);
  return { ...demoRules };
}

export function answerDemoQuestion(payload: unknown): AssistantResponse {
  const question = String(objectValue(payload, "question") ?? "");
  const normalized = question.toLowerCase();
  const priorities = dashboardPayload.priorityQueue;
  const top = priorities[0];

  if (top && (normalized.includes("first") || normalized.includes("priority"))) {
    return {
      answer: `The top priority is ${top.affectedRecord}: ${top.whyItMatters} Fastest next step - ${top.recommendedAction.toLowerCase()}`,
      sourceRecords: [top.affectedRecord],
    };
  }

  if (normalized.includes("customer") && normalized.includes("risk")) {
    return {
      answer:
        "3 customers carry compounding risk right now: Apex Facility Services (blocked order PS-1048, escalated ticket T-881); North Gate Maintenance (delayed order PS-1051, overdue invoice INV-3101); Calgary West Property (overdue invoice INV-3098, escalated ticket T-884).",
      sourceRecords: ["PS-1048", "T-881", "PS-1051", "INV-3101", "INV-3098", "T-884"],
    };
  }

  if (normalized.includes("invoice") || normalized.includes("finance")) {
    return {
      answer:
        "Invoice INV-3101 for North Gate Maintenance is the main finance risk - $6,230, 16 days overdue. 3 invoices are overdue in total.",
      sourceRecords: ["INV-3096", "INV-3098", "INV-3101"],
    };
  }

  if (normalized.includes("lead")) {
    return {
      answer:
        "Lead L-710 from Foothills Commercial HVAC should be contacted today - estimated value $9,200, untouched for 56 hours. L-712 is also due for follow-up.",
      sourceRecords: ["L-710", "L-712"],
    };
  }

  if (normalized.includes("changed") || normalized.includes("yesterday")) {
    return {
      answer: `Since yesterday: ${dashboardPayload.aiDailyBrief.changes.join(" ")}`,
      sourceRecords: priorities.slice(0, 3).map((item) => item.affectedRecord),
    };
  }

  if (normalized.includes("draft") || normalized.includes("owner") || normalized.includes("update")) {
    return {
      answer: `Owner update - ${dashboardPayload.aiDailyBrief.summary} Top actions: ${dashboardPayload.aiDailyBrief.recommendedActions
        .map((action, index) => `${index + 1}) ${action}`)
        .join(" ")}`,
      sourceRecords: priorities.slice(0, 3).map((item) => item.affectedRecord),
    };
  }

  return {
    answer:
      "Today is mostly stable, but the dashboard is flagging 6 items: blocked priority work, overdue receivables, warm leads waiting on follow-up, and low inventory that could affect dispatch.",
    sourceRecords: priorities.slice(0, 3).map((item) => item.affectedRecord),
  };
}

