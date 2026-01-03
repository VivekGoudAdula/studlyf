from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from pydantic import BaseModel
import pdfplumber
import docx
import tempfile
import os
import json
import re
import uuid
import google.generativeai as genai
import requests
from jinja2 import Environment, FileSystemLoader
from datetime import datetime
from db import courses_col, modules_col, theories_col, videos_col, quizzes_col, projects_col, progress_col, certificates_col, cart_col, enrollments_col
from models import Course, Module, Theory, Video, Quiz, Project, UserProgress, CartItem, Enrollment

# Request body model for add to cart
class AddToCartRequest(BaseModel):
    course_id: str

def fix_id(doc):
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc

def fix_progress(prog, default_status="locked"):
    if not prog:
        return {
            "status": default_status,
            "theory_completed": False,
            "video_completed": False,
            "quiz_score": 0,
            "quiz_answers": [],
            "project_status": "not_started"
        }
    
    defaults = {
        "theory_completed": False,
        "video_completed": False,
        "quiz_score": 0,
        "quiz_answers": [],
        "project_status": "not_started",
        "status": "unlocked"
    }
    # Merge defaults with actual data
    return {**defaults, **fix_id(prog)}

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini
GENAI_API_KEY = "AIzaSyCgA0T3O4abVr8dsII3S7zjciFdXbnsAqc"
genai.configure(api_key=GENAI_API_KEY)
model = genai.GenerativeModel('gemini-2.5-flash')
# Note: As of late 2024/early 2025, Gemini 1.5 Flash is standard. I will assume 1.5 Flash for stability unless I get an error.

class GithubAnalysisRequest(BaseModel):
    token: str

def get_github_data(token: str, endpoint: str, session=None):
    headers = {"Authorization": f"token {token}", "Accept": "application/vnd.github.v3+json"}
    url = f"https://api.github.com{endpoint}"
    try:
        r = session or requests
        response = r.get(url, headers=headers, timeout=10)
        if response.status_code != 200:
            return None
        return response.json()
    except Exception as e:
        print(f"GitHub API Error for {endpoint}: {e}")
        return None

def analyze_readme(readme_content):
    if not readme_content: return 0
    # Simple heuristic: length and presence of headers/sections
    score = min(20, len(readme_content) / 100)
    if "#" in readme_content: score += 5
    if "```" in readme_content: score += 5
    return score

@app.post("/api/analyze-github")
async def analyze_github(request: GithubAnalysisRequest):
    token = request.token
    user_data = get_github_data(token, "/user")
    if not user_data:
        raise HTTPException(status_code=401, detail="Invalid GitHub token")
    
    repos = get_github_data(token, "/user/repos?per_page=100&sort=updated&type=owner")
    if not repos:
        return {"error": "No repositories found"}

    # Signal -> Skill mapping counters 
    skills_raw = {
        "Backend": 0.0,
        "Frontend": 0.0,
        "DevOps": 0.0,
        "Data": 0.0,
        "GenAI": 0.0
    }
    
    language_stats = {}
    total_loc = 0
    repo_count = len(repos)
    signals_found = []

    # Map signals to skills as requested
    framework_map = {
        "Backend": ["fastapi", "flask", "django", "express", "spring", "laravel"],
        "Frontend": ["react", "next", "vue", "angular", "tailwind", "vite"],
        "DevOps": ["docker", "kubernetes", "jenkins", "action", "terraform", "ansible"],
        "Data": ["pandas", "numpy", "matplotlib", "scikit", "sql", "spark"],
        "GenAI": ["openai", "langchain", "llama", "transformers", "pytorch", "tensorflow"]
    }

    # Optimized parallel fetching
    from concurrent.futures import ThreadPoolExecutor

    def fetch_repo_details(repo):
        owner = repo['owner']['login']
        name = repo['name']
        desc = (repo.get('description') or "").lower()
        repo_iden = (name + " " + desc).lower()
        is_fork = repo.get('fork', False)
        base_weight = 0.2 if is_fork else 1.0

        # Use session for efficiency
        session = requests.Session()
        langs = get_github_data(token, f"/repos/{owner}/{name}/languages", session)
        contents = get_github_data(token, f"/repos/{owner}/{name}/contents", session)
        readme_data = get_github_data(token, f"/repos/{owner}/{name}/readme", session)
        session.close()

        repo_results = {
            "skills": {k: 0.0 for k in skills_raw},
            "langs": {},
            "loc": 0,
            "signals": []
        }

        # 1. Language Analysis
        if langs:
            for lang, loc in langs.items():
                repo_results["langs"][lang] = loc
                repo_results["loc"] += loc
                if lang in ['Python', 'Go', 'Rust', 'Java', 'PHP']: 
                    repo_results["skills"]["Backend"] += (loc * 0.01) * base_weight
                elif lang in ['JavaScript', 'TypeScript', 'HTML', 'CSS']:
                    repo_results["skills"]["Frontend"] += (loc * 0.01) * base_weight
                elif lang in ['Jupyter Notebook']:
                    repo_results["skills"]["Data"] += (loc * 0.01) * base_weight

        # 2. File & Framework Analysis
        if contents:
            filenames = [f['name'].lower() for f in contents]
            if any(f in ['dockerfile', 'docker-compose.yml', 'kubernetes.yaml'] or f.endswith('.yaml') for f in filenames):
                repo_results["skills"]["DevOps"] += 2000 * base_weight
                repo_results["signals"].append(f"Infrastructure: {name}")

            for skill, keywords in framework_map.items():
                for kw in keywords:
                    if kw in repo_iden:
                        repo_results["skills"][skill] += 3000 * base_weight
                        repo_results["signals"].append(f"{kw.capitalize()} in {name}")
                        break

        # 3. Quality & Recency
        if readme_data and 'content' in readme_data:
            import base64
            try:
                readme_text = base64.b64decode(readme_data['content']).decode('utf-8')
                q_score = analyze_readme(readme_text)
                for skill in repo_results["skills"]:
                    if skill in repo_iden:
                        repo_results["skills"][skill] += q_score * 100
            except: pass

        if "2025" in repo.get('updated_at', '') or "2026" in repo.get('updated_at', ''):
            for skill in repo_results["skills"]:
                if any(kw in repo_iden for kw in framework_map.get(skill, [])):
                    repo_results["skills"][skill] += 500 * base_weight
        
        return repo_results

    # Execute top 10 repos in parallel with a conservative worker count
    from concurrent.futures import ThreadPoolExecutor
    with ThreadPoolExecutor(max_workers=5) as executor:
        results = list(executor.map(fetch_repo_details, repos[:10]))

    # Aggregate Results
    for res in results:
        for skill, val in res["skills"].items():
            skills_raw[skill] += val
        for lang, loc in res["langs"].items():
            language_stats[lang] = language_stats.get(lang, 0) + loc
            total_loc += loc
        signals_found.extend(res["signals"])

    # 4. Normalize to 0-100
    normalization_factor = {
        "Backend": 50000, # Slightly lowered to compensate for fewer repos
        "Frontend": 40000,
        "DevOps": 10000,
        "Data": 25000,
        "GenAI": 15000
    }
    
    normalized_skills = {}
    for skill, raw in skills_raw.items():
        limit = normalization_factor.get(skill, 20000)
        score = min(100, int((raw / limit) * 100))
        if raw > 500: score = max(score, 12) 
        normalized_skills[skill] = score

    # Readiness Score = Weighted average of active skills
    active_skills = [v for v in normalized_skills.values() if v > 0]
    readiness_score = int(sum(active_skills) / len(active_skills)) if active_skills else 0

    # Calculate percentages for top 5 languages
    top_langs_list = sorted(language_stats.items(), key=lambda x: x[1], reverse=True)[:5]
    lang_percentages = {}
    if total_loc > 0:
        lang_percentages = {l: round((c / total_loc) * 100, 1) for l, c in top_langs_list}

    return {
        "username": user_data['login'],
        "avatar_url": user_data['avatar_url'],
        "skills": normalized_skills,
        "languages": lang_percentages,
        "total_loc": total_loc,
        "repo_count": repo_count,
        "signals": sorted(list(set(signals_found)))[:12],
        "readiness_score": readiness_score
    }

