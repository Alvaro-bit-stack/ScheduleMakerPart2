from openai import OpenAI
import base64
from dotenv import load_dotenv
import re
import pprint
from ocr import run_ocr

load_dotenv()
client = OpenAI()  # automatically picks up on OPENAI_API_KEY


def extract_classes(image_bytes, OCR_response):
    if not OCR_response:
        OCR_response = run_ocr(image_bytes)
    image_base64 = base64.b64encode(image_bytes).decode("utf-8")
    prompt = (
        "Extract all classes, times, recurrence, and location from this schedule image. "
        "Use the 'Section' field and the 'Instructional Format' field to name each class, not just the general course listing. "
        "Always include distinctions such as Lecture, Lab, or Recitation exactly as written in the schedule, even if multiple sections belong to the same course. "
        "Format each class exactly as SectionName (including Lecture/Lab/Recitation as labeled): StartTime-EndTime (both formatted fully as YYYY-MM-DDTHH:MM:SS with the same date included for both start and end, no timezone offset), Recurrence: DAY1/DAY2/DAY3(Use MO|TU|WE|TH|FR|SA|SU), Location: LOCATION. "
        "Only include classes that have designated times (exclude any without times). Do not merge or omit classes that share the same base course but differ in Section or Instructional Format. "
        "Separate each class entry ONLY with a '#' symbol (no spaces or newlines before or after). Return everything in one single line with no explanations, no headers, and no extra text."
    )

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{image_base64}"
                        },
                    },
                ],
            }
        ],
    )

    response = response.choices[0].message.content
    print(response)
    # New prompt to crosscheck
    crosscheck_prompt = f"""
    Crosscheck your previous class schedule extraction(Previous response:{response}) with the following OCR text.
    Make sure all classes, times, recurrences, and locations match exactly.
    If anything is missing or incorrect, fix it while keeping the original output format:
    SectionName: StartTime-EndTime, Recurrence: DAYS, Location: LOCATION
    Separate each class entry ONLY with a '#' symbol (no spaces or newlines before or after). Return everything in one single line with no explanations, no headers, and no extra text.
    Keep the format of the new response exactly the same as the previous response, only change mistakes.
    OCR text: {OCR_response}
    """

    # Send as a new message in the chat
    followup_response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "user", "content": crosscheck_prompt}
        ],
    )

    # Extract the text
    followup_text = followup_response.choices[0].message.content
    response = followup_text
    print(response)
    response = response.split('#')
    day_pattern = r"(MO|TU|WE|TH|FR|SA|SU)"
    time_pattern = r"(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})-(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})"
    location_pattern = r"Location:\s*([^#]+)"
    class_information = []
    for classes in response:
        temp_dict = {}
        temp_dict["class"] = re.search(r"(.*?):", classes).group()
        temp_dict["days"] = re.findall(day_pattern, classes)
        timesearch = re.search(time_pattern, classes)
        temp_dict["start_time"] = timesearch.group(1)
        temp_dict["end_time"] = timesearch.group(2)
        temp_dict["location"] = re.findall(location_pattern, classes)
        temp_dict["reccurance"] = "WEEKLY"  # changes based on user preference
        class_information.append(temp_dict)
    x = pprint.pprint(class_information)
    print(x)
    return class_information


