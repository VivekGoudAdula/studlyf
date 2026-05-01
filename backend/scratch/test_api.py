
import requests
import json

base_url = "http://localhost:8000"
inst_id = "default_inst"

endpoints = [
    f"/api/v1/institution/summary/{inst_id}",
    f"/api/v1/institution/notifications/{inst_id}",
    f"/api/v1/institution/events/{inst_id}",
    f"/api/v1/institution/submissions/{inst_id}"
]

for ep in endpoints:
    url = base_url + ep
    print(f"Testing {url}...")
    try:
        res = requests.get(url)
        print(f"Status: {res.status_code}")
        print(f"Response: {res.text[:200]}...")
    except Exception as e:
        print(f"Error: {e}")
    print("-" * 20)
