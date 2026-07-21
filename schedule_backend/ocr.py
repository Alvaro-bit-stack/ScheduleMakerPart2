import os
from google.cloud import vision

# Set credentials once
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'api_json.json'
client = vision.ImageAnnotatorClient()


def run_ocr(image_bytes: bytes) -> str:
    """Run OCR on image bytes and return detected text."""
    image = vision.Image(content=image_bytes)
    response = client.document_text_detection(image=image)
    return response.full_text_annotation.text


