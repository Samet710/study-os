def calculate_xp(
    questions: int,
    correct: int,
    duration_minutes: int
) -> int:

    if questions <= 0:
        return 0

    base_xp = questions * 10

    accuracy = correct / questions

    accuracy_bonus = 0

    if accuracy >= 0.90:
        accuracy_bonus = 50

    elif accuracy >= 0.80:
        accuracy_bonus = 25

    elif accuracy >= 0.70:
        accuracy_bonus = 10

    focus_bonus = 0

    if duration_minutes >= 45:
        focus_bonus = 25

    return base_xp + accuracy_bonus + focus_bonus