# --- COURSE SYSTEM ENDPOINTS ---

@app.get("/api/courses")
async def get_courses():
    courses = []
    async for course in courses_col.find():
        courses.append(fix_id(course))
    return courses

@app.get("/api/courses/{course_id}/modules")
async def get_course_modules(course_id: str, user_id: Optional[str] = None):
    modules = []
    async for module in modules_col.find({"course_id": course_id}).sort("order_index", 1):
        module = fix_id(module)
        # Attach progress if user_id is provided
        if user_id:
            prog = await progress_col.find_one({"user_id": user_id, "module_id": module["_id"]})
            default_status = "unlocked" if module["order_index"] == 1 else "locked"
            module["progress"] = fix_progress(prog, default_status)
        modules.append(module)
    return modules

async def generate_ai_quiz(module_id: str, theory_content: str):
    prompt = f"""
    Create a high-quality 5-question multiple choice quiz based on this technical content.
    
    Content:
    {theory_content}
    
    JSON Output Format:
    {{
        "questions": [
            {{
                "question": "Clear technical question?",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct_answers": [0],
                "explanation": "Why the answer is correct."
            }}
        ]
    }}
    
    Rules:
    - 4 options per question.
    - Exactly one correct answer (index 0-3).
    - Provide a technical explanation.
    - Return ONLY the JSON.
    """
    try:
        response = model.generate_content(prompt)
        quiz_data = json.loads(clean_json_string(response.text))
        quiz_data["module_id"] = module_id
        await quizzes_col.insert_one(quiz_data)
        return fix_id(quiz_data)
    except Exception as e:
        print(f"Error generating AI Quiz: {e}")
        return None

@app.get("/api/modules/{module_id}")
async def get_module_details(module_id: str):
    theory = await theories_col.find_one({"module_id": module_id})
    video = await videos_col.find_one({"module_id": module_id})
    quiz = await quizzes_col.find_one({"module_id": module_id})
    project = await projects_col.find_one({"module_id": module_id})
    
    # AI Generation if Quiz is missing
    if not quiz and theory:
        quiz = await generate_ai_quiz(module_id, theory["markdown_content"])
    
    return {
        "theory": fix_id(theory),
        "video": fix_id(video),
        "quiz": fix_id(quiz),
        "project": fix_id(project)
    }

