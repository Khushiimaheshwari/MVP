import requests

def fetch_events():
    # Example of dummy data — in practice, scrape or call Eventbrite API
    return [
        {"title": "Live Music Night", "category": "music", "location": "Sydney", "date": "2025-06-10", "link": "https://example.com/event1"},
        {"title": "Tech Meetup", "category": "tech", "location": "Sydney", "date": "2025-06-12", "link": "https://example.com/event2"}
    ]

def filter_events_by_preferences(events, prefs):
    categories = prefs.get('categories', [])
    if isinstance(categories, str):
        categories = [categories]

    return [
        e for e in events
        if e['category'] in categories and
           e['location'].lower() == prefs.get('location', '').lower()
    ]

