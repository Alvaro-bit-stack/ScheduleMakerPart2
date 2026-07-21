import random as rd
import json
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google.oauth2.credentials import Credentials


SCOPES = ["https://www.googleapis.com/auth/calendar"]

# Load client_id and client_secret from creds.json
with open("creds.json", "r") as f:
    creds_json = json.load(f)
    client_id = creds_json["installed"]["client_id"]
    client_secret = creds_json["installed"]["client_secret"]


def set_up_and_create_events(timezone, user_token, refresh_token, class_information, pallete):
    creds = Credentials(
        token=user_token,
        refresh_token=refresh_token,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=client_id,
        client_secret=client_secret,
        scopes=SCOPES,
    )
    try:
        # Build the Calendar API client
        service = build("calendar", "v3", credentials=creds)
        pallete_dict = json.loads(pallete)
        pallete_list = pallete_dict["colors"]
        pallete_name = pallete_dict["name"]
        calenderId_lst = []
        for i, color_hex in enumerate(pallete_list):
            temp_pallete_name = f"{pallete_name}{i}"
            calenderId_lst.append(create_calendar(service, temp_pallete_name, color_hex))
        create_events(timezone, user_token, refresh_token, class_information, calenderId_lst)
    except HttpError as error:
        print("An error occurred:", error)


def create_calendar(service, name, color_hex, text_hex="#000000"):
    # Step 1: Create the calendar
    calendar = {
        "summary": name,
        "timeZone": "America/New_York"  # adjust if needed
    }
    created_calendar = service.calendars().insert(body=calendar).execute()
    calendar_id = created_calendar["id"]

    print(f"✅ Calendar created: {created_calendar['summary']} (ID: {calendar_id})")

    # Step 2: Update the calendar with custom colors
    updated_calendar = service.calendarList().update(
        calendarId=calendar_id,
        body={
            "backgroundColor": color_hex,
            "foregroundColor": text_hex
        },
        colorRgbFormat=True
    ).execute()

    print(f"🎨 Color applied: BG={updated_calendar['backgroundColor']} | FG={updated_calendar['foregroundColor']}")
    return calendar_id


def create_events(timezone, user_token, refresh_token, class_information, colors):
    creds = Credentials(
        token=user_token,
        refresh_token=refresh_token,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=client_id,
        client_secret=client_secret,
        scopes=SCOPES,
    )

    try:
        # Build the Calendar API client
        service = build("calendar", "v3", credentials=creds)
        semester_end = "20251231T235959Z"

        for class_info in class_information:
            class_name = class_info["class"]
            location = class_info["location"][0]
            colorId = rd.randint(1, 11)
            startTime = class_info["start_time"]
            endTime = class_info["end_time"]

            if startTime == endTime:
                continue

            days = class_info["days"]
            reccurance = class_info["reccurance"]

            event = {
                "summary": class_name,
                "location": location,
                "colorId": str(colorId),
                "start": {
                    "dateTime": startTime,
                    "timeZone": timezone,
                },
                "end": {
                    "dateTime": endTime,
                    "timeZone": timezone,
                },
                "recurrence": [
                    f"RRULE:FREQ={reccurance};BYDAY={','.join(days)};UNTIL={semester_end}",
                ],
            }

            created_event = service.events().insert(
                calendarId="primary",  # Replace if not using primary
                body=event
            ).execute()

            print(f"Event created: {created_event.get('htmlLink')}")

    except HttpError as error:
        print("An error in creating events occurred:", error)


