from flask import Flask, request
from telegram_bot import handle_telegram_webhook
from llm_handler import generate_response
from events import fetch_events, filter_events_by_preferences
from database import save_user_preferences, get_all_users
from flask_cors import CORS

app = Flask(__name__)
# CORS(app)
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

@app.route('/webhook', methods=['POST'])
def telegram_webhook():
    return handle_telegram_webhook(request.json)

@app.route('/scan-events', methods=['GET'])
def scan_events():
    events = fetch_events()
    users = get_all_users()
    for user in users:
        matches = filter_events_by_preferences(events, user['preferences'])
        for event in matches:
            from telegram_bot import notify_user
            notify_user(user['user_id'], event)
    return {"status": "done"}

@app.route('/save-preferences', methods=['POST', 'OPTIONS'])
def save_preferences():
    if request.method == 'OPTIONS':
        return {}, 200
    
    data = request.json
    user_id = data.get("user_id", "web-user") 
    save_user_preferences(user_id, data)
    return {"message": "Preferences saved successfully"}

if __name__ == '__main__':
    app.run(debug=True)