@app.post("/api/progress/update")
async def update_progress(data: dict):
    user_id = data.get("user_id")
    module_id = data.get("module_id")
    course_id = data.get("course_id")
    updates = data.get("updates", {}) # e.g. {"theory_completed": True}
    
    if not user_id or not module_id:
        raise HTTPException(status_code=400, detail="Missing user_id or module_id")

    # Update current module progress
    await progress_col.update_one(
        {"user_id": user_id, "module_id": module_id},
        {"$set": {**updates, "course_id": course_id}},
        upsert=True
    )
    
    # Check if module is now complete to unlock next one
    prog = await progress_col.find_one({"user_id": user_id, "module_id": module_id})
    if (prog.get("theory_completed") and 
        prog.get("video_completed") and 
        prog.get("quiz_score", 0) >= 70 and 
        prog.get("project_status") == "submitted"):
        
        await progress_col.update_one(
            {"user_id": user_id, "module_id": module_id},
            {"$set": {"status": "completed"}}
        )
        
        # Find and unlock next module
        current_mod = await modules_col.find_one({"_id": module_id})
        next_mod = await modules_col.find_one({
            "course_id": course_id, 
            "order_index": current_mod["order_index"] + 1
        })
        
        if next_mod:
            await progress_col.update_one(
                {"user_id": user_id, "module_id": next_mod["_id"]},
                {"$set": {"status": "unlocked", "course_id": course_id}},
                upsert=True
            )
            return {"status": "module_completed", "unlocked_next": True}
        else:
            return {"status": "course_completed"}

    return {"status": "updated"}

@app.post("/api/quiz/submit")
async def submit_quiz(data: dict):
    user_id = data.get("user_id")
    module_id = data.get("module_id")
    answers = data.get("answers", []) # Indices of chosen options
    
    quiz = await quizzes_col.find_one({"module_id": module_id})
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
        
    correct_count = 0
    total = len(quiz["questions"])
    
    for i, q in enumerate(quiz["questions"]):
        user_ans = set(answers[i]) if i < len(answers) else set()
        correct_ans = set(q["correct_answers"])
        if user_ans == correct_ans:
            correct_count += 1
            
    score = (correct_count / total) * 100
    
    # Update progress with score AND answers
    await progress_col.update_one(
        {"user_id": user_id, "module_id": module_id},
        {"$set": {"quiz_score": score, "quiz_answers": answers, "status": "unlocked" if score < 70 else "completed_quiz"}},
        upsert=True
    )
    
    return {"score": score, "passed": score >= quiz.get("pass_mark", 70)}

@app.post("/api/project/submit")
async def submit_project(data: dict):
    user_id = data.get("user_id")
    module_id = data.get("module_id")
    github_link = data.get("github_link")
    
    if not github_link:
        raise HTTPException(status_code=400, detail="Missing GitHub link")
        
    # Simple check for now
    if "github.com" not in github_link:
         raise HTTPException(status_code=400, detail="Invalid GitHub repository link")

    await progress_col.update_one(
        {"user_id": user_id, "module_id": module_id},
        {"$set": {"project_status": "submitted", "github_link": github_link}},
        upsert=True
    )
    
    return {"status": "submitted"}

def extract_text_from_pdf(file_path):
    text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""
    except Exception as e:
        print(f"Error reading PDF: {e}")
    return text

def extract_text_from_docx(file_path):
    try:
        doc = docx.Document(file_path)
        return "\n".join([p.text for p in doc.paragraphs])
    except Exception as e:
        print(f"Error reading DOCX: {e}")
        return ""

def clean_json_string(json_str):
    # Remove markdown code blocks if present
    if "```json" in json_str:
        json_str = json_str.split("```json")[1].split("```")[0]
    elif "```" in json_str:
        json_str = json_str.split("```")[1].split("```")[0]
    return json_str.strip()

def parse_with_gemini(text):
    prompt = f"""
    You are an expert Resume Parser. Your job is to extract structured data from the provided resume text.
    
    Output Format: JSON only, no markdown formatting.
    Structure:
    {{
        "name": "Full Name",
        "email": "email@example.com",
        "summary": "A professional summary (max 300 chars)",
        "skills": ["Skill 1", "Skill 2", ...],
        "experience": [
            {{ "company": "Company Name", "role": "Job Title", "year": "YYYY-YYYY", "details": "Key achievement or responsibility" }}
        ],
        "projects": [
            {{ "name": "Project Name", "description": "Brief description", "technologies": "Tech Stack" }}
        ]
    }}
    
    Rules:
    - If experience/projects are missing, return empty lists [].
    - Normalize dates to "Year - Year" or "Year" format.
    - Limit summary to a concise professional statement.
    - Do NOT hallucinate data. If not found, leave blank.
    
    Resume Text:
    {text}
    """
    
    response = model.generate_content(prompt)
    json_str = clean_json_string(response.text)
    return json.loads(json_str)

