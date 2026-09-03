import os

from dotenv import load_dotenv
from google.cloud import vision

load_dotenv()

os.environ.setdefault(
    "GOOGLE_APPLICATION_CREDENTIALS",
    os.environ.get("GOOGLE_VISION_CREDS_FILE", "api_json.json"),
)
client = vision.ImageAnnotatorClient()


class OCRProcessingError(RuntimeError):
    """Raised when Google Cloud Vision cannot process an image."""


def run_ocr(image_bytes: bytes) -> str:
    """Run OCR on image bytes and return detected text."""
    image = vision.Image(content=image_bytes)
    response = client.document_text_detection(image=image)
    if response.error.message:
        raise OCRProcessingError("Google Cloud Vision OCR request failed.")
    return response.full_text_annotation.text
