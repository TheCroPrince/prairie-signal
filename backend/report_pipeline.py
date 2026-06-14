"""Turns seeded operational records into KPIs, a ranked priority queue, and
a readable daily brief.

Everything here is deterministic on purpose: scoring follows a simple additive
weight model, and the brief is assembled from rule-based sentences so the demo
runs without any LLM key. A provider adapter can replace the summarizer later
without touching the scoring.
"""

from __future__ import annotations

from datetime import date

from schemas import AiDailyBrief, KpiMetric, PriorityItem, RuleMatch, ThresholdRules
from seed_data import now

# Additive priority weights; scores map to high (8+), medium (4-7), low (0-3)
WEIGHT_DUE_TODAY = 3
WEIGHT_DUE_TOMORROW = 2
WEIGHT_HIGH_PRIORITY_CUSTOMER = 3
WEIGHT_HIGH_VALUE = 2  # revenue over $5,000
WEIGHT_BLOCKED = 4
WEIGHT_DELAYED = 3
WEIGHT_INVOICE_OVERDUE_14D = 3
WEIGHT_LEAD_UNTOUCHED_48H = 2
WEIGHT_ESCALATED_TICKET = 3
WEIGHT_BELOW_REORDER = 2
WEIGHT_SUPPLIER_PROBLEM = 2

HIGH_VALUE_THRESHOLD = 5000


def _level(score: int) -> str:
    if score >= 8:
        return "high"
    if score >= 4:
        return "medium"
    return "low"


def _days_until(iso_date: str) -> int:
    return (date.fromisoformat(iso_date) - now().date()).days


def _due_weight(days: int) -> int:
    if days <= 0:
        return WEIGHT_DUE_TODAY
    if days == 1:
        return WEIGHT_DUE_TOMORROW
    return 0


def _due_label(days: int) -> str:
    if days <= 0:
        return "Today"
    if days == 1:
        return "Tomorrow"
    return "This week"


def _money(amount: float) -> str:
    return f"${amount:,.0f}"


# ------------------------------ candidate scoring ------------------------------


def _order_candidates(orders: list[dict]) -> list[tuple[int, PriorityItem]]:
    candidates = []
    for order in orders:
        if order["status"] not in {"blocked", "delayed"}:
            continue

        days = _days_until(order["due_date"])
        score = _due_weight(days)
        score += WEIGHT_BLOCKED if order["status"] == "blocked" else WEIGHT_DELAYED
        if order["priority"] == "high":
            score += WEIGHT_HIGH_PRIORITY_CUSTOMER
        if order["value"] > HIGH_VALUE_THRESHOLD:
            score += WEIGHT_HIGH_VALUE

        blocker = order.get("blocker", "an unresolved dependency")
        affected = f"Order {order['id']}"
        if order.get("linked_job"):
            affected += f" / Job {order['linked_job']}"

        why = f"{order['customer']} has a {_money(order['value'])} order due {_due_label(days).lower()}"
        why += " and is a priority customer." if order["priority"] == "high" else f" held up by: {blocker.lower()}."

        candidates.append(
            (
                score,
                PriorityItem(
                    id=f"priority-{order['id']}",
                    level=_level(score),
                    title=(
                        f"Priority order blocked by low stock"
                        if order["status"] == "blocked" and "reorder" in blocker.lower()
                        else f"Order {order['status']} — {blocker.lower()}"
                    ),
                    affectedRecord=affected,
                    whyItMatters=why,
                    recommendedAction=order.get(
                        "action", f"Confirm new timing with {order['customer']} and update the order status."
                    ),
                    owner="Maya Singh",
                    due=_due_label(days),
                ),
            )
        )
    return candidates


