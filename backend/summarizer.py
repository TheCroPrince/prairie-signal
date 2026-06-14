"""Report generation behind a provider adapter.

The default MockSummaryProvider builds readable, type-specific reports from
the structured facts in report_pipeline — fully deterministic, no API key.
A real LLM provider can implement the same interface later and be selected
with LLM_PROVIDER without changing any endpoint or UI code.
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from datetime import datetime

from report_pipeline import build_daily_brief, build_priority_queue
from schemas import StructuredReport
from seed_data import TIMEZONE

TITLES = {
    "daily_owner_brief": "Daily Owner Brief",
    "dispatch_risk_scan": "Dispatch Risk Scan",
    "finance_follow_up": "Finance Follow-up Brief",
    "lead_follow_up_digest": "Lead Follow-up Digest",
}

AUDIENCES = {
    "daily_owner_brief": "Owner / GM",
    "dispatch_risk_scan": "Dispatch lead",
    "finance_follow_up": "Finance / admin",
    "lead_follow_up_digest": "Sales / admin",
}


@dataclass
class ReportContext:
    data: dict
    report_type: str
    tone: str
    date_range: str = "today"


def _money(amount: float) -> str:
    return f"${amount:,.0f}"


def _label(timestamp: datetime) -> str:
    hour = timestamp.strftime("%I").lstrip("0")
    return f"{timestamp:%b} {timestamp.day} · {hour}:{timestamp:%M} {timestamp:%p}"


class SummaryProvider:
    def summarize(self, context: ReportContext) -> StructuredReport:
        raise NotImplementedError


class MockSummaryProvider(SummaryProvider):
    """Deterministic rule-based summarizer. Every claim traces to seed records."""

    def summarize(self, context: ReportContext) -> StructuredReport:
        builders = {
            "daily_owner_brief": self._owner_brief,
            "dispatch_risk_scan": self._dispatch_scan,
            "finance_follow_up": self._finance_follow_up,
            "lead_follow_up_digest": self._lead_digest,
        }
        sections = builders[context.report_type](context.data)
        return self._shape(context, sections)

    # ------------------------------ type builders ------------------------------

    def _owner_brief(self, data: dict) -> dict:
        brief = build_daily_brief(data)
        priorities = build_priority_queue(data, limit=4)
        return {
            "summary": brief.summary,
            "changes": brief.changes,
            "risks": brief.risks,
            "actions": brief.recommendedActions,
            "records": [item.affectedRecord for item in priorities],
            "detail": (
                f"Open book: {len(data['orders'])} orders, "
                f"{sum(1 for i in data['invoices'] if i['status'] == 'overdue')} overdue invoices, "
                f"{sum(1 for t in data['tickets'] if t['status'] in {'waiting', 'escalated'})} tickets waiting."
            ),
        }

    def _dispatch_scan(self, data: dict) -> dict:
        jobs = data["dispatch_jobs"]
        blocked = [j for j in jobs if j["status"] == "blocked"]
        at_risk = [j for j in jobs if j["status"] == "at_risk"]
        open_jobs = [j for j in jobs if j["status"] in {"scheduled", "at_risk", "blocked"}]

        low_stock = {item["sku"] for item in data["inventory"] if item["stock"] <= item["reorder_point"]}
        inventory_hits = [
            j for j in blocked + at_risk if any(sku in j.get("risk_reason", "") for sku in low_stock)
        ]

        workload: dict[str, int] = {}
        for job in open_jobs:
            workload[job["technician"]] = workload.get(job["technician"], 0) + 1
        busiest = max(workload.items(), key=lambda pair: pair[1])

        return {
            "summary": (
                f"{len(blocked)} job is blocked and {len(at_risk)} are at risk "
                f"out of {len(open_jobs)} open dispatch jobs."
            ),
            "changes": [
                f"Job {j['id']} ({j['customer']}) is {j['status'].replace('_', ' ')} — {j['risk_reason']}."
                for j in blocked + at_risk
            ],
            "risks": [
                *(
                    f"Job {j['id']} depends on inventory that is below reorder point."
                    for j in inventory_hits
                ),
                f"{busiest[0]} carries {busiest[1]} of the {len(open_jobs)} open jobs — little slack if anything slips.",
            ],
            "actions": [
                "Resolve REL-220 supply before tomorrow's Apex install window.",
                "Rebalance the double-booked morning window with a second technician.",
                "Confirm new timing with Canyon Ridge Mechanical before the crew rolls.",
            ],
            "records": [j["id"] for j in blocked + at_risk] + sorted(low_stock & {"REL-220"}),
            "detail": f"Technician load: {', '.join(f'{name} ({count})' for name, count in sorted(workload.items()))}.",
        }

    def _finance_follow_up(self, data: dict) -> dict:
        invoices = data["invoices"]
        overdue = sorted(
            (i for i in invoices if i["status"] == "overdue"),
            key=lambda i: -i["amount"],
        )
        total = sum(i["amount"] for i in overdue)
        high_value = [i for i in overdue if i["amount"] > 5000]

        troubled_orders = {o["customer"] for o in data["orders"] if o["status"] in {"blocked", "delayed"}}
        overlap = [i for i in overdue if i["customer"] in troubled_orders]

        return {
            "summary": (
                f"{len(overdue)} invoices are overdue totalling {_money(total)}, "
                f"with {_money(sum(i['amount'] for i in high_value))} of that in high-value accounts."
            ),
            "changes": [
                f"{i['id']} — {i['customer']}, {_money(i['amount'])}, {i['days_overdue']} days overdue."
                for i in overdue
            ],
            "risks": [
                *(
                    f"{i['customer']} has both an overdue balance and troubled order work — "
                    "hold new dispatch commitments until payment lands."
                    for i in overlap
                ),
                *(
                    f"{i['id']} has aged past 14 days and needs a firmer follow-up."
                    for i in overdue
                    if i["days_overdue"] > 14 and i not in overlap
                ),
            ],
            "actions": [
                f"Send a payment follow-up to {i['customer']} for {i['id']} ({_money(i['amount'])})."
                for i in overdue
            ],
            "records": [i["id"] for i in overdue],
            "detail": (
                f"Receivables snapshot: {len([i for i in invoices if i['status'] == 'open'])} open invoices "
                f"worth {_money(sum(i['amount'] for i in invoices if i['status'] == 'open'))} still inside terms."
            ),
        }

    def _lead_digest(self, data: dict) -> dict:
        leads = data["leads"]
        new = [lead for lead in leads if lead["status"] == "new"]
        due = [lead for lead in leads if lead["status"] == "follow_up_due"]
        stale = [lead for lead in leads if lead["status"] == "stale"]
        pipeline_value = sum(lead["estimated_value"] for lead in new + due + stale)

        next_message = {
            "new": "send an intro with a same-day quote turnaround offer",
            "follow_up_due": "check in and offer a quick discovery call",
            "stale": "re-engage with a recent delivery win and a low-pressure ask",
        }

        return {
            "summary": (
                f"{len(new)} new leads and {len(due)} follow-ups due, "
                f"with {_money(pipeline_value)} of active pipeline needing a touch."
            ),
            "changes": [
                f"{lead['id']} — {lead['company']} ({lead['source']}), est. {_money(lead['estimated_value'])}."
                for lead in new + due
            ],
            "risks": [
                f"{lead['id']} — {lead['company']} untouched for {lead['last_touch_hours']} hours and going cold."
                for lead in due + stale
                if lead["last_touch_hours"] > 48
            ],
            "actions": [
                f"{lead['company']}: {next_message[lead['status']]}."
                for lead in due + stale + new
            ],
            "records": [lead["id"] for lead in new + due + stale],
            "detail": f"Sources this week: {', '.join(sorted({lead['source'] for lead in leads}))}.",
        }

    # -------------------------------- tone shaping --------------------------------

    def _shape(self, context: ReportContext, sections: dict) -> StructuredReport:
        tone = context.tone
        summary = sections["summary"]
        changes = sections["changes"]
        risks = sections["risks"]
        actions = sections["actions"]

        if tone == "concise":
            summary = summary.split(": ")[0] if ": " in summary else summary
            changes, risks, actions = changes[:3], risks[:2], actions[:3]
        elif tone == "detailed":
            summary = f"{summary} {sections['detail']}"

        timestamp = datetime.now(TIMEZONE)
        return StructuredReport(
            id=f"report_{context.report_type}_{timestamp:%Y%m%d_%H%M%S}",
            title=TITLES[context.report_type],
            reportType=context.report_type,
            tone=tone,
            audience=AUDIENCES[context.report_type],
            generatedAt=timestamp.isoformat(),
            generatedAtLabel=_label(timestamp),
            summary=summary,
            changes=changes,
            risks=risks,
            recommendedActions=actions,
            sourceRecords=sections["records"],
        )


def get_provider() -> SummaryProvider:
    # Only the mock provider ships with the demo; a real adapter slots in here
    provider = os.environ.get("LLM_PROVIDER", "mock")
    if provider != "mock":
        raise ValueError(f"Unknown LLM_PROVIDER '{provider}' — only 'mock' is available in the demo")
    return MockSummaryProvider()


def generate_report(data: dict, report_type: str, tone: str, date_range: str = "today") -> StructuredReport:
    context = ReportContext(data=data, report_type=report_type, tone=tone, date_range=date_range)
    return get_provider().summarize(context)
