from telegram import Bot
import requests
import os
from llm_handler import generate_response
from database import save_user_preferences
from dotenv import load_dotenv

load_dotenv()  

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
bot = Bot(token=BOT_TOKEN)

def handle_telegram_webhook(data):
    print("Webhook received:", data)
    chat_id = data["message"]["chat"]["id"]
    text = data["message"]["text"]

    response, prefs = generate_response(text, chat_id)
    if prefs:
        save_user_preferences(chat_id, prefs)
    bot.send_message(chat_id=chat_id, text=response)
    return {"ok": True}

def notify_user(chat_id, event):
    message = f"🎉 New event matched your interests:\n\n{event['title']}\n {event['location']}\n {event['date']}\n {event['link']}"
    bot.send_message(chat_id=chat_id, text=message)
    print(f"Sending to {chat_id}: {message}")
