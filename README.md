# StudLyf v2 - AI-Powered Career Development Platform

StudLyf is a futuristic, AI-driven platform designed to bridge the gap between learning and employment. It features a sophisticated mock interview system, technical assessment generation, and a portfolio/resume builder.

## 🚀 Key Features

### 1. 🎙️ 3-Round Mock Interview System
A comprehensive interview simulation powered by **Groq LLM (Llama 3.3 70B)** and the **Browser Web Speech API**.
- **Round 1: Technical Interview (Text)** - 3 deep-dive technical questions tailored to your role.
- **Round 2: Behavioural Interview (Text)** - 3 situational questions focusing on leadership and STAR methods.
- **Round 3: HR Voice Interview (Voice)** - A hands-free voice round where the AI speaks and listens, simulating a real HR call.
- **Automated Feedback**: Generates a detailed "Clinical Report" with Technical Readiness, Communication scores, and a learning roadmap.

### 2. 📝 AI Assessment Generation
Generates clinical-grade technical MCQ and task-based assessments based on specific company cultures (e.g., Google's DSA focus vs. Amazon's Leadership focus).

### 3. 📄 Smart Resume & Portfolio Builder
- **AI Summary**: Automatically generates impactful summaries.
- **LaTeX PDFs**: Compiles professional-grade PDFs using local or cloud-based LaTeX engines.
- **Glassmorphism Portfolios**: Generates futuristic, interactive web portfolios.

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion.
- **Backend**: FastAPI (Python), MongoDB (Motor).
- **AI**: Groq Cloud (Llama 3.3 70B).
- **Voice**: Web Speech API (Recognition + Synthesis).

### 4. 🏫 Institution Dashboard System
A comprehensive competition management platform for colleges and organizations.
- **Self-Managed Auth (Gmail-Only)**: Fully migrated from Firebase/GitHub to a self-managed, MongoDB-backed authentication system using JWT.
- **Secure Onboarding (OTP)**: Two-step institutional registration flow featuring a cryptographically secure OTP verification system (`secrets` generator) with professional email templates.
- **Strong Password Protocol**: Enforced backend validation (minimum 8 characters) with frontend strength visualization.
- **Backbone Infrastructure**: High-security backend with JWT, RBAC (Role-Based Access Control), and Audit Logging.
- **Smart Management**: Automation for team formation, deadline enforcement, and blind judging.
- **Real-time Analytics**: Live statistics, registration heatmaps, and demographic tracking.

### 5. 🏢 Institutional Command Center
A high-fidelity evaluation and selection pipeline for organizations to manage multi-stage competitions.
- **Dynamic Rubric Builder**: Admins can define custom scoring dimensions (e.g., Sustainability, Code Quality, UI/UX) and set specific point weightages per event.
- **"Blind" Judge Dashboard**: A dedicated evaluator portal that isolates judges, showing only their assigned teams with a dynamic, criteria-based scorecard.
- **Selection Command Center**: A real-time selection engine featuring a dynamic threshold slider to automate the filtering of teams into **Approved**, **Rejected**, and **Pending** bundles.
- **Bulk Personalized Notifications**: One-click selection engine that dispatches personalized email alerts, automatically injecting team names and specific results.
- **Leaderboard Pro**: An interactive results board with transparent score breakdowns, enabling students to see their performance across every evaluated dimension.
- **Institutional PDF Export**: Real-time generation of professional, institutional-grade result reports featuring ranked leaderboards and detailed scoring audit trails.
- **Automated Stage Promotion**: Logic-driven pipeline that moves qualified teams through N-number of rounds based on admin-defined passing criteria.

### 6. 🏆 Leaderboard & Certification System (Fully Dynamic)
- **Automated Aggregation Engine**: The leaderboard dynamically averages real-time judges' scores the moment an evaluation is finalized.
- **Master Export Engine**: Bulk export capabilities for PDF and CSV, supporting specific event IDs or a "Master Institutional Standings" across all events.
- **Live Rankings & Ticker**: A real-time finalist ticker and high-fidelity podium display that automatically updates without manual entry.
- **QR-Verified Smart Certificates**: Automated PDF generation with unique, cryptographically verifiable IDs triggered instantly upon event finalization.
- **Advanced Reporting Analytics**: Live registration timelines and departmental participation breakdowns with CSV/PDF export capabilities.
- **Multi-Member Team Support**: Certificates are individually generated for every member of a winning team, intelligently adapting between "Ranked" and "Participation" modes based on the event type (Hackathon vs. Workshop).

---
## ⚠️ Known Issues & Limitations (For GitHub)

### 1. Browser Speech API Dependencies
- **Browser Compatibility**: The "HR Voice Round" relies on the native `webkitSpeechRecognition`. It is best supported in **Google Chrome** and **Microsoft Edge**. Users on Firefox or Safari may experience limited voice recognition capabilities.
- **Microphone Permissions**: The browser must be granted persistent microphone access. In some environments, the "Auto-Listen" feature may be blocked by strict browser security policies unless the site is served over HTTPS.

### 2. Database Configuration
- **Local Connectivity**: The current backend is configured to look for MongoDB on `localhost:27017`. For production deployment, the `MONGO_URL` in `backend/db.py` needs to be updated to a cloud URI (like MongoDB Atlas).

### 3. PDF Generation (LaTeX)
- **Environment Dependency**: The Resume Builder requires `pdflatex` or `WeasyPrint` dependencies to be installed on the host system. While cloud fallbacks exist, they are subject to external uptime.

### 4. API Rate Limiting
- **Groq Usage**: The platform uses high-token-count models (`llama-3.3-70b-versatile`). Users without a high-tier Groq API key may hit "Rate Limit" errors during peak usage or rapid-fire chat interactions.

### 5. Deployment Constraints
- **CORS Headers**: The backend `main.py` contains some hardcoded origin URIs. These must be updated in `os.getenv("FRONTEND_URL")` before deploying to platforms like Vercel or Render.

---

## ⚙️ Setup Instructions

1. **Environment**: Create a `.env` file in the root with:
   ```env
   GROQ_API_KEY=your_key_here
   MONGO_URL=mongodb://localhost:27017/
   JWT_SECRET_KEY=your_hex_key
   JWT_ALGORITHM=HS256
   ```
2. **Backend**:
   ```bash
   cd backend
   pip install -r requirements.txt
   python main.py
   ```
3. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## 🏫 Institution Dashboard Setup

### 1. 🔐 Security & Env Setup
Add the following to your `.env` file for the self-managed auth system:
```env
SECRET_KEY=your_generated_hex_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
DB_NAME=studlyf_db
```

### 2. 🏗️ Database Initialization
Run the mandatory index setup script to enforce system constraints (unique emails, user IDs):
```bash
python backend/setup_indexes.py
```