def _invoice_candidates(invoices: list[dict]) -> list[tuple[int, PriorityItem]]:
    candidates = []
    for invoice in invoices:
        if invoice["status"] != "overdue":
            continue

        score = WEIGHT_DUE_TODAY  # overdue work is always due now
        if invoice["days_overdue"] > 14:
            score += WEIGHT_INVOICE_OVERDUE_14D
        if invoice["amount"] > HIGH_VALUE_THRESHOLD:
            score += WEIGHT_HIGH_VALUE

        candidates.append(
            (
                score,
                PriorityItem(
                    id=f"priority-{invoice['id']}",
                    level=_level(score),
                    title=(
                        f"High-value invoice is {invoice['days_overdue']} days overdue"
                        if invoice["amount"] > HIGH_VALUE_THRESHOLD
                        else f"Invoice {invoice['days_overdue']} days overdue"
                    ),
                    affectedRecord=f"Invoice {invoice['id']}",
                    whyItMatters=(
                        f"{invoice['customer']} owes {_money(invoice['amount'])}, "
                        f"now {invoice['days_overdue']} days past terms."
                    ),
                    recommendedAction=invoice.get(
                        "action", f"Send a payment reminder to {invoice['customer']} today."
                    ),
                    owner="Lena Hart",
                    due="Today",
                ),
            )
        )
    return candidates


def _lead_candidates(leads: list[dict]) -> list[tuple[int, PriorityItem]]:
    candidates = []
    for lead in leads:
        if lead["status"] not in {"follow_up_due", "stale"}:
            continue

        score = 0
        if lead["last_touch_hours"] > 48:
            score += WEIGHT_LEAD_UNTOUCHED_48H
        if lead["estimated_value"] > HIGH_VALUE_THRESHOLD:
            score += WEIGHT_HIGH_VALUE
        if lead["status"] == "follow_up_due":
            score += WEIGHT_DUE_TODAY

        candidates.append(
            (
                score,
                PriorityItem(
                    id=f"priority-{lead['id']}",
                    level=_level(score),
                    title="Warm lead needs follow-up" if lead["status"] == "follow_up_due" else "Stale lead worth reviving",
                    affectedRecord=f"Lead {lead['id']}",
                    whyItMatters=(
                        f"{lead['company']} has an estimated value of {_money(lead['estimated_value'])} "
                        f"and has not been touched in {lead['last_touch_hours']} hours."
                    ),
                    recommendedAction=lead.get(
                        "action", f"Reach out to {lead['company']} with a short follow-up note today."
                    ),
                    owner="Maya Singh",
                    due="Today" if lead["status"] == "follow_up_due" else "This week",
                ),
            )
        )
    return candidates


def _ticket_candidates(tickets: list[dict]) -> list[tuple[int, PriorityItem]]:
    candidates = []
    for ticket in tickets:
        if ticket["status"] != "escalated":
            continue

        score = WEIGHT_ESCALATED_TICKET
        if ticket["priority"] == "high":
            score += WEIGHT_HIGH_PRIORITY_CUSTOMER
        if ticket["age_hours"] > 24:
            score += WEIGHT_DUE_TODAY

        candidates.append(
            (
                score,
                PriorityItem(
                    id=f"priority-{ticket['id']}",
                    level=_level(score),
                    title=f"Escalated {ticket['category'].lower()} ticket",
                    affectedRecord=f"Ticket {ticket['id']}",
                    whyItMatters=(
                        f"The {ticket['category'].lower()} involves {ticket['customer']} "
                        f"and is already {ticket['age_hours']} hours old."
                    ),
                    recommendedAction=ticket.get(
                        "action", f"Respond to {ticket['customer']} with a concrete resolution window."
                    ),
                    owner="Maya Singh",
                    due="Today",
                ),
            )
        )
    return candidates


