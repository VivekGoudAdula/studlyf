
import google.genai as genai
import os

key = "AIzaSyCgA0T3O4abVr8dsII3S7zjciFdXbnsAqc"
genai.configure(api_key=key)

print("Listing available models...")
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"- {m.name}")
except Exception as e:
    print(f"Error listing models: {e}")
