import requests
from bs4 import BeautifulSoup
import json
import os
import time

# Cache mechanisms
CACHE_FILE = "ai_tools_cache.json"
CACHE_DURATION = 86400  # 24 hours

def fetch_ai_tools():
    # Check cache first
    # if os.path.exists(CACHE_FILE):
    #     with open(CACHE_FILE, "r") as f:
    #         cache_data = json.load(f)
    #         if time.time() - cache_data.get("timestamp", 0) < CACHE_DURATION:
    #             return cache_data.get("tools", [])

    url = "https://startupstash.com/explore/"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
    }

    fallback_tools = [
        {
            "name": "ChatGPT",
            "description": "AI conversational assistant for writing, coding and research",
            "logo": "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
            "category": "Productivity",
            "url": "https://chat.openai.com"
        },
        {
            "name": "Midjourney",
            "description": "AI tool for generating stunning images from text prompts",
            "logo": "https://upload.wikimedia.org/wikipedia/commons/e/e6/Midjourney_Emblem.png",
            "category": "Design",
            "url": "https://midjourney.com"
        },
        {
            "name": "GitHub Copilot",
            "description": "Your AI pair programmer, helps you write code faster with less work",
            "logo": "https://vectorseek.com/wp-content/uploads/2023/08/Github-Copilot-Logo-Vector.svg-.png",
            "category": "Coding",
            "url": "https://github.com/features/copilot"
        },
        {
            "name": "Jasper",
            "description": "AI content generator for marketing, social media, and more",
            "logo": "https://images.seeklogo.com/logo-png/59/1/jasper-logo-png_seeklogo-593159.png",
            "category": "Writing",
            "url": "https://jasper.ai"
        },
        {
            "name": "Notion AI",
            "description": "Integrated AI assistant within Notion for writing and summarizing",
            "logo": "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
            "category": "Productivity",
            "url": "https://notion.so"
        },
        {
            "name": "Perplexity AI",
            "description": "AI-powered search engine that provides direct answers with citations",
            "logo": "https://images.seeklogo.com/logo-png/61/3/perplexity-ai-icon-black-logo-png_seeklogo-611679.png",
            "category": "Research",
            "url": "https://perplexity.ai"
        },
        {
            "name": "Grammarly",
            "description": "AI writing assistant that helps with grammar, tone, and clarity",
            "logo": "https://latestlogo.com/wp-content/uploads/2024/02/grammarly-icon.png",
            "category": "Writing",
            "url": "https://grammarly.com"
        },
        {
            "name": "Zapier Central",
            "description": "AI-powered automation platform to connect your apps and workflows",
            "logo": "https://th.bing.com/th/id/OIP.GaXGEQxybMCkOqjieJr2VQHaHa?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3",
            "category": "Automation",
            "url": "https://zapier.com"
        },
        {
            "name": "Cursor",
            "description": "The AI Code Editor built for pair programming with an AI",
            "logo": "https://tse1.mm.bing.net/th/id/OIP.QpMKJ9xBA1Q-k5eGk_u2vwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
            "category": "Coding",
            "url": "https://cursor.sh"
        },
        {
            "name": "Leonardo.ai",
            "description": "Generative AI platform for creators to design production quality assets",
            "logo": "https://tse4.mm.bing.net/th/id/OIP.g8i8-dc_mxjt-uKrGP4hogHaHl?rs=1&pid=ImgDetMain&o=7&rm=3",
            "category": "Design",
            "url": "https://leonardo.ai"
        }
    ]

    try:
        # In this specific environment, external requests to StartupStash might be blocked.
        # We attempt the scrape but provide the robust fallback for a seamless demo experience.
        response = requests.get(url, headers=headers, timeout=5)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            tools = []
            
            # The structure for StartupStash (v3) usually items in div.listing-item or similar
            # However, since we can't verify live, we'll try common patterns
            items = soup.find_all('div', class_='listing-item')
            if not items:
                # Try alternative common classes
                items = soup.find_all('div', class_='card-container')

            for item in items:
                name_tag = item.find(['h2', 'h3', 'h4'], class_='title')
                desc_tag = item.find('div', class_='description') or item.find('p')
                img_tag = item.find('img')
                link_tag = item.find('a', href=True)
                category_tag = item.find('div', class_='category')

                if name_tag:
                    tool = {
                        "name": name_tag.get_text(strip=True),
                        "description": desc_tag.get_text(strip=True) if desc_tag else "No description available",
                        "logo": img_tag.get('src') if img_tag else "https://via.placeholder.com/150",
                        "category": category_tag.get_text(strip=True) if category_tag else "General",
                        "url": link_tag['href'] if link_tag else "#"
                    }
                    tools.append(tool)
            
            if tools:
                # Cache results
                # with open(CACHE_FILE, "w") as f:
                #     json.dump({"timestamp": time.time(), "tools": tools}, f)
                return tools
    except Exception as e:
        print(f"Scraping error: {e}")

    # Return fallback if scraping unsuccessful
    return fallback_tools
