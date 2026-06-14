"""Seeded operational data for the Prairie Signal demo.

Dates are stored as day-offsets from "now" so the dashboard always reads as
today's workload no matter when it runs. Record IDs are stable because the
frontend fallback snapshot mirrors them.
"""

from __future__ import annotations

from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

TIMEZONE = ZoneInfo("America/Edmonton")

BUSINESS = {
    "name": "Prairie Signal Supply Co.",
    "industry": "B2B supply and field-service coordination",
    "location": "Southern Alberta",
}

OPERATOR = {
    "name": "Maya Singh",
    "role": "Operations Coordinator",
}

# 14 orders: 2 blocked, 3 delayed, 4 high-priority customers, 1 large value
ORDERS = [
    {"id": "PS-1040", "customer": "Hillcrest Mechanical", "value": 1860, "status": "shipped", "priority": "low", "due_in_days": -1},
    {"id": "PS-1041", "customer": "Riverbend Facilities", "value": 4350, "status": "processing", "priority": "high", "due_in_days": 2},
    {"id": "PS-1042", "customer": "Stonegate Contracting", "value": 980, "status": "new", "priority": "low", "due_in_days": 4},
    {"id": "PS-1043", "customer": "Calgary West Property", "value": 2210, "status": "shipped", "priority": "medium", "due_in_days": 0},
    {"id": "PS-1044", "customer": "Lethbridge Service Group", "value": 3675, "status": "processing", "priority": "medium", "due_in_days": 3},
    {
        "id": "PS-1045",
        "customer": "Summit Ridge Contracting",
        "value": 12750,
        "status": "processing",
        "priority": "high",
        "due_in_days": 3,
    },
    {
        "id": "PS-1046",
        "customer": "Bow Valley Mechanical",
        "value": 5890,
        "status": "blocked",
        "priority": "medium",
        "due_in_days": 2,
        "blocker": "Customer site access pending",
        "action": "Confirm site access with the Bow Valley contact and reschedule delivery.",
    },
    {"id": "PS-1047", "customer": "Prairie Rose Builders", "value": 1540, "status": "new", "priority": "low", "due_in_days": 5},
    {
        "id": "PS-1048",
        "customer": "Apex Facility Services",
        "value": 8420,
        "status": "blocked",
        "priority": "high",
        "due_in_days": 1,
        "blocker": "SKU REL-220 below reorder point",
        "action": "Call the supplier for REL-220 status and offer a split shipment option today.",
        "linked_job": "J-220",
    },
    {
        "id": "PS-1049",
        "customer": "Canyon Ridge Mechanical",
        "value": 3120,
        "status": "delayed",
        "priority": "medium",
        "due_in_days": 0,
        "blocker": "Supplier shipment late",
    },
    {"id": "PS-1050", "customer": "Foothills Industrial Park", "value": 2890, "status": "processing", "priority": "low", "due_in_days": 6},
    {
        "id": "PS-1051",
        "customer": "North Gate Maintenance",
        "value": 6230,
        "status": "delayed",
        "priority": "high",
        "due_in_days": 0,
        "blocker": "Awaiting dispatch confirmation",
    },
    {
        "id": "PS-1052",
        "customer": "Westbrook Property Group",
        "value": 2480,
        "status": "delayed",
        "priority": "low",
        "due_in_days": 2,
        "blocker": "Carrier exception",
    },
    {"id": "PS-1053", "customer": "Glenmore Plumbing Co.", "value": 1320, "status": "new", "priority": "low", "due_in_days": 7},
]

# 9 tickets: 2 escalated, 3 waiting, 1 priority-customer issue
TICKETS = [
    {"id": "T-878", "customer": "Stonegate Contracting", "category": "Order status inquiry", "status": "resolved", "age_hours": 30, "priority": "low"},
    {"id": "T-879", "customer": "Lethbridge Service Group", "category": "Warranty claim", "status": "waiting", "age_hours": 26, "priority": "medium"},
    {"id": "T-880", "customer": "Prairie Rose Builders", "category": "Billing question", "status": "resolved", "age_hours": 44, "priority": "low"},
    {
        "id": "T-881",
        "customer": "Apex Facility Services",
        "category": "Delivery exception",
        "status": "escalated",
        "age_hours": 18,
        "priority": "high",
        "action": "Reply with the split-shipment plan once supplier timing is confirmed.",
    },
    {"id": "T-882", "customer": "Westbrook Property Group", "category": "Quote revision", "status": "waiting", "age_hours": 9, "priority": "medium"},
    {"id": "T-883", "customer": "Glenmore Plumbing Co.", "category": "Return request", "status": "new", "age_hours": 3, "priority": "low"},
    {
        "id": "T-884",
        "customer": "Calgary West Property",
        "category": "Recurring delivery delay",
        "status": "escalated",
        "age_hours": 41,
        "priority": "medium",
    },
    {"id": "T-885", "customer": "Riverbend Facilities", "category": "Product spec question", "status": "waiting", "age_hours": 14, "priority": "low"},
    {"id": "T-886", "customer": "Hillcrest Mechanical", "category": "Invoice copy request", "status": "new", "age_hours": 2, "priority": "low"},
]

