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
3. Set credentials files in `schedule_backend/`:
   - `creds.json` for Google OAuth client
   - `api_json.json` for Google Vision service account
4. Set environment variables (OpenAI):
   - `OPENAI_API_KEY` in your shell or a `.env` at repo root

### Run
```bash
uvicorn main:app --reload --port 8001 --host 0.0.0.0
```

### Notes
- The repository ignores any local `venv/`, `Lib/`, and `Scripts/` folders so they are not committed.
- Keep secrets out of version control. See `.gitignore` at repo root.
