export type PriorityLevel = "high" | "medium" | "low";

export type KpiStatus = "good" | "watch" | "risk";

export type KpiMetric = {
  label: string;
  value: string | number;
  delta?: string;
  status: KpiStatus;
};

export type PriorityItem = {
  id: string;
  level: PriorityLevel;
  title: string;
  affectedRecord: string;
  whyItMatters: string;
  recommendedAction: string;
  owner: string;
  due: string;
};

export type AiDailyBrief = {
  generatedAt: string;
  summary: string;
  changes: string[];
  risks: string[];
  recommendedActions: string[];
};

export type SourceSync = {
  id: string;
  name: string;
  status: "synced" | "warning" | "failed";
  lastSync: string;
  recordsProcessed: number;
};

export type AutomationStatus = {
  id: string;
  name: string;
  schedule: string;
  lastRun: string;
  status: "active" | "paused" | "warning";
  result: string;
};

export type ActivityEvent = {
  id: string;
  time: string;
  label: string;
  kind: "sync" | "report" | "alert" | "user";
};

export type ReportType =
  | "daily_owner_brief"
  | "dispatch_risk_scan"
  | "finance_follow_up"
  | "lead_follow_up_digest";

export type ReportTone = "concise" | "owner_friendly" | "detailed";

export type StructuredReport = {
  id: string;
  title: string;
  reportType: ReportType;
  tone: ReportTone;
  audience: string;
  generatedAt: string;
  generatedAtLabel: string;
  summary: string;
  changes: string[];
  risks: string[];
  recommendedActions: string[];
  sourceRecords: string[];
};

export type ThresholdRules = {
  invoice_overdue_days: number;
  lead_untouched_hours: number;
  ticket_age_hours: number;
  inventory_buffer_units: number;
};

export type RuleMatch = {
  id: string;
  label: string;
  count: number;
  records: string[];
};

export type RulePreview = {
  rules: RuleMatch[];
  total: number;
};

export type AutomationsPayload = {
  automations: AutomationStatus[];
  rules: ThresholdRules;
};

export type AssistantResponse = {
  answer: string;
  sourceRecords: string[];
};

export type DashboardPayload = {
  business: {
    name: string;
    industry: string;
    location: string;
  };
  operator: {
    name: string;
    role: string;
  };
  dateLabel: string;
  metrics: KpiMetric[];
  aiDailyBrief: AiDailyBrief;
  priorityQueue: PriorityItem[];
  sources: SourceSync[];
  automations: AutomationStatus[];
  activity: ActivityEvent[];
};
