"""Create Google Calendar events for the extracted classes.

Colors: Google Calendar events only support 11 fixed event colors, so the
user's palette (arbitrary hex) is mapped to the *nearest* Google event color.
Each class is then assigned a color by cycling through the palette, so the
resulting schedule shows the chosen theme's spread of colors. Events are added to the user's ``primary`` calendar using the narrow
``calendar.events.owned`` OAuth scope.
"""

import json
from datetime import date, datetime, timedelta, timezone as datetime_timezone
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials

SCOPES = ["https://www.googleapis.com/auth/calendar.events.owned"]

# Google Calendar's 11 fixed event colors (colorId -> hex). Source: Calendar
# API ``colors.get`` "event" section. Used to map arbitrary palette hex values
# to the closest supported event color.
GOOGLE_EVENT_COLORS = {
    "1": "#7986cb",   # Lavender
    "2": "#33b679",   # Sage
    "3": "#8e24aa",   # Grape
    "4": "#e67c73",   # Flamingo
    "5": "#f6bf26",   # Banana
    "6": "#f4511e",   # Tangerine
    "7": "#039be5",   # Peacock
    "8": "#616161",   # Graphite
    "9": "#3f51b5",   # Blueberry
    "10": "#0b8043",  # Basil
    "11": "#d50000",  # Tomato
}

WEEKDAY_INDEXES = {
    "MO": 0,
    "TU": 1,
    "WE": 2,
    "TH": 3,
    "FR": 4,
    "SA": 5,
    "SU": 6,
}


def _hex_to_rgb(value: str):
    """Convert ``#rrggbb`` (or ``rrggbb``) to an ``(r, g, b)`` tuple."""
    value = value.strip().lstrip("#")
    if len(value) == 3:  # allow shorthand like #abc
        value = "".join(ch * 2 for ch in value)
    if len(value) != 6:
        raise ValueError(f"Invalid hex color: {value!r}")
    return tuple(int(value[i:i + 2], 16) for i in (0, 2, 4))


def nearest_color_id(hex_color: str) -> str:
    """Return the Google event ``colorId`` closest to ``hex_color``."""
    try:
        r, g, b = _hex_to_rgb(hex_color)
    except ValueError:
        return "1"  # sensible default (Lavender)
    best_id, best_dist = "1", float("inf")
    for color_id, google_hex in GOOGLE_EVENT_COLORS.items():
        gr, gg, gb = _hex_to_rgb(google_hex)
        dist = (r - gr) ** 2 + (g - gg) ** 2 + (b - gb) ** 2
        if dist < best_dist:
            best_id, best_dist = color_id, dist
    return best_id


def palette_to_color_ids(palette) -> list:
    """Turn a palette into an ordered list of Google event ``colorId``s.

    ``palette`` may be a JSON string or a dict shaped like
    ``{"name": str, "colors": [hex, ...]}``. Missing/invalid input falls back
    to all 11 Google colors so events are still nicely varied.
    """
    colors = []
    if isinstance(palette, str) and palette.strip():
        try:
            palette = json.loads(palette)
        except json.JSONDecodeError:
            palette = None
    if isinstance(palette, dict):
        colors = palette.get("colors") or []
    elif isinstance(palette, list):
        colors = palette

    color_ids = [nearest_color_id(c) for c in colors if isinstance(c, str)]
    if not color_ids:
        return list(GOOGLE_EVENT_COLORS.keys())
    return color_ids


def _current_week_start(timezone_name: str) -> date:
    """Return Monday of the user's current week in their local timezone."""
    try:
        calendar_timezone = ZoneInfo(timezone_name)
    except ZoneInfoNotFoundError as error:
        raise ValueError(f"Unknown calendar timezone: {timezone_name!r}") from error

    local_date = datetime.now(calendar_timezone).date()
    return local_date - timedelta(days=local_date.weekday())


def _prepare_recurring_times(
    start_time: str,
    end_time: str,
    days,
    week_start: date,
):
    """Start the recurrence on its first meeting day in the user's week."""
    normalized_days = list(dict.fromkeys(day.strip().upper() for day in days))
    invalid_days = [day for day in normalized_days if day not in WEEKDAY_INDEXES]
    if not normalized_days or invalid_days:
        raise ValueError(f"Invalid recurrence days: {days!r}")

    try:
        start = datetime.fromisoformat(start_time)
        end = datetime.fromisoformat(end_time)
    except ValueError as error:
        raise ValueError(
            "Event times must be ISO 8601 date-times, such as "
            "'2026-09-01T09:30:00'."
        ) from error

    if end <= start:
        raise ValueError(
            f"Event end time must be after its start time: {start_time!r} - {end_time!r}"
        )

    first_meeting_weekday = min(WEEKDAY_INDEXES[day] for day in normalized_days)
    first_meeting_date = week_start + timedelta(days=first_meeting_weekday)
    date_adjustment = first_meeting_date - start.date()
    return start + date_adjustment, end + date_adjustment, normalized_days


def _recurrence_end(start: datetime, timezone_name: str) -> str:
    """Return the end of the event's start year as an RFC 5545 UTC value."""
    try:
        calendar_timezone = ZoneInfo(timezone_name)
    except ZoneInfoNotFoundError as error:
        raise ValueError(f"Unknown calendar timezone: {timezone_name!r}") from error

    if start.tzinfo is None:
        local_start = start.replace(tzinfo=calendar_timezone)
    else:
        local_start = start.astimezone(calendar_timezone)

    local_end = datetime(
        local_start.year,
        12,
        31,
        23,
        59,
        59,
        tzinfo=calendar_timezone,
    )
    return local_end.astimezone(datetime_timezone.utc).strftime("%Y%m%dT%H%M%SZ")


def set_up_and_create_events(timezone, user_token, class_information, palette=None):
    """Map the palette to Google colors and create the class events."""
    color_ids = palette_to_color_ids(palette)
    return create_events(timezone, user_token, class_information, color_ids)


def create_events(timezone, user_token, class_information, color_ids):
    """Insert each class as a recurring event in the user's primary calendar.

    ``color_ids`` is a list of Google event colorIds; classes cycle through it
    so the schedule reflects the selected theme.
    """
    creds = Credentials(
        token=user_token,
        scopes=SCOPES,
    )

    if not color_ids:
        color_ids = list(GOOGLE_EVENT_COLORS.keys())

    service = build("calendar", "v3", credentials=creds)
    current_week_start = _current_week_start(timezone)
    created_count = 0

    color_index = 0
    for class_info in class_information:
        start_time = class_info["start_time"]
        end_time = class_info["end_time"]
        if start_time == end_time:
            continue

        class_name = class_info["class"]
        location = class_info["location"][0] if class_info.get("location") else ""
        recurrence = class_info["reccurance"]
        start, end, days = _prepare_recurring_times(
            start_time,
            end_time,
            class_info["days"],
            current_week_start,
        )
        recurrence_until = _recurrence_end(start, timezone)

        color_id = color_ids[color_index % len(color_ids)]
        color_index += 1

        event = {
            "summary": class_name,
            "location": location,
            "colorId": str(color_id),
            "start": {"dateTime": start.isoformat(), "timeZone": timezone},
            "end": {"dateTime": end.isoformat(), "timeZone": timezone},
            "recurrence": [
                f"RRULE:FREQ={recurrence};BYDAY={','.join(days)};UNTIL={recurrence_until}",
            ],
        }

        service.events().insert(calendarId="primary", body=event).execute()
        created_count += 1

    return created_count
