import time

from apscheduler.schedulers.background import BackgroundScheduler

from seed_data import get_seed_data
from summarizer import generate_report

scheduler = BackgroundScheduler(timezone="America/Edmonton")


def generate_daily_owner_brief() -> None:
    data = get_seed_data()
    report = generate_report(data, "daily_owner_brief", "owner_friendly")
    # Demo version prints the result. Production version should persist to DB and/or email it.
    print(f"Generated scheduled report: {report.id}")


scheduler.add_job(
    generate_daily_owner_brief,
    trigger="cron",
    day_of_week="mon-fri",
    hour=7,
    minute=30,
    id="daily_owner_brief",
    replace_existing=True,
)


if __name__ == "__main__":
    scheduler.start()
    print("Scheduler started. Press Ctrl+C to exit.")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        scheduler.shutdown()
