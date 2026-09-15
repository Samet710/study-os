from __future__ import annotations

import json
from collections import defaultdict
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

from xp import calculate_xp


ROOT = Path(__file__).resolve().parents[2]

EVENTS_DIR = ROOT / "data" / "events"

OUTPUT_FILE = (
    ROOT
    / "app"
    / "data"
    / "stats.json"
)

TIMEZONE = ZoneInfo(
    "Europe/Istanbul"
)


def load_events() -> list[dict]:

    events = []

    if not EVENTS_DIR.exists():
        return events

    for path in sorted(
        EVENTS_DIR.glob("*.json")
    ):

        if path.name == "example.json":
            continue

        try:
            data = json.loads(
                path.read_text(
                    encoding="utf-8"
                )
            )

            events.append(data)

        except Exception as error:
            print(
                f"Event okunamadı: {path}"
            )
            print(error)

    return events


def parse_timestamp(value: str) -> datetime:
    timestamp = datetime.fromisoformat(value)

    if timestamp.tzinfo is None:
        timestamp = timestamp.replace(
            tzinfo=TIMEZONE
        )

    return timestamp.astimezone(TIMEZONE)


def calculate_streak(events: list[dict]) -> int:

    if not events:
        return 0

    activity_dates = set()

    for event in events:

        timestamp = parse_timestamp(
            event["timestamp"]
        )

        activity_dates.add(
            timestamp.date()
        )

    today = datetime.now(
        TIMEZONE
    ).date()

    if today not in activity_dates:
        return 0

    streak = 0
    current = today

    while current in activity_dates:

        streak += 1

        from datetime import timedelta

        current -= timedelta(days=1)

    return streak


def build_statistics(events: list[dict]) -> dict:

    total_questions = 0
    total_correct = 0
    total_wrong = 0
    total_blank = 0
    total_minutes = 0
    total_xp = 0

    subject_data = defaultdict(
        lambda: {
            "questions": 0,
            "correct": 0,
            "wrong": 0,
            "minutes": 0,
            "xp": 0,
        }
    )

    daily_data = defaultdict(
        lambda: {
            "questions": 0,
            "correct": 0,
            "minutes": 0,
            "xp": 0,
        }
    )

    processed_events = []

    for event in events:

        timestamp = parse_timestamp(
            event["timestamp"]
        )

        questions = event["questions"]

        total = questions["total"]
        correct = questions["correct"]
        wrong = questions["wrong"]
        blank = questions["blank"]

        minutes = event.get(
            "duration_minutes",
            0,
        )

        xp = calculate_xp(
            questions=total,
            correct=correct,
            duration_minutes=minutes,
        )

        total_questions += total
        total_correct += correct
        total_wrong += wrong
        total_blank += blank
        total_minutes += minutes
        total_xp += xp

        subject = event.get(
            "subject",
            "Bilinmeyen",
        )

        subject_data[subject]["questions"] += total
        subject_data[subject]["correct"] += correct
        subject_data[subject]["wrong"] += wrong
        subject_data[subject]["minutes"] += minutes
        subject_data[subject]["xp"] += xp

        day = timestamp.date().isoformat()

        daily_data[day]["questions"] += total
        daily_data[day]["correct"] += correct
        daily_data[day]["minutes"] += minutes
        daily_data[day]["xp"] += xp

        processed_events.append(
            {
                "event_id": event["event_id"],
                "timestamp": event["timestamp"],
                "subject": subject,
                "topic": event.get(
                    "topic",
                    "",
                ),
                "questions": total,
                "correct": correct,
                "minutes": minutes,
                "xp": xp,
            }
        )

    accuracy = 0

    if total_questions > 0:
        accuracy = round(
            total_correct
            / total_questions
            * 100,
            1,
        )

    subjects = {}

    for name, data in subject_data.items():

        subject_accuracy = 0

        if data["questions"] > 0:
            subject_accuracy = round(
                data["correct"]
                / data["questions"]
                * 100,
                1,
            )

        subjects[name] = {
            **data,
            "accuracy": subject_accuracy,
        }

    today = datetime.now(
        TIMEZONE
    ).date().isoformat()

    today_data = daily_data.get(
        today,
        {
            "questions": 0,
            "correct": 0,
            "minutes": 0,
            "xp": 0,
        },
    )

    processed_events.sort(
        key=lambda event: event["timestamp"],
        reverse=True,
    )

    return {
        "generated_at": datetime.now(
            TIMEZONE
        ).isoformat(),

        "today": today,

        "daily_goal": 50,

        "totals": {
            "questions": total_questions,
            "correct": total_correct,
            "wrong": total_wrong,
            "blank": total_blank,
            "minutes": total_minutes,
            "xp": total_xp,
            "accuracy": accuracy,
            "level": 1,
        },

        "today_stats": today_data,

        "streak": calculate_streak(events),

        "subjects": subjects,

        "daily": dict(daily_data),

        "recent_events":
            processed_events[:10],
    }


def main():

    events = load_events()

    statistics = build_statistics(
        events
    )

    OUTPUT_FILE.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    OUTPUT_FILE.write_text(
        json.dumps(
            statistics,
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )

    print(
        f"{len(events)} event işlendi."
    )

    print(
        f"Toplam XP: "
        f"{statistics['totals']['xp']}"
    )


if __name__ == "__main__":
    main()