@app.post("/generate-portfolio/")
async def generate_portfolio(
    template_id: str = Form("neon_glass"),
    name: Optional[str] = Form(None),
    role: Optional[str] = Form(None),
    email: Optional[str] = Form(None),
    skills: Optional[str] = Form(None),
    summary: Optional[str] = Form(None),
    experience: Optional[str] = Form(None), # JSON string
    projects: Optional[str] = Form(None),   # JSON string
    certifications: Optional[str] = Form(None), # JSON string
    resume: Optional[UploadFile] = File(None)
):
    extracted_text = ""
    
    # 1. Extract Text from Resume if provided
    if resume:
        suffix = os.path.splitext(resume.filename)[1].lower()
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(await resume.read())
            tmp_path = tmp.name
        
        if suffix == ".pdf":
            extracted_text = extract_text_from_pdf(tmp_path)
        elif suffix in [".docx", ".doc"]:
            extracted_text = extract_text_from_docx(tmp_path)
        
        os.remove(tmp_path)
    
    # 2. Prepare Data for Gemini (Legacy unused prompt building removed for brevity/clarity if we are skipping AI)
    # The prompt building block at lines 86-121 was unused since we switched to deterministic parsing at line 122.
    
    # 3. Parse Data
    data = {}
    
    if extracted_text:
        # Try Gemini AI First (User Request for 2.5 Flash behavior)
        try:
            print("Attempting Gemini Parsing...")
            data = parse_with_gemini(extracted_text)
            # Validate essential fields
            if not data.get("name") and not data.get("email"):
                 raise Exception("Gemini returned empty data")
            print("Gemini Parsing Success")
        except Exception as e:
            print(f"Gemini Error (Fallback to Regex): {e}")
            # Fallback to deterministic parser
            data = parse_resume_text(extracted_text)

    else:
        # Manual Entry
        
        # Parse complex lists if provided
        exp_list = []
        if experience:
            try:
                exp_list = json.loads(experience)
            except:
                pass
                
        proj_list = []
        if projects:
            try:
                proj_list = json.loads(projects)
            except:
                pass

        cert_list = []
        if certifications:
            try:
                cert_list = json.loads(certifications)
            except:
                pass

        data = {
            "name": name,
            "email": email,
            "summary": summary,
            "skills": [s.strip() for s in skills.split(',')] if skills else [],
            "experience": exp_list,
            "projects": proj_list,
            "certifications": cert_list
        }

    # Ensure defaults if parsing missed something
    if not data.get("name"): data["name"] = name or "Your Name"
    if not data.get("email"): data["email"] = email or "email@example.com"
    if not data.get("summary"): data["summary"] = summary or "Professional summary goes here."
    if not data.get("skills"): 
         if skills:
             data["skills"] = [s.strip() for s in skills.split(',')]
         else:
             data["skills"] = ["Skill 1", "Skill 2"]
    
    # 4. Load Template
    # Map template_id to filename
    template_map = {
        "neon_glass": "neon_glass.html",
        "swiss_minimal": "swiss_minimal.html",
        "creative_clean": "creative_clean.html",
        "tech_noir": "tech_noir.html",
        "minimal_bold": "minimal_bold.html"
    }
    
    filename = template_map.get(template_id, "neon_glass.html")
    template_path = os.path.join("templates", filename)
    
    try:
        with open(template_path, "r", encoding="utf-8") as f:
            template_content = f.read()
    except FileNotFoundError:
        return {"error": "Template not found"}

    # 5. Render Template
    # Using Jinja2 to render the HTML with the data
    tm = Template(template_content)
    rendered_html = tm.render(**data)
    
    # 6. Save to File
    import uuid
    import re
    
    # Sanitize name for filename
    sanitized_name = re.sub(r'[^a-zA-Z0-9]', '', data.get("name", "portfolio")).lower()
    short_id = str(uuid.uuid4())[:8]
    filename = f"{sanitized_name}-{short_id}.html"
    
    os.makedirs("generated_portfolios", exist_ok=True)
    output_path = os.path.join("generated_portfolios", filename)
    
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(rendered_html)
    
    # Return the URL
    return {"portfolio_url": f"http://localhost:8000/view/{filename}"}




class UpdatePortfolioRequest(BaseModel):
    filename: str
    html: str

@app.post("/update-portfolio")
async def update_portfolio(request: UpdatePortfolioRequest):
    # Security: Ensure filename is valid
    if ".." in request.filename or "/" in request.filename:
         return {"error": "Invalid filename"}
         
    file_path = os.path.join("generated_portfolios", request.filename)
    if not os.path.exists(file_path):
        return {"error": "Portfolio not found"}
        
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(request.html)
        
    return {"status": "success"}

@app.get("/view/{filename}")
async def view_portfolio(filename: str):
    # Security: Ensure filename is just a name and not a path traversal
    if ".." in filename or "/" in filename:
         return {"error": "Invalid filename"}
         
    file_path = os.path.join("generated_portfolios", filename)
    if os.path.exists(file_path):
        from fastapi.responses import HTMLResponse
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        return HTMLResponse(content=content)
    return {"error": "Portfolio not found"}

