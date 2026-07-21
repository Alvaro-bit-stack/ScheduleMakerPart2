import os
from google.cloud import vision

# Path to the Google Cloud Vision service-account JSON. Configurable via env,
# defaults to "api_json.json" in the backend folder.
os.environ.setdefault(
    "GOOGLE_APPLICATION_CREDENTIALS",
    os.environ.get("GOOGLE_VISION_CREDS_FILE", "api_json.json"),
)
client = vision.ImageAnnotatorClient()


def run_ocr(image_bytes: bytes) -> str:
    """Run OCR on image bytes and return detected text."""
    image = vision.Image(content=image_bytes)
    response = client.document_text_detection(image=image)
    return response.full_text_annotation.text


