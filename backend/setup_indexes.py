import asyncio
import os
import sys

# Add the current directory to sys.path so we can import from db
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from db import participants_col, events_col, judges_col, scores_col, submissions_col, leaderboard_col, notifications_col, event_judges_col
from pymongo import ASCENDING

async def setup_indexes():
    print("Setting up MongoDB indexes for Nagasiva's Backbone...")
    
    # 1. Participants: Unique (user_id, event_id)
    try:
        await participants_col.create_index([("user_id", ASCENDING), ("event_id", ASCENDING)], unique=True)
        print("[SUCCESS] Participants unique index (user_id, event_id) created.")
    except Exception as e:
        print(f"[INFO] Participants index: {e}")

    # 2. Scores: Unique (submission_id, judge_id)
    try:
        await scores_col.create_index([("submission_id", ASCENDING), ("judge_id", ASCENDING)], unique=True)
        print("[SUCCESS] Scores unique index (submission_id, judge_id) created.")
    except Exception as e:
        print(f"[INFO] Scores index: {e}")

    # 3. Submissions: Index on event_id for faster lookups
    try:
        await submissions_col.create_index([("event_id", ASCENDING)])
        print("[SUCCESS] Submissions event_id index created.")
    except Exception as e:
        print(f"[INFO] Submissions index: {e}")

    # 4. Notifications: Index on user_id
    try:
        await notifications_col.create_index([("user_id", ASCENDING)])
        print("[SUCCESS] Notifications user_id index created.")
    except Exception as e:
        print(f"[INFO] Notifications index: {e}")

    # 5. Event-Judge Mapping: Unique (event_id, judge_id)
    try:
        await event_judges_col.create_index([("event_id", ASCENDING), ("judge_id", ASCENDING)], unique=True)
        print("[SUCCESS] Event-Judge unique index created.")
    except Exception as e:
        print(f"[INFO] Event-Judge index: {e}")

    # 6. Leaderboard: Index on event_id
    try:
        await leaderboard_col.create_index([("event_id", ASCENDING)])
        print("[SUCCESS] Leaderboard event_id index created.")
    except Exception as e:
        print(f"[INFO] Leaderboard index: {e}")

    print("--- Mandatory indexes setup complete ---")

if __name__ == "__main__":
    asyncio.run(setup_indexes())
