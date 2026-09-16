# Schedulr — Schedule screenshot → Google Calendar

Schedulr turns a class-schedule screenshot into recurring, color-themed Google
Calendar events.

- **`schedule_frontend/`** — Next.js, React, and Tailwind. Handles the landing
  page, Google OAuth, the upload form, encrypted short-lived sessions, and the
  protected backend proxy.
- **`schedule_backend/`** — FastAPI. Validates images, runs Google Cloud Vision
  OCR, extracts classes with OpenAI, and creates Calendar events.

## Google Calendar access

Schedulr requests
`https://www.googleapis.com/auth/calendar.events.owned`, which is narrower than
full Calendar access and limits event management to calendars the user owns.
The current implementation:

- validates OAuth `state` and uses PKCE;
- keeps access tokens out of URLs, JavaScript, and `localStorage`;
- stores the access token in an encrypted, HttpOnly, short-lived cookie;
- does not request or retain a refresh token;
- provides disconnect and token-revocation controls.

## Local setup

### Backend

```powershell
Set-Location schedule_backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
```

Configure:

- `OPENAI_API_KEY`
- `INTERNAL_API_KEY`
- `GOOGLE_VISION_CREDS_FILE`

Keep the Google Cloud Vision service-account JSON outside version control.

Run:

```powershell
uvicorn main:app --reload --port 8000
```

### Frontend

```powershell
Set-Location schedule_frontend
npm install
Copy-Item .env.example .env.local
npm run dev
```

Configure:

- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- `APP_URL`
- `BACKEND_URL`
- `OAUTH_SESSION_SECRET`
- `INTERNAL_API_KEY`, matching the backend value

Add `http://localhost:3000/api/google/callback` as an authorized redirect URI
for local development.

## Request flow

1. The user reviews the Calendar and schedule-processing disclosure at
   `/connect`.
2. Google OAuth returns to the callback with validated `state` and PKCE.
3. The callback stores only an encrypted, HttpOnly access-token session cookie.
4. `/form` sends the schedule image to the same-origin `/api/schedule` route.
5. Next.js validates the request and forwards it to FastAPI with a server-only
   internal API key.
6. FastAPI validates the image, extracts classes, and creates events without
   logging tokens, schedules, locations, or event links.

## Google production verification checklist

Before submitting the OAuth app:

1. Deploy the frontend and backend using HTTPS.
2. Verify the production domain in Google Search Console.
3. Configure the exact production callback URI.
4. Add the deployed homepage, privacy policy, and terms URLs to the OAuth
   consent-screen configuration.
5. Ensure the app name, branding, support contact, and requested scope exactly
   match the deployed app.
6. Record an unedited demonstration showing the homepage, disclosure, complete
   OAuth consent screen, upload flow, and resulting Calendar events.
7. Explain why `calendar.events.owned` is necessary to create recurring events
   on the user's primary calendar.
