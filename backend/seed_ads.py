"""
Seed script — inserts all 22 dummy ads into the `advertisements` collection.
Run once:  python seed_ads.py
"""
import asyncio, os, certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from datetime import datetime, timezone

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

MONGO_URL = os.getenv("MONGO_URL", "mongodb+srv://saieshwarerelli10:Nirvaha%25studly@nirvaha-studlfy.s1l8mvx.mongodb.net/?appName=Nirvaha-studlfy")
client = AsyncIOMotorClient(MONGO_URL, tlsCAFile=certifi.where())
db = client[os.getenv("DB_NAME", "studlyf_db")]
ads_col = db["advertisements"]

DUMMY_ADS = [
    {
        "card_type": "video", "eyebrow": "Data Science",
        "title": "Machine Learning A–Z: Hands-On Python",
        "description": "Master ML algorithms with real datasets. From regression to deep neural networks, all from scratch.",
        "media_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "media_type": "video", "tag": "🎬 Video Course", "duration": "42 lectures · 18h",
        "cta_text": "Enroll →", "cta_style": "primary", "pills": ["Beginner", "Certificate"],
        "color_scheme": "dark", "bg_color": "blue", "order": 0, "active": True,
    },
    {
        "card_type": "image", "eyebrow": "Creative Design",
        "title": "UI/UX Design Masterclass — Figma to Prototype",
        "description": "Build stunning interfaces. Learn Figma, design systems, and ship your first real product.",
        "media_url": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop",
        "media_type": "image", "badge": "New 2025",
        "cta_text": "Start Free →", "cta_style": "dark", "pills": ["Intermediate"],
        "color_scheme": "light", "bg_color": "soft-blue", "order": 1, "active": True,
    },
    {
        "card_type": "wide", "eyebrow": "Full-Stack Web Dev",
        "title": "React + Node.js: Build Real-World Apps",
        "description": "The complete fullstack bootcamp. Deploy live projects with auth, databases, and REST APIs.",
        "media_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        "media_type": "video", "tag": "🎓 Bestseller", "duration": "6h preview free",
        "cta_text": "Grab Deal →", "cta_style": "gold",
        "color_scheme": "dark", "wide_side": "dark", "bg_color": "teal", "order": 2, "active": True,
    },
    {
        "card_type": "promo", "eyebrow": "", "title": "Unlock Every Course for ₹999/mo",
        "description": "", "promo_tag": "⚡ Flash Sale — 48 hrs left",
        "promo_stats": [
            {"num": "5,200+", "label": "Courses"}, {"num": "180+", "label": "Instructors"},
            {"num": "96%", "label": "Completion"}, {"num": "∞", "label": "Access"},
        ],
        "cta_text": "Get All-Access →", "cta_style": "white",
        "color_scheme": "dark", "order": 3, "active": True,
    },
    {
        "card_type": "image", "eyebrow": "Science & Biology",
        "title": "Introduction to Genetics & Genomics",
        "description": "Decode DNA. Understand CRISPR, gene editing, and the science reshaping humanity.",
        "media_url": "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&auto=format&fit=crop",
        "media_type": "image", "badge": "Top Rated",
        "cta_text": "Explore →", "cta_style": "sage", "pills": ["All Levels"],
        "color_scheme": "light", "bg_color": "soft-green", "order": 4, "active": True,
    },
    {
        "card_type": "video", "eyebrow": "Business & Finance",
        "title": "MBA Essentials: Strategy, Finance & Leadership",
        "description": "Learn what top business schools teach — in a fraction of the time and cost.",
        "media_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
        "media_type": "video", "tag": "🏆 Award Winning", "duration": "28 lectures · 9h",
        "cta_text": "Enroll →", "cta_style": "gold", "pills": ["Advanced", "MBA"],
        "color_scheme": "dark", "bg_color": "purple", "order": 5, "active": True,
    },
    {
        "card_type": "wide", "eyebrow": "Arts & Music",
        "title": "Music Theory & Composition for Beginners",
        "description": "From reading notes to composing your own pieces. No prior experience needed.",
        "media_url": "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&auto=format&fit=crop",
        "media_type": "image",
        "cta_text": "Start Learning →", "cta_style": "primary",
        "color_scheme": "light", "wide_side": "light", "bg_color": "soft-amber", "order": 6, "active": True,
    },
    {
        "card_type": "video", "eyebrow": "Cybersecurity",
        "title": "Ethical Hacking & Penetration Testing",
        "description": "Learn to think like a hacker. Protect systems, find vulnerabilities, earn your CEH.",
        "media_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        "media_type": "video", "tag": "🔥 Trending", "duration": "15 lectures · 6h",
        "cta_text": "Join Now →", "cta_style": "outline-light", "pills": ["Advanced"],
        "color_scheme": "dark", "bg_color": "rose", "order": 7, "active": True,
    },
    {
        "card_type": "image", "eyebrow": "Artificial Intelligence",
        "title": "Prompt Engineering & LLM Applications",
        "description": "Master GPT-4, Claude, and Gemini. Build production AI apps, agents, and pipelines from scratch.",
        "media_url": "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&auto=format&fit=crop",
        "media_type": "image", "badge": "Hot 🔥",
        "cta_text": "Learn Now →", "cta_style": "dark", "pills": ["All Levels"],
        "color_scheme": "light", "bg_color": "soft-blue", "order": 8, "active": True,
    },
    {
        "card_type": "promo", "eyebrow": "", "title": "Land Your Dream Job in 90 Days",
        "description": "", "promo_tag": "🎯 Career Guarantee Program",
        "promo_stats": [
            {"num": "94%", "label": "Placement"}, {"num": "₹12L+", "label": "Avg. Package"},
            {"num": "200+", "label": "Hiring Partners"}, {"num": "90", "label": "Day Track"},
        ],
        "cta_text": "Apply Now →", "cta_style": "white",
        "color_scheme": "dark", "order": 9, "active": True,
    },
    {
        "card_type": "wide", "eyebrow": "Product Management",
        "title": "Become a PM at FAANG: Zero to Offer",
        "description": "From PRDs to product metrics, strategy to stakeholder management — get PM-ready with real case studies.",
        "media_url": "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop",
        "media_type": "image", "badge": "Top Pick",
        "cta_text": "Start Journey →", "cta_style": "primary",
        "color_scheme": "light", "wide_side": "light", "bg_color": "soft-amber", "order": 10, "active": True,
    },
    {
        "card_type": "video", "eyebrow": "Cloud & DevOps",
        "title": "Kubernetes & Docker: Production Mastery",
        "description": "Deploy, scale, and manage containerised workloads on Kubernetes. Hands-on with real clusters.",
        "media_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        "media_type": "video", "tag": "☁️ Cloud Track", "duration": "36 lectures · 22h",
        "cta_text": "Enroll →", "cta_style": "primary", "pills": ["Intermediate", "Cert"],
        "color_scheme": "dark", "bg_color": "teal", "order": 11, "active": True,
    },
    {
        "card_type": "image", "eyebrow": "Blockchain & Web3",
        "title": "Solidity & Smart Contracts: Build on Ethereum",
        "description": "Write, test, and deploy ERC-20 tokens and DeFi protocols. Go from zero to on-chain in 6 weeks.",
        "media_url": "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop",
        "media_type": "image", "badge": "🔗 Web3",
        "cta_text": "Start Building →", "cta_style": "dark", "pills": ["Intermediate"],
        "color_scheme": "light", "bg_color": "soft-blue", "order": 12, "active": True,
    },
    {
        "card_type": "wide", "eyebrow": "Adobe & Creative Suite",
        "title": "Photography Masterclass: From DSLR to Editorial",
        "description": "Shoot, retouch, and sell professional photography. Covers composition, Lightroom, Photoshop, and client workflows.",
        "media_url": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop",
        "media_type": "image", "badge": "Staff Pick",
        "cta_text": "Explore Course →", "cta_style": "dark",
        "color_scheme": "light", "wide_side": "light", "bg_color": "soft-green", "order": 13, "active": True,
    },
    {
        "card_type": "video", "eyebrow": "Language Learning",
        "title": "Spanish B2 in 60 Days — Immersive Method",
        "description": "Learn real conversational Spanish through storytelling, native content, and live tutoring sessions.",
        "media_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "media_type": "video", "tag": "🌍 Language", "duration": "80 lessons · 24h",
        "cta_text": "Start Free →", "cta_style": "sage", "pills": ["Beginner → B2"],
        "color_scheme": "dark", "bg_color": "green", "order": 14, "active": True,
    },
    {
        "card_type": "image", "eyebrow": "Personal Finance",
        "title": "Stock Market Investing for Indian Millennials",
        "description": "Mutual funds, SIPs, NSE/BSE, F&O basics, and tax planning — all explained simply by SEBI-registered advisors.",
        "media_url": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop",
        "media_type": "image", "badge": "📈 Finance",
        "cta_text": "Invest in Yourself →", "cta_style": "primary", "pills": ["All Levels"],
        "color_scheme": "light", "bg_color": "soft-amber", "order": 15, "active": True,
    },
    {
        "card_type": "promo", "eyebrow": "", "title": "Study Now. Pay When You Get Hired.",
        "description": "", "promo_tag": "🎓 Income Share Agreement",
        "promo_stats": [
            {"num": "₹0", "label": "Upfront Cost"}, {"num": "6mo", "label": "Payment Grace"},
            {"num": "10%", "label": "ISA Rate"}, {"num": "3yr", "label": "Max Term"},
        ],
        "cta_text": "Check Eligibility →", "cta_style": "white",
        "color_scheme": "dark", "order": 16, "active": True,
    },
    {
        "card_type": "wide", "eyebrow": "Leadership & Soft Skills",
        "title": "Executive Communication: Speak Like a Leader",
        "description": "Public speaking, persuasion, conflict resolution, and C-suite storytelling — all in one power-packed programme.",
        "media_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
        "media_type": "video", "tag": "🎙 Leadership", "duration": "18 modules · 10h",
        "cta_text": "Enroll Now →", "cta_style": "gold",
        "color_scheme": "dark", "wide_side": "dark", "bg_color": "amber", "order": 17, "active": True,
    },
    {
        "card_type": "video", "eyebrow": "Data Analytics",
        "title": "Power BI & Tableau: Turn Data Into Decisions",
        "description": "Build live dashboards, KPIs, and executive reports. Used by 40,000+ analysts at Fortune 500 companies.",
        "media_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
        "media_type": "video", "tag": "📊 Analytics", "duration": "52 lessons · 20h",
        "cta_text": "Get Certified →", "cta_style": "primary", "pills": ["Intermediate", "MBA-ready"],
        "color_scheme": "dark", "bg_color": "blue", "order": 18, "active": True,
    },
    {
        "card_type": "image", "eyebrow": "Health & Wellness",
        "title": "Yoga & Mindfulness for High-Performance Professionals",
        "description": "30-minute daily sequences designed for desk workers. Reduce burnout, boost focus, and sleep better every night.",
        "media_url": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop",
        "media_type": "image", "badge": "🧘 Wellness",
        "cta_text": "Start Today →", "cta_style": "sage", "pills": ["All Levels"],
        "color_scheme": "light", "bg_color": "soft-green", "order": 19, "active": True,
    },
    {
        "card_type": "video", "eyebrow": "Game Development",
        "title": "Unreal Engine 5: Build AAA Games from Scratch",
        "description": "Nanite, Lumen, Blueprints, and multiplayer networking — the full UE5 stack from a AAA ex-senior developer.",
        "media_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
        "media_type": "video", "tag": "🎮 Game Dev", "duration": "110 lectures · 38h",
        "cta_text": "Launch Career →", "cta_style": "gold", "pills": ["Intermediate"],
        "color_scheme": "dark", "bg_color": "purple", "order": 20, "active": True,
    },
    {
        "card_type": "wide", "eyebrow": "Placement Partner",
        "title": "Microsoft LEAP Program — Exclusive for Studlyf Alumni",
        "description": "Microsoft LEAP is a 16-week apprenticeship for non-traditional engineers. Studlyf has a dedicated pipeline with 100% interview invitation for qualified graduates.",
        "media_url": "https://images.unsplash.com/photo-1583752028088-91e3e9880b46?w=800&auto=format&fit=crop",
        "media_type": "image", "badge": "🏆 Elite Partner",
        "cta_text": "View Partnership →", "cta_style": "dark",
        "color_scheme": "light", "wide_side": "light", "bg_color": "soft-blue", "order": 21, "active": True,
    },
]

async def seed():
    existing = await ads_col.count_documents({})
    if existing > 0:
        print(f"⚠️  Collection already has {existing} ads. Clearing and re-seeding...")
        await ads_col.delete_many({})

    now = __import__('datetime').datetime.now(__import__('datetime').timezone.utc).isoformat()
    for ad in DUMMY_ADS:
        ad["created_at"] = now
        ad.setdefault("tag", "")
        ad.setdefault("badge", "")
        ad.setdefault("pills", [])
        ad.setdefault("promo_tag", "")
        ad.setdefault("promo_stats", [])
        ad.setdefault("duration", "")
        ad.setdefault("wide_side", "dark")
        ad.setdefault("media_url", "")
        ad.setdefault("media_type", "image")
        ad.setdefault("eyebrow", "")
        ad.setdefault("description", "")

    result = await ads_col.insert_many(DUMMY_ADS)
    print(f"✅  Seeded {len(result.inserted_ids)} ads into 'advertisements' collection.")

asyncio.run(seed())
