import os
import requests
import re, json
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY")
API_URL = "https://api.openrouter.ai/v1/completions"  

def generate_response(text, user_id):
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    data = {
        "model": "DeepSeek-R1",
        "prompt": f"""You are an assistant helping users find city events.
            From the message below, extract event preferences in JSON format with possible keys:
            - categories: array (like ["music", "comedy"])
            - location: string (like "Sydney")
            - budget: string ("free" or "paid")
            If nothing is found, return null for preferences.

        User: "{text}"
        Respond in this format:

        Reply: <natural message>
        Preferences: <JSON or null>""",
            "max_tokens": 200,
            "temperature": 0.7
        }

    response = requests.post(API_URL, headers=headers, json=data)
    result = response.json()
    reply = result.get('choices', [{}])[0].get('text', '').strip()

    reply_parts = reply.split("Preferences:")
    reply_text = reply_parts[0].replace("Reply:", "").strip()
    prefs = None
    try:
        prefs_json = reply_parts[1].strip()
        prefs = json.loads(prefs_json)
    except Exception:
        pass

    return reply_text, prefs if prefs else None