# CalSnap — Schedule screenshot → Google Calendar

Upload a screenshot of your class schedule and CalSnap reads it (OCR + GPT-4o),
then creates recurring, **color-themed** events in your Google Calendar.

- **`schedule_frontend/`** — Next.js 15 + React 19 + Tailwind v4. Handles Google
  OAuth, the upload form, and the color-theme picker.
- **`schedule_backend/`** — FastAPI. Runs OCR (Google Cloud Vision), extracts
  classes with OpenAI, and creates the calendar events.

## How the color themes work

Google Calendar events only support **11 fixed colors**. Each theme's palette
(arbitrary hex) is mapped to the nearest Google event color, and your classes
**cycle through the palette** so the schedule shows the theme's spread of colors.
Events are added to your **primary** calendar (only needs the `calendar.events`
OAuth scope). See `schedule_backend/google_calendar.py`.

## Setup

### Backend (`schedule_backend/`)

```bash
cd schedule_backend
python -m venv .venv && .venv\Scripts\activate      # Windows
pip install -r requirements.txt
```

Provide these files/vars (all git-ignored):
- `creds.json` — Google OAuth client (Desktop or Web) with `client_id` + `client_secret`, used to refresh the user's token.
- `api_json.json` — Google Cloud Vision service-account key (for OCR).
- `.env` — copy from `.env.example`, set `OPENAI_API_KEY`.

Run:
```bash
uvicorn main:app --reload --port 8000
```

### Frontend (`schedule_frontend/`)

```bash
cd schedule_frontend
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

In Google Cloud Console, add `http://localhost:3000/api/google/callback` as an
authorized redirect URI for your OAuth client.

## Flow

1. Landing page → **Connect with Google** (OAuth, `calendar.events` scope).
2. `/form` → pick timezone, upload the schedule image, pick a color theme.
3. Submit → the image + tokens + chosen palette POST to the backend
   (`/api/upload`), which OCRs, extracts classes, and creates the events.
