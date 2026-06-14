from typing import Literal

from pydantic import BaseModel, Field

PriorityLevel = Literal["high", "medium", "low"]
Status = Literal["good", "watch", "risk"]


class Business(BaseModel):
    name: str
    industry: str
    location: str


class Operator(BaseModel):
    name: str
    role: str


class KpiMetric(BaseModel):
    label: str
    value: str | int | float
    delta: str | None = None
    status: Status


class PriorityItem(BaseModel):
    id: str
    level: PriorityLevel
    title: str
    affectedRecord: str
    whyItMatters: str
    recommendedAction: str
    owner: str
    due: str


class AiDailyBrief(BaseModel):
    generatedAt: str
    summary: str
    changes: list[str]
    risks: list[str]
    recommendedActions: list[str]


class SourceSync(BaseModel):
    id: str
    name: str
    status: Literal["synced", "warning", "failed"]
    lastSync: str
    recordsProcessed: int


class AutomationStatus(BaseModel):
    id: str
    name: str
    schedule: str
    lastRun: str
    status: Literal["active", "paused", "warning"]
    result: str


class ActivityEvent(BaseModel):
    id: str
    time: str
    label: str
    kind: Literal["sync", "report", "alert", "user"]


class DashboardPayload(BaseModel):
    business: Business
    operator: Operator
    dateLabel: str
    metrics: list[KpiMetric]
    aiDailyBrief: AiDailyBrief
    priorityQueue: list[PriorityItem]
    sources: list[SourceSync]
    automations: list[AutomationStatus]
    activity: list[ActivityEvent]


ReportType = Literal[
    "daily_owner_brief",
    "dispatch_risk_scan",
    "finance_follow_up",
    "lead_follow_up_digest",
]

ReportTone = Literal["concise", "owner_friendly", "detailed"]


class ReportRequest(BaseModel):
    report_type: ReportType
    date_range: Literal["today", "yesterday", "week"] = "today"
    tone: ReportTone = "owner_friendly"


class StructuredReport(BaseModel):
    id: str
    title: str
    reportType: ReportType
    tone: ReportTone
    audience: str
    generatedAt: str
    generatedAtLabel: str
    summary: str
    changes: list[str]
    risks: list[str]
    recommendedActions: list[str]
    sourceRecords: list[str]


class AssistantRequest(BaseModel):
    question: str


class AssistantResponse(BaseModel):
    answer: str
    sourceRecords: list[str]


class ThresholdRules(BaseModel):
    invoice_overdue_days: int = Field(default=7, ge=1, le=30)
    lead_untouched_hours: int = Field(default=48, ge=12, le=168)
    ticket_age_hours: int = Field(default=24, ge=6, le=72)
    inventory_buffer_units: int = Field(default=0, ge=0, le=10)


class RuleMatch(BaseModel):
    id: str
    label: str
    count: int
    records: list[str]


class RulePreview(BaseModel):
    rules: list[RuleMatch]
    total: int


class AutomationsPayload(BaseModel):
    automations: list[AutomationStatus]
    rules: ThresholdRules