def parse_resume_text(text):
    """
    Improved heuristic parser to handle specific formats like:
    'Company, Role [Type] Date'
    """
    import re
    
    data = {
        "name": "",
        "email": "",
        "skills": [],
        "summary": "",
        "experience": [],
        "projects": []
    }
    
    # Normalize text
    lines = [line.strip() for line in text.replace('\r', '').split('\n') if line.strip()]
    if not lines:
        return data

    # 1. Email (Regex)
    email_regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    email_match = re.search(email_regex, text)
    if email_match:
        data["email"] = email_match.group(0)

    # 2. Name (Heuristic: First line that isn't empty, usually short and no numbers)
    # Exclude common headers
    exclude_headers = ["RESUME", "CV", "CURRICULUM VITAE", "PAGE", "CONTACT"]
    for line in lines[:5]:
        # User name is likely the first line if it doesn't contain contact info directly
        if len(line.split()) < 5 and not any(char.isdigit() for char in line) and line.upper() not in exclude_headers:
             data["name"] = line
             break
    
    # 3. Skills (Keyword Search - Expanded)
    common_skills = [
        "Python", "Java", "C++", "C", "JavaScript", "TypeScript", "React", "Next.js", "Angular", "Vue", "Node.js", 
        "Django", "FastAPI", "Flask", "Spring Boot", "HTML", "CSS", "Tailwind", "SQL", "PostgreSQL", "MongoDB", "MySQL",
        "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Git", "GitHub", "Linux", "Machine Learning", "Deep Learning", 
        "AI", "NLP", "OpenCV", "TensorFlow", "PyTorch", "Data Analysis", "Communication", "Leadership", "Teamwork",
        "Agile", "Scrum", "Jira"
    ]
    found_skills = set()
    for skill in common_skills:
        # Word boundary check
        if re.search(r'\b' + re.escape(skill) + r'\b', text, re.IGNORECASE):
            found_skills.add(skill)
    data["skills"] = list(found_skills)


    # 4. Parsing Blocks (Experience vs Projects)
    
    # Date Regex: Matches "May 2025 - August 2025", "2024", "Present"
    # Matches patterns at the END of a line typically
    date_pattern = r'((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{4})\s*[–-]\s*((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{4}|Present|Current)'
    
    sections = {"experience": [], "projects": []}
    
    # Identify Header Zones
    header_indices = []
    exp_headers = ["EXPERIENCE", "WORK HISTORY", "INTERNSHIPS", "EMPLOYMENT"]
    proj_headers = ["PROJECTS", "ACADEMIC PROJECTS", "SELECTED WORKS"]
    edu_headers = ["EDUCATION", "ACADEMIC BACKGROUND"]
    sum_headers = ["SUMMARY", "PROFILE", "ABOUT", "OBJECTIVE"]
    
    section_map = {} # line_index -> section_name
    
    current_mode = "summary" 
    
    for i, line in enumerate(lines):
        line_upper = line.upper()
        
        # Check headers
        if any(h == line_upper for h in sum_headers) or "SUMMARY" in line_upper:
            current_mode = "summary"
            continue
        if any(h in line_upper for h in exp_headers):
            current_mode = "experience"
            continue
        elif any(h in line_upper for h in proj_headers):
            current_mode = "projects"
            continue
        elif any(h in line_upper for h in edu_headers):
            current_mode = "education" 
            continue
        elif "SKILLS" in line_upper:
            current_mode = "skills"
            continue

        # Process lines based on mode
        if current_mode == "summary":
            # Avoid name/contact info lines
            if len(line) > 50 and "@" not in line and "Phone" not in line:
                 if not data["summary"]: data["summary"] = line
                 else: data["summary"] += " " + line
        
        elif current_mode == "experience":
            # Heuristic: Line with Date is usually a Title/Company line
            # "Viswam.AI, Swecha Foundation... May 2025 – August 2025"
            date_match = re.search(date_pattern, line, re.IGNORECASE)
            if date_match:
                # This line defines a job
                # Try to split by comma to separate Company and Role
                parts = line.split(',')
                company = parts[0].strip() if len(parts) > 0 else "Company"
                
                # Try to find Role (keywords?)
                role = "Intern/Developer" # Default
                for part in parts:
                    if any(k in part.lower() for k in ["intern", "engineer", "developer", "lead", "manager", "consultant"]):
                        role = part.strip()
                
                date_str = date_match.group(0)
                
                # If the line is VERY long, it might contain the description too, but usually description is next lines
                sections["experience"].append({
                    "company": company,
                    "role": role,
                    "year": date_str,
                    "details": ""
                })
            elif sections["experience"]:
                # Append description to last job if it's not a short metadata line
                if len(line.split()) > 3: 
                    sections["experience"][-1]["details"] += line + " "

        elif current_mode == "projects":
             # "Project Name ... Date" or just "Project Name"
             date_match = re.search(date_pattern, line, re.IGNORECASE)
             
             # If line looks like a title (bold, shortish, or has date)
             is_title = False
             if date_match or (len(line) < 60 and not line.endswith('.')):
                 is_title = True
             
             if is_title:
                  # New Project
                  name = line.split('–')[0].split('-')[0].strip() # remove date if at end
                  # specific cleanup for date regex match removal if needed
                  name = re.sub(date_pattern, '', name).strip()
                  
                  sections["projects"].append({
                      "name": name,
                      "description": "",
                      "technologies": "" # Hard to guess without NER
                  })
             elif sections["projects"]:
                  sections["projects"][-1]["description"] += line + " "

    # Review extracted data
    data["experience"] = sections["experience"]
    data["projects"] = sections["projects"]
    
    # Limit items for UI consistency
    data["experience"] = data["experience"][:4]
    data["projects"] = data["projects"][:4]
    
    # Clean Summary
    if not data["summary"] or len(data["summary"]) < 20: 
        # Fallback to finding a big block of text at start
        for line in lines[:10]:
            if len(line) > 100:
                data["summary"] = line
                break
    
    # Limit summary length
    if data["summary"]:
         data["summary"] = data["summary"][:300] + ("..." if len(data["summary"]) > 300 else "")

    return data

# --- RESUME BUILDER LOGIC ---
import subprocess
from jinja2 import Environment, FileSystemLoader

