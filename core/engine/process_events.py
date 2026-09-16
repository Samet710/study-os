from __future__ import annotations

import json
from collections import defaultdict
from datetime import datetime, timedelta
from pathlib import Path
from zoneinfo import ZoneInfo

from level import calculate_level
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


def parse_timestamp(
    value: str,
) -> datetime:

    timestamp = datetime.fromisoformat(
        value
    )

    if timestamp.tzinfo is None:

        timestamp = timestamp.replace(
            tzinfo=TIMEZONE
        )

    return timestamp.astimezone(
        TIMEZONE
    )


def calculate_streak(
    events: list[dict],
) -> int:

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

        current -= timedelta(
            days=1
        )

    return streak


def add_optional_value(
    target: dict,
    key: str,
    value: int | None,
) -> None:

    """
    Bilinen sayısal değerleri toplar.

    None değerleri toplamaya dahil etmez.
    """

    if value is not None:

        target[key] += value

        target[f"{key}_known"] += 1


def calculate_accuracy(
    correct: int | None,
    wrong: int | None,
) -> float | None:

    """
    Doğru ve yanlış bilgileri biliniyorsa
    doğruluk oranını hesaplar.

    İkisinden biri bilinmiyorsa None döner.
    """

    if correct is None or wrong is None:
        return None

    answered = correct + wrong

    if answered <= 0:
        return None

    return round(
        correct / answered * 100,
        1,
    )


def build_statistics(
    events: list[dict],
) -> dict:

    total_questions = 0

    total_correct = 0
    total_wrong = 0
    total_blank = 0

    total_minutes = 0

    total_xp = 0

    correct_known = 0
    wrong_known = 0
    blank_known = 0
    minutes_known = 0

    subject_data = defaultdict(
        lambda: {
            "questions": 0,
            "correct": 0,
            "wrong": 0,
            "blank": 0,
            "minutes": 0,
            "xp": 0,
            "correct_known": 0,
            "wrong_known": 0,
            "blank_known": 0,
            "minutes_known": 0,
        }
    )

    daily_data = defaultdict(
        lambda: {
            "questions": 0,
            "correct": 0,
            "minutes": 0,
            "xp": 0,
            "correct_known": 0,
            "minutes_known": 0,
        }
    )

    processed_events = []

    for event in events:

        timestamp = parse_timestamp(
            event["timestamp"]
        )

        questions = event.get(
            "questions",
            {},
        )

        total = questions.get(
            "total",
            0,
        )

        correct = questions.get(
            "correct"
        )

        wrong = questions.get(
            "wrong"
        )

        blank = questions.get(
            "blank"
        )

        minutes = event.get(
            "duration_minutes"
        )

        xp = calculate_xp(
            questions=total,
            correct=correct,
            duration_minutes=minutes,
        )

        total_questions += total

        if correct is not None:

            total_correct += correct

            correct_known += 1

        if wrong is not None:

            total_wrong += wrong

            wrong_known += 1

        if blank is not None:

            total_blank += blank

            blank_known += 1

        if minutes is not None:

            total_minutes += minutes

            minutes_known += 1

        total_xp += xp

        subject = event.get(
            "subject",
            "Bilinmeyen",
        )

        subject_stats = subject_data[
            subject
        ]

        subject_stats["questions"] += total

        add_optional_value(
            subject_stats,
            "correct",
            correct,
        )

        add_optional_value(
            subject_stats,
            "wrong",
            wrong,
        )

        add_optional_value(
            subject_stats,
            "blank",
            blank,
        )

        add_optional_value(
            subject_stats,
            "minutes",
            minutes,
        )

        subject_stats["xp"] += xp

        day = timestamp.date().isoformat()

        daily_stats = daily_data[day]

        daily_stats["questions"] += total

        if correct is not None:

            daily_stats["correct"] += correct

            daily_stats[
                "correct_known"
            ] += 1

        if minutes is not None:

            daily_stats["minutes"] += minutes

            daily_stats[
                "minutes_known"
            ] += 1

        daily_stats["xp"] += xp

        processed_events.append(
            {
                "event_id": event[
                    "event_id"
                ],

                "timestamp": event[
                    "timestamp"
                ],

                "subject": subject,

                "topic": event.get(
                    "topic"
                ),

                "study_type": event.get(
                    "study_type"
                ),

                "questions": total,

                "correct": correct,

                "wrong": wrong,

                "blank": blank,

                "minutes": minutes,

                "xp": xp,
            }
        )

    # Genel doğruluk.
    #
    # Sadece hem doğru hem yanlış bilgisi
    # bulunan kayıtlar üzerinden hesaplanır.

    known_correct = 0
    known_wrong = 0

    for event in events:

        questions = event.get(
            "questions",
            {},
        )

        correct = questions.get(
            "correct"
        )

        wrong = questions.get(
            "wrong"
        )

        if (
            correct is not None
            and wrong is not None
        ):

            known_correct += correct

            known_wrong += wrong

    accuracy = calculate_accuracy(
        known_correct,
        known_wrong,
    )

    subjects = {}

    for name, data in subject_data.items():

        subject_accuracy = calculate_accuracy(
            data["correct"]
            if data["correct_known"] > 0
            else None,

            data["wrong"]
            if data["wrong_known"] > 0
            else None,
        )

        subjects[name] = {

            "questions": data[
                "questions"
            ],

            "correct": (
                data["correct"]
                if data["correct_known"] > 0
                else None
            ),

            "wrong": (
                data["wrong"]
                if data["wrong_known"] > 0
                else None
            ),

            "blank": (
                data["blank"]
                if data["blank_known"] > 0
                else None
            ),

            "minutes": (
                data["minutes"]
                if data["minutes_known"] > 0
                else None
            ),

            "xp": data["xp"],

            "accuracy": subject_accuracy,
        }

    today = datetime.now(
        TIMEZONE
    ).date().isoformat()

    today_data = daily_data.get(
        today,
        {
            "questions": 0,
            "correct": None,
            "minutes": None,
            "xp": 0,
        },
    )

    today_stats = {

        "questions": today_data[
            "questions"
        ],

        "correct": (
            today_data["correct"]
            if today_data["correct_known"] > 0
            else None
        ),

        "minutes": (
            today_data["minutes"]
            if today_data["minutes_known"] > 0
            else None
        ),

        "xp": today_data["xp"],
    }

    processed_events.sort(
        key=lambda event: event[
            "timestamp"
        ],
        reverse=True
    )

    return {

        "generated_at": datetime.now(
            TIMEZONE
        ).isoformat(),

        "today": today,

        "daily_goal": 50,

        "totals": {

            "questions": total_questions,

            "correct": (
                total_correct
                if correct_known > 0
                else None
            ),

            "wrong": (
                total_wrong
                if wrong_known > 0
                else None
            ),

            "blank": (
                total_blank
                if blank_known > 0
                else None
            ),

            "minutes": (
                total_minutes
                if minutes_known > 0
                else None
            ),

            "xp": total_xp,

            "accuracy": accuracy,

            "level": calculate_level(
                total_xp
            ),
        },

        "today_stats": today_stats,

        "streak": calculate_streak(
            events
        ),

        "subjects": subjects,

        "daily": dict(
            daily_data
        ),

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
