from fastapi import FastAPI, File, UploadFile, Form
from schedule_extractor import extract_classes
from google_calendar import set_up_and_create_events
from ocr import run_ocr
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/upload")
async def upload_schedule(
    fileUpload: UploadFile = File(...),
    user_token: str = Form(...),
    timezone: str = Form(...),
    refresh_token: str = Form(...),
    palette: str = Form(None),
):
    content = await fileUpload.read()  # frontend image bytes
    ocr_response = run_ocr(content)
    class_info = extract_classes(content, ocr_response)
    set_up_and_create_events(timezone, user_token, refresh_token, class_info, palette)
    return {"status": "ok", "classes": class_info}

