"""Create Google Calendar events for the extracted classes.

Colors: Google Calendar events only support 11 fixed event colors, so the
user's palette (arbitrary hex) is mapped to the *nearest* Google event color.
Each class is then assigned a color by cycling through the palette, so the
resulting schedule shows the chosen theme's spread of colors. Events are added
to the user's ``primary`` calendar, which only needs the ``calendar.events``
OAuth scope (the same scope the frontend requests).
"""

import json
import os

from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google.oauth2.credentials import Credentials

SCOPES = ["https://www.googleapis.com/auth/calendar.events"]

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


def _load_client_creds():
    """Load OAuth client id/secret (needed to refresh the access token)."""
    path = os.environ.get("GOOGLE_CREDS_FILE", "creds.json")
    with open(path, "r") as f:
        creds_json = json.load(f)
    installed = creds_json.get("installed") or creds_json.get("web") or {}
    return installed["client_id"], installed["client_secret"]


def set_up_and_create_events(timezone, user_token, refresh_token, class_information, palette=None):
    """Map the palette to Google colors and create the class events."""
    color_ids = palette_to_color_ids(palette)
    create_events(timezone, user_token, refresh_token, class_information, color_ids)


def create_events(timezone, user_token, refresh_token, class_information, color_ids):
    """Insert each class as a recurring event in the user's primary calendar.

    ``color_ids`` is a list of Google event colorIds; classes cycle through it
    so the schedule reflects the selected theme.
    """
    client_id, client_secret = _load_client_creds()
    creds = Credentials(
        token=user_token,
        refresh_token=refresh_token,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=client_id,
        client_secret=client_secret,
        scopes=SCOPES,
    )

    if not color_ids:
        color_ids = list(GOOGLE_EVENT_COLORS.keys())

    created_links = []
    try:
        service = build("calendar", "v3", credentials=creds)
        semester_end = "20251231T235959Z"

        color_index = 0
        for class_info in class_information:
            start_time = class_info["start_time"]
            end_time = class_info["end_time"]
            if start_time == end_time:
                continue

            class_name = class_info["class"]
            location = class_info["location"][0] if class_info.get("location") else ""
            days = class_info["days"]
            recurrence = class_info["reccurance"]

            # Cycle through the palette so consecutive classes get different,
            # on-theme colors.
            color_id = color_ids[color_index % len(color_ids)]
            color_index += 1

            event = {
                "summary": class_name,
                "location": location,
                "colorId": str(color_id),
                "start": {"dateTime": start_time, "timeZone": timezone},
                "end": {"dateTime": end_time, "timeZone": timezone},
                "recurrence": [
                    f"RRULE:FREQ={recurrence};BYDAY={','.join(days)};UNTIL={semester_end}",
                ],
            }

            created_event = service.events().insert(calendarId="primary", body=event).execute()
            created_links.append(created_event.get("htmlLink"))
            print(f"Event created: {created_event.get('htmlLink')}")
    except HttpError as error:
        print("An error in creating events occurred:", error)

    return created_links