def _inventory_candidates(inventory: list[dict]) -> list[tuple[int, PriorityItem]]:
    candidates = []
    for item in inventory:
        if item["stock"] > item["reorder_point"]:
            continue

        score = WEIGHT_BELOW_REORDER
        if item["supplier_status"] in {"late", "backordered"}:
            score += WEIGHT_SUPPLIER_PROBLEM
        if item["stock"] == 0:
            score += WEIGHT_DUE_TODAY

        candidates.append(
            (
                score,
                PriorityItem(
                    id=f"priority-{item['sku']}",
                    level=_level(score),
                    title=(
                        f"{item['name']} out of stock"
                        if item["stock"] == 0
                        else f"{item['name']} below reorder point"
                    ),
                    affectedRecord=f"SKU {item['sku']}",
                    whyItMatters=(
                        f"Stock is at {item['stock']} against a reorder point of {item['reorder_point']}"
                        + (
                            f" and the supplier is {item['supplier_status']}."
                            if item["supplier_status"] != "ok"
                            else "."
                        )
                    ),
                    recommendedAction=f"Add {item['sku']} to this week's replenishment order.",
                    owner="Cole Nguyen",
                    due="This week",
                ),
            )
        )
    return candidates


def build_priority_queue(data: dict, limit: int = 6) -> list[PriorityItem]:
    candidates = [
        *_order_candidates(data["orders"]),
        *_invoice_candidates(data["invoices"]),
        *_lead_candidates(data["leads"]),
        *_ticket_candidates(data["tickets"]),
        *_inventory_candidates(data["inventory"]),
    ]
    # Stable ordering: score first, then id so equal scores never reshuffle
    candidates.sort(key=lambda pair: (-pair[0], pair[1].id))
    return [item for _, item in candidates[:limit]]


# ----------------------------------- KPIs -----------------------------------


def build_metrics(data: dict) -> list[KpiMetric]:
    orders = data["orders"]
    tickets = data["tickets"]
    invoices = data["invoices"]
    leads = data["leads"]

    delayed = [o for o in orders if o["status"] == "delayed"]
    blocked = [o for o in orders if o["status"] == "blocked"]
    revenue_at_risk = sum(o["value"] for o in delayed + blocked)
    overdue = [i for i in invoices if i["status"] == "overdue"]
    overdue_total = sum(i["amount"] for i in overdue)
    waiting = [t for t in tickets if t["status"] in {"waiting", "escalated"}]
    escalated = [t for t in tickets if t["status"] == "escalated"]
    new_leads = [lead for lead in leads if lead["status"] == "new"]
    follow_ups = [lead for lead in leads if lead["status"] == "follow_up_due"]

    return [
        KpiMetric(
            label="Open Orders",
            value=len(orders),
            delta=f"{len(delayed) + len(blocked)} need review",
            status="watch",
        ),
        KpiMetric(
            label="Delayed Orders",
            value=len(delayed),
            delta=f"{len(blocked)} more blocked",
            status="risk",
        ),
        KpiMetric(
            label="Revenue at Risk",
            value=_money(revenue_at_risk),
            delta=f"{len(blocked)} blocked, {len(delayed)} delayed",
            status="risk",
        ),
        KpiMetric(
            label="Overdue Invoices",
            value=len(overdue),
            delta=f"{_money(overdue_total)} outstanding",
            status="risk",
        ),
        KpiMetric(
            label="Tickets Waiting",
            value=len(waiting),
            delta=f"{len(escalated)} escalated",
            status="watch",
        ),
        KpiMetric(
            label="New Leads",
            value=len(new_leads),
            delta=f"{len(follow_ups)} follow-ups due",
            status="good",
        ),
    ]


# -------------------------------- daily brief --------------------------------


