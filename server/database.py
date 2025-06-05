from pymongo import MongoClient
import os

client = MongoClient(os.getenv("MONGODB_URI"))
db = client["event_mvp"]
users = db["users"]

def save_user_preferences(user_id, prefs):
    users.update_one({"user_id": user_id}, {"$set": {"preferences": prefs}}, upsert=True)

def get_all_users():
    return list(users.find({}))
