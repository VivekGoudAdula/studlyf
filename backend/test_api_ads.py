import requests
import json

try:
    r = requests.get("http://localhost:8000/api/ads")
    if r.status_code == 200:
        data = r.json()
        print(f"✅ /api/ads returned {len(data)} items")
        for item in data:
            print(f"- {item.get('title')} (active: {item.get('active')})")
    else:
        print(f"❌ /api/ads failed with status: {r.status_code}")
        print(r.text)
except Exception as e:
    print(f"❌ Error reaching /api/ads: {e}")