# 8 dispatch jobs: 1 blocked, 2 at risk, 5 scheduled/completed
DISPATCH_JOBS = [
    {"id": "J-218", "customer": "Hillcrest Mechanical", "status": "completed", "technician": "Nadia Ellis", "scheduled_in_days": -1},
    {"id": "J-219", "customer": "Lethbridge Service Group", "status": "completed", "technician": "Cole Nguyen", "scheduled_in_days": -1},
    {
        "id": "J-220",
        "customer": "Apex Facility Services",
        "status": "blocked",
        "technician": "Cole Nguyen",
        "scheduled_in_days": 1,
        "risk_reason": "Required part REL-220 is below reorder point",
    },
    {
        "id": "J-221",
        "customer": "Canyon Ridge Mechanical",
        "status": "at_risk",
        "technician": "Nadia Ellis",
        "scheduled_in_days": 0,
        "risk_reason": "Order PS-1049 delayed by late supplier shipment",
    },
    {"id": "J-222", "customer": "Riverbend Facilities", "status": "scheduled", "technician": "Cole Nguyen", "scheduled_in_days": 2},
    {
        "id": "J-223",
        "customer": "Calgary West Property",
        "status": "at_risk",
        "technician": "Marcus Webb",
        "scheduled_in_days": 1,
        "risk_reason": "Technician double-booked for the morning window",
    },
    {"id": "J-224", "customer": "Summit Ridge Contracting", "status": "scheduled", "technician": "Nadia Ellis", "scheduled_in_days": 3},
    {"id": "J-225", "customer": "Foothills Industrial Park", "status": "scheduled", "technician": "Marcus Webb", "scheduled_in_days": 4},
]

# 10 invoices: 3 overdue, 1 high-value overdue
INVOICES = [
    {"id": "INV-3095", "customer": "Hillcrest Mechanical", "amount": 1860, "status": "paid", "days_overdue": 0},
    {
        "id": "INV-3096",
        "customer": "Stonegate Contracting",
        "amount": 1070,
        "status": "overdue",
        "days_overdue": 21,
    },
    {"id": "INV-3097", "customer": "Lethbridge Service Group", "amount": 3675, "status": "open", "days_overdue": 0},
    {
        "id": "INV-3098",
        "customer": "Calgary West Property",
        "amount": 1840,
        "status": "overdue",
        "days_overdue": 9,
    },
    {"id": "INV-3099", "customer": "Prairie Rose Builders", "amount": 920, "status": "paid", "days_overdue": 0},
    {"id": "INV-3100", "customer": "Riverbend Facilities", "amount": 4350, "status": "open", "days_overdue": 0},
    {
        "id": "INV-3101",
        "customer": "North Gate Maintenance",
        "amount": 6230,
        "status": "overdue",
        "days_overdue": 16,
        "action": "Send payment follow-up before confirming additional dispatch work.",
    },
    {"id": "INV-3102", "customer": "Westbrook Property Group", "amount": 1580, "status": "open", "days_overdue": 0},
    {"id": "INV-3103", "customer": "Glenmore Plumbing Co.", "amount": 1320, "status": "open", "days_overdue": 0},
    {"id": "INV-3104", "customer": "Summit Ridge Contracting", "amount": 5125, "status": "open", "days_overdue": 0},
]

# 7 leads: 2 follow-up due, 1 stale warm lead
LEADS = [
    {
        "id": "L-708",
        "company": "Chinook Commercial Services",
        "source": "Trade show",
        "status": "stale",
        "estimated_value": 7800,
        "last_touch_hours": 216,
    },
    {"id": "L-709", "company": "Silverado Property Care", "source": "Referral", "status": "contacted", "estimated_value": 2900, "last_touch_hours": 20},
    {
        "id": "L-710",
        "company": "Foothills Commercial HVAC",
        "source": "Website form",
        "status": "follow_up_due",
        "estimated_value": 9200,
        "last_touch_hours": 56,
        "action": "Send a same-day follow-up and offer a quick discovery call.",
    },
    {"id": "L-711", "company": "Bridgeway Builders", "source": "Referral", "status": "new", "estimated_value": 4100, "last_touch_hours": 4},
    {
        "id": "L-712",
        "company": "Cedar Park Property Group",
        "source": "Website form",
        "status": "follow_up_due",
        "estimated_value": 5400,
        "last_touch_hours": 50,
    },
    {"id": "L-713", "company": "Highline Electrical", "source": "Website form", "status": "new", "estimated_value": 3000, "last_touch_hours": 6},
    {"id": "L-714", "company": "Aspen Grove Clinics", "source": "Referral", "status": "contacted", "estimated_value": 6100, "last_touch_hours": 28},
]

