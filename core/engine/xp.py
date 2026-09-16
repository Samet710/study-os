from __future__ import annotations


def calculate_xp(
    questions: int,
    correct: int | None,
    duration_minutes: int | None,
) -> int:

    if questions <= 0:
        return 0

    # Her soru için temel XP.
    base_xp = questions * 10

    accuracy_bonus = 0

    # Doğru sayısı bilinmiyorsa doğruluk bonusu hesaplanmaz.
    if correct is not None:

        accuracy = correct / questions

        if accuracy >= 0.90:
            accuracy_bonus = 50

        elif accuracy >= 0.80:
            accuracy_bonus = 25

        elif accuracy >= 0.70:
            accuracy_bonus = 10

    focus_bonus = 0

    # Süre bilinmiyorsa süre bonusu hesaplanmaz.
    if (
        duration_minutes is not None
        and duration_minutes >= 45
    ):
        focus_bonus = 25

    return (
        base_xp
        + accuracy_bonus
        + focus_bonus
    )
