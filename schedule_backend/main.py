import os
import secrets
import warnings
from io import BytesIO
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, Header, HTTPException, Request, UploadFile
from fastapi.responses import JSONResponse
from google.api_core.exceptions import GoogleAPICallError
from googleapiclient.errors import HttpError
from openai import APIError
from PIL import Image, UnidentifiedImageError

from google_calendar import set_up_and_create_events
from ocr import OCRProcessingError, run_ocr
from schedule_extractor import extract_classes

load_dotenv()

app = FastAPI()

MAX_UPLOAD_BYTES = int(os.environ.get("MAX_UPLOAD_BYTES", str(10 * 1024 * 1024)))
MAX_REQUEST_BYTES = MAX_UPLOAD_BYTES + 1024 * 1024
MAX_IMAGE_PIXELS = int(os.environ.get("MAX_IMAGE_PIXELS", "40000000"))
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}
INTERNAL_API_KEY = os.environ.get("INTERNAL_API_KEY", "")
Image.MAX_IMAGE_PIXELS = MAX_IMAGE_PIXELS


def _validate_timezone(timezone_name: str) -> None:
    if len(timezone_name) > 100:
        raise HTTPException(status_code=422, detail="Invalid timezone.")
    try:
        ZoneInfo(timezone_name)
    except ZoneInfoNotFoundError as error:
        raise HTTPException(status_code=422, detail="Invalid timezone.") from error


def _validate_image(content: bytes) -> None:
    try:
        with warnings.catch_warnings():
            warnings.simplefilter("error", Image.DecompressionBombWarning)
            with Image.open(BytesIO(content)) as image:
                image.verify()
    except (
        UnidentifiedImageError,
        Image.DecompressionBombError,
        Image.DecompressionBombWarning,
        OSError,
    ) as error:
        raise HTTPException(
            status_code=422,
            detail="The uploaded file is not a valid supported image.",
        ) from error


def _bearer_token(authorization: str | None) -> str:
    scheme, separator, token = (authorization or "").partition(" ")
    if (
        separator != " "
        or scheme.lower() != "bearer"
        or not token
        or len(token) > 4096
    ):
        raise HTTPException(status_code=401, detail="Invalid Google authorization.")
    return token


@app.middleware("http")
async def protect_upload_endpoint(request: Request, call_next):
    if request.url.path == "/api/upload":
        if not INTERNAL_API_KEY:
            return JSONResponse(
                status_code=503,
                content={"detail": "Service configuration error."},
            )

        provided_key = request.headers.get("X-Internal-API-Key")
        if not provided_key or not secrets.compare_digest(
            provided_key,
            INTERNAL_API_KEY,
        ):
            return JSONResponse(
                status_code=401,
                content={"detail": "Unauthorized."},
            )

        content_length = request.headers.get("content-length")
        if content_length:
            try:
                if int(content_length) > MAX_REQUEST_BYTES:
                    return JSONResponse(
                        status_code=413,
                        content={
                            "detail": "The schedule image must be 10 MB or smaller."
                        },
                    )
            except ValueError:
                return JSONResponse(
                    status_code=400,
                    content={"detail": "Invalid content length."},
                )

    return await call_next(request)


@app.post("/api/upload")
async def upload_schedule(
    fileUpload: UploadFile = File(...),
    timezone: str = Form(...),
    palette: str | None = Form(None),
    authorization: str | None = Header(default=None),
):
    _validate_timezone(timezone)
    user_token = _bearer_token(authorization)

    if fileUpload.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=422,
            detail="Only PNG, JPG, and WebP images are supported.",
        )
    if palette is not None and len(palette) > 4096:
        raise HTTPException(status_code=422, detail="Invalid color palette.")
    content = await fileUpload.read(MAX_UPLOAD_BYTES + 1)
    if not content:
        raise HTTPException(status_code=422, detail="The uploaded image is empty.")
    if len(content) > MAX_UPLOAD_BYTES:
        raise HTTPException(
            status_code=413,
            detail="The schedule image must be 10 MB or smaller.",
        )
    _validate_image(content)

    try:
        ocr_response = run_ocr(content)
        class_info = extract_classes(
            content,
            ocr_response,
            fileUpload.content_type,
        )
        count = set_up_and_create_events(
            timezone,
            user_token,
            class_info,
            palette,
        )
    except HttpError as error:
        if getattr(error.resp, "status", None) in {401, 403}:
            raise HTTPException(
                status_code=401,
                detail="Google Calendar authorization expired or was denied.",
            ) from error
        raise HTTPException(
            status_code=502,
            detail="Google Calendar could not create the events.",
        ) from error
    except (GoogleAPICallError, OCRProcessingError, APIError) as error:
        raise HTTPException(
            status_code=502,
            detail="The schedule extraction service is temporarily unavailable.",
        ) from error
    except ValueError as error:
        raise HTTPException(
            status_code=422,
            detail="The schedule could not be parsed safely.",
        ) from error

    return {"status": "ok", "count": count}
