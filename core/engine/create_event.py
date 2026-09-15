from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


FIELD_MAP = {
    "Ders": "subject",
    "Konu": "topic",
    "Çalışma türü": "study_type",
    "Toplam soru": "total",
    "Doğru": "correct",
    "Yanlış": "wrong",
    "Boş": "blank",
    "Çalışma süresi": "duration",
    "Pomodoro sayısı": "pomodoros",
    "Zorluk": "difficulty",
}


def parse_issue_body(body: str) -> dict:
    pattern = re.compile(
        r"^###\s+(.+?)\s*\n+([\s\S]*?)(?=^###\s+|\Z)",
        re.MULTILINE,
    )

    values = {}

    for match in pattern.finditer(body):
        label = match.group(1).strip()
        value = match.group(2).strip()

        if value:
            values[label] = value

    result = {}

    for label, key in FIELD_MAP.items():
        result[key] = values.get(label, "")

    return result


def to_int(value: str, field_name: str) -> int:
    try:
        number = int(value.strip())
    except ValueError as exc:
        raise ValueError(
            f"{field_name} sayı olmalı: {value}"
        ) from exc

    if number < 0:
        raise ValueError(
            f"{field_name} negatif olamaz: {value}"
        )

    return number


def build_event(
    values: dict,
    event_id: str,
    timestamp: str,
) -> dict:

    total = to_int(values["total"], "Toplam soru")
    correct = to_int(values["correct"], "Doğru")
    wrong = to_int(values["wrong"], "Yanlış")
    blank = to_int(values["blank"], "Boş")

    duration = to_int(
        values["duration"],
        "Çalışma süresi",
    )

    pomodoros = to_int(
        values["pomodoros"],
        "Pomodoro sayısı",
    )

    if correct + wrong + blank != total:
        raise ValueError(
            "Doğru + yanlış + boş = toplam soru olmalı."
        )

    return {
        "event_id": event_id,
        "event_type": "question_session",
        "timestamp": timestamp,
        "subject": values["subject"].strip(),
        "topic": values["topic"].strip(),
        "study_type": values["study_type"].strip(),

        "questions": {
            "total": total,
            "correct": correct,
            "wrong": wrong,
            "blank": blank,
        },

        "duration_minutes": duration,

        "metadata": {
            "pomodoros": pomodoros,
            "difficulty": values["difficulty"].strip(),
        },
    }


def main() -> None:

    parser = argparse.ArgumentParser()

    parser.add_argument("--body", required=True)
    parser.add_argument("--event-id", required=True)
    parser.add_argument("--timestamp", required=True)

    args = parser.parse_args()

    body = Path(args.body).read_text(
        encoding="utf-8"
    )

    values = parse_issue_body(body)

    event = build_event(
        values,
        args.event_id,
        args.timestamp,
    )

    output_dir = Path("data/events")
    output_dir.mkdir(
        parents=True,
        exist_ok=True,
    )

    output_file = (
        output_dir
        / f"{args.event_id}.json"
    )

    output_file.write_text(
        json.dumps(
            event,
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )

    print(
        f"Event oluşturuldu: {output_file}"
    )


if __name__ == "__main__":
    main()
