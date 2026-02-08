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

---

## ⚠️ Known Issues & Limitations (For GitHub)

### 1. Browser Speech API Dependencies
- **Browser Compatibility**: The "HR Voice Round" relies on the native `webkitSpeechRecognition`. It is best supported in **Google Chrome** and **Microsoft Edge**. Users on Firefox or Safari may experience limited voice recognition capabilities.
- **Microphone Permissions**: The browser must be granted persistent microphone access. In some environments, the "Auto-Listen" feature may be blocked by strict browser security policies unless the site is served over HTTPS.

### 2. Database Configuration
- **Local Connectivity**: The current backend is configured to look for MongoDB on `localhost:27017`. For production deployment, the `MONGO_URL` in `backend/db.py` needs to be updated to a cloud URI (like MongoDB Atlas).

### 3. PDF Generation (LaTeX)
- **Environment Dependency**: The Resume Builder requires `pdflatex` to be installed on the host system for local compilation. While cloud fallbacks exist (`latexonline.cc`), they are subject to external uptime and may fail for extremely complex templates.

### 4. API Rate Limiting
- **Groq Usage**: The platform uses high-token-count models (`llama-3.3-70b-versatile`). Users without a high-tier Groq API key may hit "Rate Limit" errors during peak usage or rapid-fire chat interactions.

### 5. Deployment Constraints
- **CORS Headers**: The backend `main.py` contains some hardcoded origin URIs. These must be updated in `os.getenv("FRONTEND_URL")` before deploying to platforms like Vercel or Render.

---

## ⚙️ Setup Instructions

1. **Environment**: Create a `.env` file in the root with:
   ```env
   GROQ_API_KEY=your_key_here
   MONGO_URL=mongodb://localhost:27017/ (Optional)
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