# 8 inventory items: 3 below reorder point, 1 supplier backordered
INVENTORY = [
    {"sku": "REL-220", "name": "Relay control module", "stock": 2, "reorder_point": 8, "supplier_status": "late"},
    {"sku": "SNS-410", "name": "Signal sensor kit", "stock": 11, "reorder_point": 10, "supplier_status": "ok"},
    {"sku": "CTRL-115", "name": "Controller board", "stock": 4, "reorder_point": 6, "supplier_status": "ok"},
    {"sku": "VLV-085", "name": "Pressure valve assembly", "stock": 0, "reorder_point": 5, "supplier_status": "backordered"},
    {"sku": "CBL-340", "name": "Shielded cable spool", "stock": 26, "reorder_point": 12, "supplier_status": "ok"},
    {"sku": "MNT-090", "name": "Mounting bracket set", "stock": 48, "reorder_point": 20, "supplier_status": "ok"},
    {"sku": "FLT-200", "name": "Inline filter pack", "stock": 17, "reorder_point": 10, "supplier_status": "ok"},
    {"sku": "PWR-510", "name": "Power supply unit", "stock": 9, "reorder_point": 6, "supplier_status": "ok"},
]

SOURCES = [
    {"id": "crm", "name": "CRM export", "status": "synced", "lastSync": "7:30 AM", "recordsProcessed": 42},
    {"id": "orders", "name": "Orders CSV", "status": "synced", "lastSync": "7:32 AM", "recordsProcessed": 14},
    {"id": "invoices", "name": "Invoice export", "status": "warning", "lastSync": "7:35 AM", "recordsProcessed": 10},
    {"id": "leads", "name": "Website leads", "status": "synced", "lastSync": "7:37 AM", "recordsProcessed": 7},
    {"id": "tickets", "name": "Ticket list", "status": "synced", "lastSync": "7:38 AM", "recordsProcessed": 9},
]

AUTOMATIONS = [
    {
        "id": "daily-owner-brief",
        "name": "Daily owner brief",
        "schedule": "Weekdays · 7:30 AM",
        "lastRun": "7:30 AM",
        "status": "active",
        "result": "Generated report with 3 recommended actions.",
    },
    {
        "id": "dispatch-risk-scan",
        "name": "Dispatch risk scan",
        "schedule": "Every 2 hours",
        "lastRun": "8:00 AM",
        "status": "active",
        "result": "Flagged 1 blocked job and 2 at-risk appointments.",
    },
    {
        "id": "overdue-invoice-scan",
        "name": "Overdue invoice scan",
        "schedule": "Weekdays · 9:00 AM",
        "lastRun": "Yesterday 9:00 AM",
        "status": "active",
        "result": "3 invoices over threshold, 1 flagged high-value.",
    },
    {
        "id": "lead-follow-up-digest",
        "name": "Lead follow-up digest",
        "schedule": "Weekdays · 3:00 PM",
        "lastRun": "Yesterday 3:00 PM",
        "status": "active",
        "result": "2 leads queued for same-day follow-up.",
    },
]

ACTIVITY = [
    {"id": "a1", "time": "7:30 AM", "label": "CRM export synced — 42 records processed", "kind": "sync"},
    {"id": "a2", "time": "7:32 AM", "label": "Orders CSV synced — 14 records processed", "kind": "sync"},
    {"id": "a3", "time": "7:35 AM", "label": "Invoice export synced with 1 format warning", "kind": "sync"},
    {"id": "a4", "time": "7:38 AM", "label": "AI daily brief generated", "kind": "report"},
    {"id": "a5", "time": "7:41 AM", "label": "Alert triggered — REL-220 below reorder point", "kind": "alert"},
    {"id": "a6", "time": "7:56 AM", "label": "Maya Singh opened the daily brief", "kind": "user"},
]


def now() -> datetime:
    return datetime.now(TIMEZONE)


def time_label() -> str:
    current = now()
    hour = current.strftime("%I").lstrip("0")
    return f"{hour}:{current:%M} {current:%p}"


def date_label() -> str:
    current = now()
    return f"{current:%A}, {current:%B} {current.day} · {time_label()}"


def _materialize_dates(records: list[dict], offset_key: str, date_key: str) -> list[dict]:
    today = now().date()
    materialized = []
    for record in records:
        record = dict(record)
        record[date_key] = (today + timedelta(days=record.pop(offset_key))).isoformat()
        materialized.append(record)
    return materialized


def get_seed_data() -> dict:
    return {
        "business": BUSINESS,
        "operator": OPERATOR,
        "orders": _materialize_dates(ORDERS, "due_in_days", "due_date"),
        "tickets": [dict(t) for t in TICKETS],
        "dispatch_jobs": _materialize_dates(DISPATCH_JOBS, "scheduled_in_days", "scheduled_for"),
        "invoices": [dict(i) for i in INVOICES],
        "leads": [dict(lead) for lead in LEADS],
        "inventory": [dict(item) for item in INVENTORY],
        "sources": [dict(s) for s in SOURCES],
        "automations": [dict(a) for a in AUTOMATIONS],
        "activity": [dict(e) for e in ACTIVITY],
        "generated_at": "7:38 AM",
        "date_label": date_label(),
    }
