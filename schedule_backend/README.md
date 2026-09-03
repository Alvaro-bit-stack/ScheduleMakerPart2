## Schedule Backend

FastAPI backend that OCRs a schedule image, parses classes, and creates Google Calendar events.

### New module names
- `google_calendar.py`: Calendar creation and event insertion
- `schedule_extractor.py`: Extracts class entries using OpenAI Vision + OCR cross-check
- `ocr.py`: Google Cloud Vision OCR helper
- `main.py`: FastAPI app entry

### Setup (without committing a virtual environment)
1. Create a virtual environment outside the repo (recommended):
   - Windows PowerShell:
     ```bash
     py -m venv ..\venv-schedule
     ..\venv-schedule\Scripts\Activate.ps1
     ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set the Google Vision service-account file:
   - `api_json.json`, or configure `GOOGLE_VISION_CREDS_FILE`
4. Copy `.env.example` to `.env` and configure:
   - `OPENAI_API_KEY`
   - `INTERNAL_API_KEY`, matching the frontend server

### Run
```bash
uvicorn main:app --reload --port 8001 --host 0.0.0.0
```

### Notes
- The repository ignores any local `venv/`, `Lib/`, and `Scripts/` folders so they are not committed.
- Keep secrets out of version control. See `.gitignore` at repo root.
- The backend upload endpoint only accepts authenticated server-to-server
  requests from the Next.js proxy.
