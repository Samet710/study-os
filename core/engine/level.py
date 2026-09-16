from __future__ import annotations


def calculate_level(total_xp: int) -> int:

    level = 1
    xp_remaining = max(
        0,
        total_xp,
    )

    while True:

        required = level * 100

        if xp_remaining < required:
            break

        xp_remaining -= required
        level += 1

    return level


def get_level_progress(
    total_xp: int,
) -> dict:

    total_xp = max(
        0,
        total_xp,
    )

    level = calculate_level(
        total_xp
    )

    xp_remaining = total_xp

    for current_level in range(
        1,
        level,
    ):

        xp_remaining -= (
            current_level * 100
        )

    current_level_xp = xp_remaining

    next_level_xp = level * 100

    percentage = round(
        (
            current_level_xp
            / next_level_xp
        ) * 100
    )

    return {
        "level": level,
        "current_xp": current_level_xp,
        "next_level_xp": next_level_xp,
        "remaining_xp": (
            next_level_xp
            - current_level_xp
        ),
        "percentage": percentage,
    }