def build_daily_brief(data: dict) -> AiDailyBrief:
    orders = data["orders"]
    jobs = data["dispatch_jobs"]
    invoices = data["invoices"]
    leads = data["leads"]

    delayed = [o for o in orders if o["status"] == "delayed"]
    blocked_orders = [o for o in orders if o["status"] == "blocked"]
    blocked_jobs = [j for j in jobs if j["status"] == "blocked"]
    overdue = [i for i in invoices if i["status"] == "overdue"]
    high_value_overdue = [i for i in overdue if i["amount"] > HIGH_VALUE_THRESHOLD]
    stale_leads = [lead for lead in leads if lead["status"] in {"follow_up_due", "stale"}]

    top_priorities = build_priority_queue(data, limit=3)

    headline_issues = []
    if blocked_orders:
        headline_issues.append("a priority order blocked by low stock")
    if delayed:
        headline_issues.append("a delayed dispatch dependency")
    if high_value_overdue:
        headline_issues.append("one high-value overdue invoice")

    summary = (
        "Operations have a manageable workload today, "
        f"but {len(headline_issues)} operational items need attention before noon: "
        f"{', '.join(headline_issues[:-1])}, and {headline_issues[-1]}."
        if len(headline_issues) > 1
        else "Operations look stable today — no items need attention before noon."
    )

    changes = []
    if delayed:
        changes.append(f"{len(delayed)} orders are now delayed or need review.")
    if blocked_jobs:
        changes.append(
            f"{len(blocked_jobs)} dispatch job{'s are' if len(blocked_jobs) != 1 else ' is'} blocked by inventory availability."
        )
    crossed = [lead for lead in leads if lead["status"] == "follow_up_due" and lead["last_touch_hours"] > 48]
    if crossed:
        changes.append(
            f"{len(crossed)} warm lead{'s' if len(crossed) != 1 else ''} crossed the 48-hour follow-up threshold."
        )

    risks = []
    for order in blocked_orders:
        if order["priority"] == "high":
            risks.append(
                f"{order['customer']} may miss the scheduled install window if the blocker "
                f"is not resolved today ({order.get('blocker', 'unspecified')})."
            )
    if high_value_overdue:
        risks.append(
            f"{len(high_value_overdue)} high-value invoice{'s' if len(high_value_overdue) != 1 else ''} "
            "requires finance follow-up before more work is scheduled."
        )
    if stale_leads:
        risks.append(f"{len(stale_leads)} leads are at risk of going cold without contact this week.")

    return AiDailyBrief(
        generatedAt=data["generated_at"],
        summary=summary,
        changes=changes,
        risks=risks,
        recommendedActions=[item.recommendedAction for item in top_priorities],
    )


# ------------------------------ threshold rules ------------------------------


def preview_rules(data: dict, rules: ThresholdRules) -> list[RuleMatch]:
    """How many seeded records each alert rule would flag right now."""
    overdue = [
        i for i in data["invoices"]
        if i["status"] == "overdue" and i["days_overdue"] >= rules.invoice_overdue_days
    ]
    untouched = [
        lead for lead in data["leads"]
        if lead["last_touch_hours"] >= rules.lead_untouched_hours
    ]
    aging_tickets = [
        t for t in data["tickets"]
        if t["status"] in {"waiting", "escalated"} and t["age_hours"] >= rules.ticket_age_hours
    ]
    low_stock = [
        item for item in data["inventory"]
        if item["stock"] <= item["reorder_point"] + rules.inventory_buffer_units
    ]

    return [
        RuleMatch(
            id="invoice_overdue",
            label=f"Invoices over {rules.invoice_overdue_days} days overdue",
            count=len(overdue),
            records=[i["id"] for i in overdue],
        ),
        RuleMatch(
            id="lead_untouched",
            label=f"Leads untouched for {rules.lead_untouched_hours}+ hours",
            count=len(untouched),
            records=[lead["id"] for lead in untouched],
        ),
        RuleMatch(
            id="ticket_age",
            label=f"Open tickets older than {rules.ticket_age_hours} hours",
            count=len(aging_tickets),
            records=[t["id"] for t in aging_tickets],
        ),
        RuleMatch(
            id="inventory_low",
            label=(
                f"Stock within {rules.inventory_buffer_units} units of reorder point"
                if rules.inventory_buffer_units
                else "Stock at or below reorder point"
            ),
            count=len(low_stock),
            records=[item["sku"] for item in low_stock],
        ),
    ]


