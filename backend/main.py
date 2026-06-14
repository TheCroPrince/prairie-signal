import os
from datetime import timedelta

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from report_pipeline import (
    answer_question,
    build_daily_brief,
    build_metrics,
    build_priority_queue,
    preview_rules,
)
from schemas import (
    AssistantRequest,
    AssistantResponse,
    AutomationsPayload,
    DashboardPayload,
    ReportRequest,
    RulePreview,
    StructuredReport,
    ThresholdRules,
)
from seed_data import get_seed_data, now, time_label
from summarizer import _label, generate_report

app = FastAPI(title="AI Workflow Dashboard API", version="0.3.0")

# Origins allowed to call the API. Defaults to local dev; set ALLOWED_ORIGINS to
# a comma-separated list (e.g. the deployed frontend URL) in production.
_default_origins = "http://localhost:3000,http://127.0.0.1:3000"
allowed_origins = [
    origin.strip()
    for origin in os.environ.get("ALLOWED_ORIGINS", _default_origins).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _seed_report_history() -> list[StructuredReport]:
    """Past runs that line up with the automation cards' last-run times."""
    data = get_seed_data()
    today = now().replace(minute=0, second=0, microsecond=0)
    runs = [
        ("lead_follow_up_digest", (today - timedelta(days=1)).replace(hour=15)),
        ("daily_owner_brief", today.replace(hour=7, minute=30)),
        ("dispatch_risk_scan", today.replace(hour=8)),
    ]
    history = []
    for report_type, ran_at in runs:
        report = generate_report(data, report_type, "owner_friendly")
        history.append(
            report.model_copy(
                update={
                    "id": f"report_{report_type}_{ran_at:%Y%m%d_%H%M%S}",
                    "generatedAt": ran_at.isoformat(),
                    "generatedAtLabel": _label(ran_at),
                }
            )
        )
    return history


# In-memory stores are enough for the demo; a client build would persist these
REPORT_HISTORY: list[StructuredReport] = _seed_report_history()
MAX_HISTORY = 25

ACTIVITY_LOG: list[dict] = get_seed_data()["activity"]
MAX_ACTIVITY = 12

CURRENT_RULES = ThresholdRules()


def _log_activity(label: str, kind: str) -> None:
    ACTIVITY_LOG.append(
        {"id": f"evt-{now():%H%M%S%f}", "time": time_label(), "label": label, "kind": kind}
    )
    del ACTIVITY_LOG[:-MAX_ACTIVITY]


@app.get("/health")
def health() -> dict:
    return {"ok": True, "service": "ai-workflow-dashboard-api"}


@app.get("/dashboard/today", response_model=DashboardPayload)
def dashboard_today() -> DashboardPayload:
    data = get_seed_data()

    return DashboardPayload(
        business=data["business"],
        operator=data["operator"],
        dateLabel=data["date_label"],
        metrics=build_metrics(data),
        aiDailyBrief=build_daily_brief(data),
        priorityQueue=build_priority_queue(data),
        sources=data["sources"],
        automations=data["automations"],
        activity=ACTIVITY_LOG,
    )


@app.post("/reports/generate", response_model=StructuredReport)
def create_report(payload: ReportRequest) -> StructuredReport:
    data = get_seed_data()
    report = generate_report(data, payload.report_type, payload.tone, payload.date_range)
    REPORT_HISTORY.append(report)
    del REPORT_HISTORY[:-MAX_HISTORY]
    _log_activity(f"Report generated — {report.title}", "report")
    return report


@app.get("/reports", response_model=list[StructuredReport])
def list_reports() -> list[StructuredReport]:
    return sorted(REPORT_HISTORY, key=lambda r: r.generatedAt, reverse=True)


@app.get("/automations", response_model=AutomationsPayload)
def list_automations() -> AutomationsPayload:
    return AutomationsPayload(automations=get_seed_data()["automations"], rules=CURRENT_RULES)


@app.post("/automations/rules/preview", response_model=RulePreview)
def rules_preview(rules: ThresholdRules) -> RulePreview:
    matches = preview_rules(get_seed_data(), rules)
    return RulePreview(rules=matches, total=sum(match.count for match in matches))


@app.post("/automations/rules", response_model=ThresholdRules)
def save_rules(rules: ThresholdRules) -> ThresholdRules:
    global CURRENT_RULES
    changed = [
        field for field in ThresholdRules.model_fields
        if getattr(rules, field) != getattr(CURRENT_RULES, field)
    ]
    CURRENT_RULES = rules
    label = (
        "Alert thresholds updated — " + ", ".join(field.replace("_", " ") for field in changed)
        if changed
        else "Alert thresholds saved with no changes"
    )
    _log_activity(label, "user")
    return CURRENT_RULES


@app.post("/assistant/query", response_model=AssistantResponse)
def assistant_query(payload: AssistantRequest) -> AssistantResponse:
    data = get_seed_data()
    answer, source_records = answer_question(data, payload.question)
    return AssistantResponse(answer=answer, sourceRecords=source_records)
