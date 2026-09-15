def calculate_level(total_xp: int) -> int:

    level = 1

    xp_remaining = total_xp

    while True:

        required = level * 100

        if xp_remaining < required:
            break

        xp_remaining -= required

        level += 1

    return level