class ResumeData(BaseModel):
    name: str = "John Doe"
    email: str = "john@example.com"
    phone: Optional[str] = ""
    address: Optional[str] = ""
    linkedin: Optional[str] = ""
    github: Optional[str] = ""
    summary: Optional[str] = ""
    skills: list[str] = []
    experience: list[dict] = [] # {company, role, year, details, location}
    projects: list[dict] = []   # {name, technologies, description}
    education: list[dict] = []  # {college, degree, year, location}
    certifications: list[str] = []
    template_id: str = "chicago"

def latex_escape(text):
    if not isinstance(text, str):
        return text
    conv = {
        '&': r'\&',
        '%': r'\%',
        '$': r'\$',
        '#': r'\#',
        '_': r'\_',
        '{': r'\{',
        '}': r'\}',
        '~': r'\textasciitilde{}',
        '^': r'\textasciicircum{}',
        '\\': r'\textbackslash{}',
        '<': r'\textless{}',
        '>': r'\textgreater{}',
    }
    regex = re.compile('|'.join(re.escape(str(key)) for key in sorted(conv.keys(), key=lambda item: -len(item))))
    return regex.sub(lambda match: conv[match.group()], text)

# Configure Jinja2 for LaTeX (Change delimiters to avoid conflict with {})
latex_env = Environment(
    loader=FileSystemLoader("templates/resume"),
    block_start_string=r'\BLOCK{',
    block_end_string='}',
    variable_start_string=r'\VAR{',
    variable_end_string='}',
    comment_start_string=r'\#{',
    comment_end_string='}',
    line_statement_prefix='%%',
    line_comment_prefix='%#',
    trim_blocks=True,
    autoescape=False,
)
latex_env.filters['e'] = latex_escape
latex_env.filters['latex_escape'] = latex_escape

@app.post("/api/generate-summary/")
async def generate_summary(data: ResumeData):
    """
    Generate a professional summary using AI based on the provided resume data.
    """
    try:
        # Construct a detailed prompt for Gemini
        prompt = f"""
        You are a world-class Resume Writer. Write a 2-3 sentence professional summary for a candidate with the following details:
        Name: {data.name}
        Skills: {', '.join(data.skills)}
        
        Recent Experience:
        {json.dumps([{'role': e.get('role'), 'company': e.get('company')} for e in data.experience[:2]], indent=2)}
        
        Recent Projects:
        {json.dumps([p.get('name') for p in data.projects[:2]], indent=2)}
        
        The summary should be impactful, focus on key strengths, and use professional language. 
        Do not use placeholders. Write only the summary text.
        """
        
        response = model.generate_content(prompt)
        summary = response.text.strip()
        
        return {"summary": summary}
    except Exception as e:
        print(f"Summary Gen Error: {e}")
        return {"summary": "Experienced professional dedicated to delivering high-quality solutions."}