# --------------------------------- assistant ---------------------------------


def _customer_risk_map(data: dict) -> dict[str, list[tuple[str, str]]]:
    """Customer → list of (record id, plain-English flag)."""
    flags: dict[str, list[tuple[str, str]]] = {}

    def add(customer: str, record: str, note: str) -> None:
        flags.setdefault(customer, []).append((record, note))

    for order in data["orders"]:
        if order["status"] in {"blocked", "delayed"}:
            add(order["customer"], order["id"], f"{order['status']} order {order['id']}")
    for invoice in data["invoices"]:
        if invoice["status"] == "overdue":
            add(invoice["customer"], invoice["id"], f"invoice {invoice['id']} {invoice['days_overdue']} days overdue")
    for ticket in data["tickets"]:
        if ticket["status"] == "escalated":
            add(ticket["customer"], ticket["id"], f"escalated ticket {ticket['id']}")

    return flags


def answer_question(data: dict, question: str) -> tuple[str, list[str]]:
    normalized = question.lower()
    priorities = build_priority_queue(data)
    top = priorities[0] if priorities else None

    if top and ("first" in normalized or "priority" in normalized):
        return (
            f"The top priority is {top.affectedRecord}: {top.whyItMatters} "
            f"Fastest next step — {top.recommendedAction.rstrip('.').lower()}.",
            [top.affectedRecord],
        )

    if "customer" in normalized and "risk" in normalized:
        risk_map = _customer_risk_map(data)
        risky = sorted(
            ((c, items) for c, items in risk_map.items() if len(items) >= 2),
            key=lambda pair: -len(pair[1]),
        )
        if risky:
            parts = [
                f"{customer} ({', '.join(note for _, note in items)})" for customer, items in risky
            ]
            records = [record for _, items in risky for record, _ in items]
            return (
                f"{len(risky)} customers carry compounding risk right now: {'; '.join(parts)}.",
                records,
            )

    if "invoice" in normalized or "finance" in normalized:
        overdue = [i for i in data["invoices"] if i["status"] == "overdue"]
        worst = max(overdue, key=lambda i: i["amount"], default=None)
        if worst:
            return (
                f"Invoice {worst['id']} for {worst['customer']} is the main finance risk — "
                f"{_money(worst['amount'])}, {worst['days_overdue']} days overdue. "
                f"{len(overdue)} invoices are overdue in total.",
                [i["id"] for i in overdue],
            )

    if "lead" in normalized:
        due = [lead for lead in data["leads"] if lead["status"] == "follow_up_due"]
        if due:
            best = max(due, key=lambda lead: lead["estimated_value"])
            return (
                f"Lead {best['id']} from {best['company']} should be contacted today — "
                f"estimated value {_money(best['estimated_value'])}, untouched for {best['last_touch_hours']} hours.",
                [lead["id"] for lead in due],
            )

    if "changed" in normalized or "yesterday" in normalized:
        brief = build_daily_brief(data)
        return (
            f"Since yesterday: {' '.join(brief.changes)}",
            [item.affectedRecord for item in priorities[:3]],
        )

    if "draft" in normalized or "owner" in normalized or "update" in normalized:
        brief = build_daily_brief(data)
        actions = " ".join(
            f"{index}) {action.rstrip('.')}." for index, action in enumerate(brief.recommendedActions, 1)
        )
        return (
            f"Owner update — {brief.summary} Top actions: {actions}",
            [item.affectedRecord for item in priorities[:3]],
        )

    records = [item.affectedRecord for item in priorities[:3]]
    return (
        "Today is mostly stable, but the dashboard is flagging "
        f"{len(priorities)} items: blocked priority work, overdue receivables, and warm leads waiting on follow-up.",
        records,
    )
