from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


FIELD_MAP = {
    "Ders": "subject",
    "Toplam soru": "total",
    "Konu": "topic",
    "Doğru": "correct",
    "Yanlış": "wrong",
    "Süre": "duration",
    "Pomodoro": "pomodoros",
    "Çalışma türü": "study_type",
    "Zorluk": "difficulty",
}


EMPTY_VALUES = {
    "",
    "_No response_",
    "None",
}


def normalize_label(label: str) -> str:
    """
    GitHub Issue Form başlıklarının başındaki
    emoji ve diğer sembolleri kaldırır.

    Örnek:

        "📚 Ders" -> "Ders"
        "🔢 Toplam soru" -> "Toplam soru"
        "⏱️ Süre" -> "Süre"
    """

    return re.sub(
        r"^[^\wÇĞİÖŞÜçğıöşü]+",
        "",
        label.strip(),
    ).strip()


def normalize_value(value: str) -> str:
    """
    GitHub Issue Form'un boş alanlar için
    kullandığı değerleri gerçek boş değere çevirir.
    """

    value = value.strip()

    if value in EMPTY_VALUES:
        return ""

    return value


def parse_issue_body(body: str) -> dict:
    """
    GitHub Issue Form tarafından oluşturulan
    Markdown gövdesini okur.

    Boş alanlar boş string olarak döner.
    """

    pattern = re.compile(
        r"^###\s+(.+?)\s*\n+([\s\S]*?)(?=^###\s+|\Z)",
        re.MULTILINE,
    )

    values = {}

    for match in pattern.finditer(body):

        raw_label = match.group(1).strip()

        label = normalize_label(
            raw_label
        )

        raw_value = match.group(2).strip()

        value = normalize_value(
            raw_value
        )

        values[label] = value

    result = {}

    for label, key in FIELD_MAP.items():

        result[key] = values.get(
            label,
            "",
        )

    return result


def optional_int(
    value: str,
    field_name: str,
) -> int | None:
    """
    İsteğe bağlı sayı alanını dönüştürür.

    Alan boşsa None döner.
    """

    value = normalize_value(
        value
    )

    if not value:
        return None

    try:

        number = int(value)

    except ValueError as exc:

        raise ValueError(
            f"{field_name} sayı olmalı: {value}"
        ) from exc

    if number < 0:

        raise ValueError(
            f"{field_name} negatif olamaz: {value}"
        )

    return number


def required_int(
    value: str,
    field_name: str,
) -> int:
    """
    Zorunlu sayı alanını dönüştürür.
    """

    value = normalize_value(
        value
    )

    if not value:

        raise ValueError(
            f"{field_name} boş bırakılamaz."
        )

    try:

        number = int(value)

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

    subject = normalize_value(
        values["subject"]
    )

    if not subject:

        raise ValueError(
            "Ders boş bırakılamaz."
        )

    total = required_int(
        values["total"],
        "Toplam soru",
    )

    correct = optional_int(
        values["correct"],
        "Doğru",
    )

    wrong = optional_int(
        values["wrong"],
        "Yanlış",
    )

    duration = optional_int(
        values["duration"],
        "Çalışma süresi",
    )

    pomodoros = optional_int(
        values["pomodoros"],
        "Pomodoro sayısı",
    )

    topic = normalize_value(
        values["topic"]
    )

    study_type = normalize_value(
        values["study_type"]
    )

    difficulty = normalize_value(
        values["difficulty"]
    )

    # Doğru sayısı toplam sorudan fazla olamaz.
    if (
        correct is not None
        and correct > total
    ):

        raise ValueError(
            "Doğru sayısı toplam soru "
            "sayısından fazla olamaz."
        )

    # Yanlış sayısı toplam sorudan fazla olamaz.
    if (
        wrong is not None
        and wrong > total
    ):

        raise ValueError(
            "Yanlış sayısı toplam soru "
            "sayısından fazla olamaz."
        )

    # Doğru ve yanlış ikisi de biliniyorsa
    # boş sayısını otomatik hesapla.
    if (
        correct is not None
        and wrong is not None
    ):

        answered = (
            correct
            + wrong
        )

        if answered > total:

            raise ValueError(
                "Doğru + yanlış toplam "
                "soru sayısından fazla olamaz."
            )

        blank = (
            total
            - answered
        )

    else:

        # Bilgilerden biri eksikse
        # boş sayısını güvenilir şekilde
        # hesaplayamayız.
        blank = None

    return {

        "event_id": event_id,

        "event_type": (
            "question_session"
        ),

        "timestamp": timestamp,

        "subject": subject,

        "topic": (
            topic
            if topic
            else None
        ),

        "study_type": (
            study_type
            if study_type
            else None
        ),

        "questions": {

            "total": total,

            "correct": correct,

            "wrong": wrong,

            "blank": blank,
        },

        "duration_minutes": duration,

        "metadata": {

            "pomodoros": pomodoros,

            "difficulty": (
                difficulty
                if difficulty
                else None
            ),
        },
    }


def main() -> None:

    parser = argparse.ArgumentParser()

    parser.add_argument(
        "--body",
        required=True,
    )

    parser.add_argument(
        "--event-id",
        required=True,
    )

    parser.add_argument(
        "--timestamp",
        required=True,
    )

    args = parser.parse_args()

    body = Path(
        args.body
    ).read_text(
        encoding="utf-8"
    )

    values = parse_issue_body(
        body
    )

    event = build_event(
        values,
        args.event_id,
        args.timestamp,
    )

    output_dir = Path(
        "data/events"
    )

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
        f"Event oluşturuldu: "
        f"{output_file}"
    )


if __name__ == "__main__":
    main()
