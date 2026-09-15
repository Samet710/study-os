from xp import calculate_xp


result = calculate_xp(
    questions=30,
    correct=24,
    duration_minutes=50
)


print("Hesaplanan XP:", result)