@app.post("/generate-resume/")
async def generate_resume(data: ResumeData):
    """
    Generates a PDF resume from LaTeX template.
    Returns URL to PDF or Source Code if compiler missing.
    """
    try:
        # --- AUTOMATIC AI SUMMARY ---
        current_data = data.dict()
        if not current_data.get("summary"):
            try:
                print("Generating AI Summary automatically...")
                # Repurpose the prompt logic here or call internal function
                prompt = f"""
                You are a world-class Resume Writer. Write a 2-3 sentence professional summary for a candidate with the following details:
                Name: {data.name}
                Skills: {', '.join(data.skills)}
                
                Recent Experience:
                {json.dumps([{'role': e.get('role'), 'company': e.get('company')} for e in data.experience[:2]], indent=2)}
                
                Recent Projects:
                {json.dumps([p.get('name') for p in data.projects[:2]], indent=2)}
                
                The summary should be impactful, focus on key strengths, and use professional language. 
                Do not use placeholders. Write only the summary text.
                """
                response = model.generate_content(prompt)
                current_data["summary"] = response.text.strip()
            except Exception as e:
                print(f"Auto Gen Summary Error: {e}")

        # 1. Map template_id to filename
        template_map = {
            "chicago": "chicago-latex-resume-template-free-download.tex",
        "easy": "easy-latex-resume-template-free-download.tex",
        "swiss": "Swiss-latex-resume-template.tex"
        }
        
        template_file = template_map.get(data.template_id, "chicago-latex-resume-template-free-download.tex")

        # 2. Render LaTeX
        template = latex_env.get_template(template_file)
        latex_code = template.render(current_data)
        
        # 2. Save .tex file
        sanitized_name = re.sub(r'[^a-zA-Z0-9]', '', data.name).lower()
        short_id = str(uuid.uuid4())[:8]
        filename_base = f"resume-{sanitized_name}-{short_id}"
        
        os.makedirs("generated_resumes", exist_ok=True)
        tex_path = os.path.join("generated_resumes", f"{filename_base}.tex")
        pdf_path = os.path.join("generated_resumes", f"{filename_base}.pdf")
        
        with open(tex_path, "w", encoding="utf-8") as f:
            f.write(latex_code)
            
        # 3. Compile to PDF (Try pdflatex)
        compiler_found = False
        try:
             # Check if pdflatex exists
             subprocess.run(["pdflatex", "--version"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
             compiler_found = True
        except FileNotFoundError:
             print("pdflatex not found.")
        
        if compiler_found:
            # compile in the directory to handle aux files
            cmd = ["pdflatex", "-interaction=nonstopmode", f"-output-directory=generated_resumes", tex_path]
            result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            
            if result.returncode == 0:
                return {
                    "status": "success", 
                    "pdf_url": f"http://localhost:8000/download-resume/{filename_base}.pdf",
                    "preview_image": None
                }
            else:
                print("Local compilation failed, trying cloud...")
        
        # Cloud Fallback Layer
        cloud_success = False
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
        
        # 1. Primary: latexonline.cc (POST) - Try with xelatex which might have more packages
        if not cloud_success:
            try:
                print(f"Cloud attempt 1 (latexonline.cc POST xelatex) for {filename_base}...")
                response = requests.post(
                    "https://latexonline.cc/compile", 
                    params={'engine': 'xelatex'},
                    files={'file': ('main.tex', latex_code)},
                    headers=headers,
                    timeout=60
                )
                if response.status_code == 200 and response.content.startswith(b'%PDF'):
                    with open(pdf_path, "wb") as f:
                        f.write(response.content)
                    cloud_success = True
                else:
                    print(f"Cloud 1 failed. Status: {response.status_code}, Preview: {response.content[:200]}")
            except Exception as e:
                print(f"Cloud 1 Error: {e}")

        # 2. Secondary: texlive.net (Robust Multipart)
        if not cloud_success:
            try:
                print(f"Cloud attempt 2 (texlive.net Multipart) for {filename_base}...")
                # texlive.net requires array syntax [] and 'document.tex' as main
                payload = {
                    'engine': 'pdflatex',
                    'return': 'pdf',
                    'filename[]': 'document.tex'
                }
                files = {
                    'filecontents[]': ('document.tex', latex_code, 'text/x-tex')
                }
                response = requests.post(
                    "https://texlive.net/cgi-bin/latexcgi",
                    data=payload,
                    files=files,
                    headers=headers,
                    timeout=60
                )
                if response.status_code == 200 and response.content.startswith(b'%PDF'):
                    with open(pdf_path, "wb") as f:
                        f.write(response.content)
                    cloud_success = True
                else:
                    print(f"Cloud 2 failed. Status: {response.status_code}, Preview: {response.content[:200]}")
            except Exception as e:
                print(f"Cloud 2 Error: {e}")

        # 3. Tertiary: latexonline.cc (GET fallback)
        if not cloud_success:
            try:
                print(f"Cloud attempt 3 (latexonline.cc GET) for {filename_base}...")
                response = requests.get(
                    "https://latexonline.cc/compile",
                    params={'text': latex_code, 'engine': 'pdflatex'},
                    headers=headers,
                    timeout=60
                )
                if response.status_code == 200 and response.content.startswith(b'%PDF'):
                    with open(pdf_path, "wb") as f:
                        f.write(response.content)
                    cloud_success = True
                else:
                    print(f"Cloud 3 failed. Status: {response.status_code}, Preview: {response.content[:200]}")
            except Exception as e:
                print(f"Cloud 3 Error: {e}")

        if cloud_success:
            return {
                "status": "success", 
                "pdf_url": f"http://localhost:8000/download-resume/{filename_base}.pdf",
            }

        # Final Fallback
        return {
            "status": "error", 
            "message": "PDF Generation Service Unavailable. Please simplify your content or ensure common LaTeX syntax is used.",
            "latex_source": latex_code,
            "tex_url": f"http://localhost:8000/download-resume/{filename_base}.tex"
        }

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/download-resume/{filename}")
async def download_resume(filename: str):
    file_path = os.path.join("generated_resumes", filename)
    if os.path.exists(file_path):
        from fastapi.responses import FileResponse
        return FileResponse(file_path)
    return {"error": "File not found"}

# ========== MARKETPLACE API ENDPOINTS ==========

@app.get("/api/courses")
async def get_all_courses_marketplace():
    """Get all courses with marketplace data (price, rating, etc)"""
    courses = []
    async for course in courses_col.find():
        courses.append(fix_id(course))
    return courses

@app.get("/api/cart/{user_id}")
async def get_user_cart(user_id: str):
    """Get all items in user's cart"""
    items = []
    async for item in cart_col.find({"user_id": user_id}):
        item = fix_id(item)
        items.append(item)
    
    total_price = sum(item.get("course_price", 0) for item in items)
    return {"items": items, "total_price": total_price, "count": len(items)}

@app.post("/api/cart/{user_id}/add")
async def add_to_cart(user_id: str, request: AddToCartRequest):
    """Add a course to cart (prevents duplicates)"""
    course_id = request.course_id
    if not course_id:
        raise HTTPException(status_code=400, detail="course_id is required")
    
    # Check if already in cart
    existing = await cart_col.find_one({"user_id": user_id, "course_id": course_id})
    if existing:
        return {"error": "Course already in cart", "status": "duplicate"}
    
    # Check if already enrolled
    enrolled = await enrollments_col.find_one({"user_id": user_id, "course_id": course_id})
    if enrolled:
        return {"error": "Already enrolled in this course", "status": "enrolled"}
    
    # Get course details
    course = await courses_col.find_one({"_id": course_id})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Add to cart
    cart_item = {
        "user_id": user_id,
        "course_id": course_id,
        "course_title": course.get("title", ""),
        "course_price": course.get("price", 0.0),
        "added_at": datetime.utcnow()
    }
    
    result = await cart_col.insert_one(cart_item)
    return {"status": "added", "cart_item_id": str(result.inserted_id)}

@app.delete("/api/cart/{user_id}/remove/{course_id}")
async def remove_from_cart(user_id: str, course_id: str):
    """Remove a course from cart"""
    result = await cart_col.delete_one({"user_id": user_id, "course_id": course_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return {"status": "removed"}

@app.delete("/api/cart/{user_id}/clear")
async def clear_cart(user_id: str):
    """Clear entire cart for user"""
    await cart_col.delete_many({"user_id": user_id})
    return {"status": "cart cleared"}

@app.post("/api/checkout/{user_id}")
async def checkout(user_id: str):
    """Checkout: move all cart items to enrollments"""
    # Get all cart items
    cart_items = []
    async for item in cart_col.find({"user_id": user_id}):
        cart_items.append(fix_id(item))
    
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")
    
    # Create enrollments for each cart item
    enrolled_courses = []
    for item in cart_items:
        enrollment = {
            "user_id": user_id,
            "course_id": item["course_id"],
            "course_title": item["course_title"],
            "enrolled_at": datetime.utcnow(),
            "progress": 0.0,
            "last_accessed": None,
            "last_accessed_module": None
        }
        result = await enrollments_col.insert_one(enrollment)
        enrolled_courses.append({
            "_id": str(result.inserted_id),
            **enrollment
        })
    
    # Clear cart
    await cart_col.delete_many({"user_id": user_id})
    
    # Initialize progress for first module of each course
    for item in cart_items:
        # Find first module of course
        first_module = await modules_col.find_one(
            {"course_id": item["course_id"]},
            sort=[("order_index", 1)]
        )
        
        if first_module:
            # Create progress record for first module
            await progress_col.update_one(
                {"user_id": user_id, "module_id": str(first_module["_id"])},
                {"$set": {
                    "course_id": item["course_id"],
                    "status": "unlocked",
                    "theory_completed": False,
                    "video_completed": False,
                    "quiz_score": 0.0,
                    "project_status": "not_started"
                }},
                upsert=True
            )
    
    # Format response with proper datetime conversion
    formatted_courses = []
    for course in enrolled_courses:
        formatted_courses.append({
            "_id": str(course["_id"]),
            "course_id": course["course_id"],
            "course_title": course["course_title"],
            "enrolled_at": course["enrolled_at"].isoformat() if isinstance(course["enrolled_at"], datetime) else str(course["enrolled_at"])
        })
    
    return {
        "status": "checkout_successful",
        "enrolled_courses": formatted_courses,
        "total_courses": len(formatted_courses),
        "enrolled_at": datetime.utcnow().isoformat()
    }

@app.get("/api/enrollments/{user_id}")
async def get_user_enrollments(user_id: str):
    """Get all enrolled courses for user"""
    enrollments = []
    async for enrollment in enrollments_col.find({"user_id": user_id}):
        enrollment = fix_id(enrollment)
        # Get full course details
        course = await courses_col.find_one({"_id": enrollment["course_id"]})
        if course:
            course = fix_id(course)
            enrollment["course_details"] = course
        enrollments.append(enrollment)
    
    return enrollments

@app.get("/api/user-courses/{user_id}")
async def get_user_courses_with_state(user_id: str):
    """
    Get courses grouped by state: enrolled, in_cart, available
    """
    all_courses = []
    async for course in courses_col.find():
        all_courses.append(fix_id(course))
    
    # Get user's cart items
    cart_items = []
    async for item in cart_col.find({"user_id": user_id}):
        cart_items.append(item["course_id"])
    
    # Get user's enrollments
    enrolled_items = []
    async for item in enrollments_col.find({"user_id": user_id}):
        enrolled_items.append(item["course_id"])
    
    # Categorize courses
    enrolled_courses = []
    in_cart_courses = []
    available_courses = []
    
    for course in all_courses:
        course_id = course.get("_id")
        
        if course_id in enrolled_items:
            # Add enrollment details
            enrollment = await enrollments_col.find_one({"user_id": user_id, "course_id": course_id})
            course["state"] = "ENROLLED"
            course["enrollment_details"] = fix_id(enrollment) if enrollment else None
            enrolled_courses.append(course)
        elif course_id in cart_items:
            course["state"] = "IN_CART"
            in_cart_courses.append(course)
        else:
            course["state"] = "NOT_PURCHASED"
            available_courses.append(course)
    
    return {
        "enrolled": enrolled_courses,
        "in_cart": in_cart_courses,
        "available": available_courses,
        "summary": {
            "total_enrolled": len(enrolled_courses),
            "total_in_cart": len(in_cart_courses),
            "total_available": len(available_courses)
        }
    }

@app.get("/api/course/{course_id}/details")
async def get_course_full_details(course_id: str, user_id: Optional[str] = None):
    """Get full course details with user enrollment state"""
    course = await courses_col.find_one({"_id": course_id})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    course = fix_id(course)
    
    # Add enrollment state if user_id provided
    if user_id:
        in_cart = await cart_col.find_one({"user_id": user_id, "course_id": course_id})
        is_enrolled = await enrollments_col.find_one({"user_id": user_id, "course_id": course_id})
        
        if is_enrolled:
            course["user_state"] = "ENROLLED"
        elif in_cart:
            course["user_state"] = "IN_CART"
        else:
            course["user_state"] = "NOT_PURCHASED"
    
    return course

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
