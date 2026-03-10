"""
Seed script for Generative AI Specialist (ai-01) course.
Populates: modules, theories, quizzes, projects collections.
"""
import asyncio, os, certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))
MONGO_URL = os.getenv("MONGO_URL", "mongodb+srv://saieshwarerelli10:Nirvaha%25studly@nirvaha-studlfy.s1l8mvx.mongodb.net/?appName=Nirvaha-studlfy")
DB_NAME = os.getenv("DB_NAME", "studlyf_db")
client = AsyncIOMotorClient(MONGO_URL, tlsCAFile=certifi.where())
db = client[DB_NAME]

COURSE_ID = "ai-01"

# ── Module definitions ──────────────────────────────────────────────
MODULES = [
    {"_id": "ai-01-m01", "title": "Introduction to Artificial Intelligence & Generative AI", "order_index": 1, "estimated_time": "2 hours"},
    {"_id": "ai-01-m02", "title": "How Generative AI Works", "order_index": 2, "estimated_time": "2 hours"},
    {"_id": "ai-01-m03", "title": "Prompt Engineering Fundamentals", "order_index": 3, "estimated_time": "2 hours"},
    {"_id": "ai-01-m04", "title": "AI Text Generation Tools", "order_index": 4, "estimated_time": "1.5 hours"},
    {"_id": "ai-01-m05", "title": "AI Image Generation", "order_index": 5, "estimated_time": "1.5 hours"},
    {"_id": "ai-01-m06", "title": "AI for Productivity & Workflows", "order_index": 6, "estimated_time": "1.5 hours"},
    {"_id": "ai-01-m07", "title": "Working with AI APIs", "order_index": 7, "estimated_time": "2 hours"},
    {"_id": "ai-01-m08", "title": "Vector Databases & Retrieval-Augmented Generation (RAG)", "order_index": 8, "estimated_time": "2.5 hours"},
    {"_id": "ai-01-m09", "title": "AI Agents & Automation", "order_index": 9, "estimated_time": "2 hours"},
    {"_id": "ai-01-m10", "title": "Building AI Applications", "order_index": 10, "estimated_time": "2 hours"},
    {"_id": "ai-01-m11", "title": "Ethics, Risks & Limitations of AI", "order_index": 11, "estimated_time": "1.5 hours"},
    {"_id": "ai-01-m12", "title": "Future of Generative AI", "order_index": 12, "estimated_time": "1 hour"},
]

# ── Theory content (markdown) ───────────────────────────────────────
THEORIES = {
"ai-01-m01": {
    "reading_time": 15,
    "key_takeaways": ["Understand what AI is", "Learn AI types: ANI, AGI, ASI", "Understand Generative AI vs Traditional AI", "Learn how GenAI transforms industries"],
    "markdown_content": """# Module 1 — Introduction to Artificial Intelligence & Generative AI

## 1.1 — What is Artificial Intelligence?

**Artificial Intelligence (AI)** refers to computer systems designed to perform tasks that normally require human intelligence.

These tasks include:
- Understanding language
- Recognizing images
- Solving problems
- Making decisions
- Learning from data

Traditional computer programs follow fixed instructions. AI systems are different — they **learn patterns from data** and use those patterns to make predictions or decisions.

### Simple Way to Think About It

| Traditional Software | Artificial Intelligence |
|---|---|
| Input → Program Rules → Output | Input → Data + Learning Model → Output |

> AI learns patterns rather than following strict rules.

### Real World Example
Email spam filters (like Gmail) analyze millions of emails to learn patterns that indicate spam. The system becomes better at detecting unwanted emails without humans writing rules for every possible spam message.

📚 **Resources:** [Google AI Education](https://ai.google/education) · [IBM AI Overview](https://www.ibm.com/topics/artificial-intelligence)

---

## 1.2 — Types of Artificial Intelligence

### 1. Narrow AI (ANI) — Weak AI
Designed to perform **one specific task** extremely well.
- Voice assistants, recommendation systems, chatbots, image recognition
- Almost all AI systems today fall into this category.

### 2. Artificial General Intelligence (AGI)
AI that can perform **any intellectual task** that a human can do.
- Reason, learn new skills, adapt across fields
- **Does not exist yet** — still a research goal.

### 3. Artificial Super Intelligence (ASI)
A hypothetical stage where AI becomes **more intelligent than humans** in all aspects. Remains theoretical.

### Real World Example
Netflix uses **Narrow AI** to recommend movies based on watch history, preferences, and viewing behavior.

📚 **Resources:** [Britannica AI](https://www.britannica.com/technology/artificial-intelligence)

---

## 1.3 — What is Generative AI?

**Generative AI** creates **new content** instead of only analyzing or predicting data. It can produce:
- Text, Images, Music, Videos, Code, Designs

The process:
```
Training Data → AI Model → Generated Output
```

### Real World Example
When you ask ChatGPT *"Write a professional email requesting a meeting"*, the system generates a completely new email based on its training data.

Image models like **Midjourney** or **Stable Diffusion** generate images from text prompts.

### Common Generative AI Tools
| Tool | Type |
|---|---|
| ChatGPT | Text |
| Claude | Text/Reasoning |
| Gemini | Text/Multimodal |
| Midjourney | Images |
| Stable Diffusion | Images |
| Runway ML | Video |

📚 **Resources:** [OpenAI Docs](https://platform.openai.com/docs) · [HuggingFace](https://huggingface.co)

---

## 1.4 — How Generative AI is Transforming Industries

### Industries Being Transformed

| Industry | How AI Helps | Tools |
|---|---|---|
| **Software** | Code assistance, autocompletion | GitHub Copilot, ChatGPT |
| **Marketing** | Ad copy, blog posts, strategies | Jasper AI, ChatGPT |
| **Design** | Graphics, logos, visuals | Midjourney, Canva AI |
| **Education** | Personalized tutoring | AI tutors |

### Real World Example
**GitHub Copilot** suggests code in real time as developers type, improving coding speed and reducing repetitive work.

📚 **Resources:** [McKinsey AI Report](https://www.mckinsey.com/capabilities/quantumblack/our-insights)
"""
},

"ai-01-m02": {
    "reading_time": 18,
    "key_takeaways": ["Understand Machine Learning basics", "Learn Neural Networks", "Understand Transformer architecture", "Learn about Tokens and LLMs"],
    "markdown_content": """# Module 2 — How Generative AI Works

## 2.1 — Machine Learning Basics

**Machine Learning (ML)** is a branch of AI where computers learn patterns from data instead of being explicitly programmed.

```
Traditional: Rules + Data → Output
ML:          Data + Learning Algorithm → Model → Predictions
```

### Three Main Types
1. **Supervised Learning** — learns from labeled data (e.g., images labeled cat/dog)
2. **Unsupervised Learning** — finds patterns without labels (e.g., customer segmentation)
3. **Reinforcement Learning** — learns through trial and error with rewards

### Tools: TensorFlow, PyTorch, Scikit-learn

📚 [ML Crash Course](https://developers.google.com/machine-learning/crash-course)

---

## 2.2 — Neural Networks Explained Simply

Neural networks are ML models inspired by the human brain, consisting of layers of **neurons**.

- **Input Layer** — receives data (e.g., words in a sentence)
- **Hidden Layers** — process and detect patterns (deep learning = many layers)
- **Output Layer** — produces results (predicted word, classification)

> ChatGPT is built on very large neural networks with **billions of parameters**.

---

## 2.3 — Transformers Architecture

Modern GenAI uses **Transformers** (introduced in *"Attention Is All You Need"*, 2017).

The key innovation: **Attention Mechanism** — the model understands relationships between ALL words simultaneously.

Example: *"AI is transforming the world"*
- AI → subject, transforming → action, world → object

All major LLMs (ChatGPT, Claude, Gemini) are transformer-based.

📚 [Original Paper](https://arxiv.org/abs/1706.03762)

---

## 2.4 — Tokens and Embeddings

AI models convert text into smaller units called **tokens** (word, sub-word, or punctuation).

Example: `Artificial Intelligence is powerful` → `Artificial | Intelligence | is | powerful`

Each token becomes a **vector (embedding)** representing its meaning. Similar words cluster together:
> King - Man + Woman ≈ Queen

---

## 2.5 — Large Language Models (LLMs)

LLMs (GPT, Claude, Gemini) are trained on billions of sentences to understand and generate language.

**How they generate text:** predict the most probable next word repeatedly.

```
Prompt: "The capital of France is"
Model predicts: "Paris"
```
"""
},

"ai-01-m03": {
    "reading_time": 15,
    "key_takeaways": ["Understand prompt engineering", "Learn prompt structure (Role/Task/Context/Format)", "Master Zero-Shot, Few-Shot, and Chain-of-Thought prompting"],
    "markdown_content": """# Module 3 — Prompt Engineering Fundamentals

## 3.1 — What is Prompt Engineering?

The process of designing clear instructions for AI to produce better results.

| Poor Prompt | Better Prompt |
|---|---|
| Write about marketing | Explain digital marketing strategies for small businesses. Include 5 actionable techniques and examples. |

📚 [Prompt Engineering Guide](https://www.promptingguide.ai)

---

## 3.2 — Prompt Structure

A strong prompt includes **four key components**:

1. **Role** — *Act as a marketing expert*
2. **Task** — *Create a marketing plan*
3. **Context** — *For a small startup selling eco-friendly products*
4. **Output Format** — *Provide the response as a numbered list*

### Complete Example
```
Act as a business consultant.
Create a marketing strategy for a startup that sells sustainable clothing.
Include: target audience, marketing channels, campaign ideas.
Provide the answer as a step-by-step plan.
```

---

## 3.3 — Zero-Shot Prompting
Ask the AI to perform a task **without any examples**. Works best for simple, clear tasks.

```
Classify this review as positive or negative:
"The product quality exceeded my expectations."
```

---

## 3.4 — Few-Shot Prompting
Provide **a few examples** before asking the task.

```
Classify sentiment:
"I love this product" → Positive
"The service was terrible" → Negative
Now classify: "The delivery was very fast"
```

---

## 3.5 — Chain-of-Thought Prompting
Encourage AI to explain its reasoning **step-by-step**.

```
Solve step by step:
If a store sells 3 pens for $6, what is the price of 5 pens?
```
Best for complex reasoning, math, and logical analysis.
"""
},

"ai-01-m04": {
    "reading_time": 12,
    "key_takeaways": ["Use ChatGPT, Claude, and Gemini effectively", "Choose the right AI tool for different tasks", "Generate professional content using AI"],
    "markdown_content": """# Module 4 — AI Text Generation Tools

## 4.1 — Using ChatGPT for Productivity
General-purpose conversational AI for writing, summarizing, coding, brainstorming.

## 4.2 — Using Claude for Reasoning Tasks
Strong reasoning, handles large documents, great for research analysis.

## 4.3 — Using Gemini for Research
Integrates with Google ecosystem, ideal for information retrieval and factual research.

## 4.4 — AI Writing Assistants
Tools like **Jasper AI**, **Notion AI**, **Copy.ai** for marketing content and blog writing.

## 4.5 — Comparing Major AI Tools

| Tool | Best For |
|---|---|
| **ChatGPT** | General tasks, coding, writing, brainstorming |
| **Claude** | Long documents, reasoning, research analysis |
| **Gemini** | Information retrieval, Google integration |
| **Jasper/Copy.ai** | Marketing content, blog writing |
"""
},

"ai-01-m05": {
    "reading_time": 12,
    "key_takeaways": ["Understand AI image generation", "Learn Diffusion Models", "Write effective image prompts", "Use Midjourney and Stable Diffusion"],
    "markdown_content": """# Module 5 — AI Image Generation

## 5.1 — What is AI Image Generation?
`Text Prompt → AI Model → Generated Image`

Tools: **Midjourney**, **Stable Diffusion**, **DALL·E**

## 5.2 — Diffusion Models Explained
Generate images by gradually removing noise (denoising) from random patterns.

## 5.3 — Writing Effective Image Prompts
Include: **Subject** + **Style** + **Lighting** + **Composition**

```
A futuristic robot standing in a cyberpunk city,
neon lighting, cinematic style, high detail, 8k resolution
```

## 5.4 — Using Midjourney
`/imagine prompt: futuristic city skyline at sunset`

## 5.5 — Using Stable Diffusion
Open-source, can run locally, fully customizable.
"""
},

"ai-01-m06": {
    "reading_time": 12,
    "key_takeaways": ["Use AI for research", "Automate writing tasks", "Create AI presentations", "Design AI workflows"],
    "markdown_content": """# Module 6 — AI for Productivity & Workflows

## 6.1 — AI for Research — Summarize papers, extract insights
## 6.2 — AI for Writing — Emails, reports, meeting summaries
## 6.3 — AI for Presentations — Tools: Gamma, Beautiful.ai, Canva
## 6.4 — AI Workflow Automation — Trigger → AI Processing → Output (Zapier, Make)
## 6.5 — Designing AI Workflows — Input → Processing → Action
"""
},

"ai-01-m07": {
    "reading_time": 14,
    "key_takeaways": ["Understand APIs", "Use OpenAI and Google AI APIs", "Build simple AI applications"],
    "markdown_content": """# Module 7 — Working with AI APIs

## 7.1 — What is an API?
`Application → API Request → Server → API Response → Application`

## 7.2 — AI APIs Explained
Send prompts to AI models, receive generated responses.

## 7.3 — Using OpenAI API
Create account → Generate API key → Send prompt → Receive response

## 7.4 — Using Google AI Studio
Test prompts, integrate models, build AI features.

## 7.5 — Building Simple AI Applications
`User → App Interface → AI API → AI Model → Response → User`
"""
},

"ai-01-m08": {
    "reading_time": 18,
    "key_takeaways": ["Understand embeddings and vector databases", "Learn RAG architecture", "Build simple RAG systems"],
    "markdown_content": """# Module 8 — Vector Databases & RAG

## 8.1 — Why AI Models Need External Knowledge
Knowledge cutoff, no access to private data, hallucinations.

## 8.2 — Embeddings Explained
Words → numerical vectors. Similar meanings cluster together.

## 8.3 — Vector Databases
Store embeddings for semantic search. Tools: **Pinecone**, **Weaviate**, **Chroma**

## 8.4 — Retrieval-Augmented Generation (RAG)
```
Question → Embedding → Vector DB Search → Retrieved Docs → LLM → Answer
```
Reduces hallucinations, increases accuracy, enables private data access.

## 8.5 — Building a Simple RAG System
Document Collection → Embedding Generation → Vector DB → AI Response
"""
},

"ai-01-m09": {
    "reading_time": 14,
    "key_takeaways": ["Understand AI agents", "Learn agent workflows", "Understand multi-agent systems", "Know frameworks: LangChain, CrewAI"],
    "markdown_content": """# Module 9 — AI Agents & Automation

## 9.1 — What Are AI Agents?
Perception → Reasoning → Action (autonomous loop)

## 9.2 — The AI Agent Workflow
Goal → Planning → Execution → Evaluation

## 9.3 — Multi-Agent Systems
Research Agent + Analysis Agent + Writing Agent + Coordinator

## 9.4 — AI Agents for Task Automation
Research, customer service, marketing, scheduling

## 9.5 — Frameworks: **LangChain**, **CrewAI**, **AutoGPT**
"""
},

"ai-01-m10": {
    "reading_time": 14,
    "key_takeaways": ["Understand AI app architecture", "Build chatbots and content generators", "Deploy AI applications"],
    "markdown_content": """# Module 10 — Building AI Applications

## 10.1 — AI Application Architecture
UI → Application Logic → AI Model → Data Storage

## 10.2 — Building AI Chatbots
User message → AI API → Generated response → User

## 10.3 — Building AI Content Generators
User Prompt → AI Model → Generated Content

## 10.4 — AI Research Assistants
Combine LLMs + vector databases + document retrieval

## 10.5 — Deploying AI Applications
Build → Connect API → Host on cloud → Make accessible
"""
},

"ai-01-m11": {
    "reading_time": 12,
    "key_takeaways": ["Understand AI bias", "Recognize hallucinations", "Know privacy/security risks", "Practice responsible AI"],
    "markdown_content": """# Module 11 — Ethics, Risks & Limitations of AI

## 11.1 — Bias in AI Systems — Dataset, algorithmic, and human bias
## 11.2 — AI Hallucinations — Confident but incorrect outputs
## 11.3 — Privacy & Data Security — Anonymize, encrypt, comply
## 11.4 — Security Risks — Adversarial attacks, prompt injection, data poisoning
## 11.5 — Responsible AI Development — Fairness, Transparency, Accountability, Safety
"""
},

"ai-01-m12": {
    "reading_time": 10,
    "key_takeaways": ["Understand multimodal AI", "Know AI video generation trends", "Explore AI career paths"],
    "markdown_content": """# Module 12 — Future of Generative AI

## 12.1 — Emerging Trends
- **Multimodal AI** — process text, images, audio, video simultaneously
- **AI Video Generation** — create videos from text prompts

## 12.2 — Human-AI Collaboration & Future Careers
| Career | Focus |
|---|---|
| AI Engineer | Build AI systems |
| Prompt Engineer | Design prompts/workflows |
| AI Product Manager | Lead AI products |
| Data Scientist | Analyze training data |
| AI Researcher | Develop new algorithms |
"""
},
}

# ── Quizzes ──────────────────────────────────────────────────────────
QUIZZES = {
"ai-01-m01": {"pass_mark": 70, "questions": [
    {"question": "What is the primary goal of Artificial Intelligence?", "options": ["Replace human workers completely", "Perform tasks that normally require human intelligence", "Store large amounts of data", "Create computer hardware"], "correct_answers": [1], "explanation": "AI aims to perform tasks requiring human intelligence."},
    {"question": "Which type of AI exists today?", "options": ["Artificial Super Intelligence", "Artificial General Intelligence", "Narrow AI", "Hybrid AI"], "correct_answers": [2], "explanation": "Narrow AI (ANI) is the only type that currently exists."},
    {"question": "What is the main characteristic of Generative AI?", "options": ["It only analyzes historical data", "It generates new content such as text or images", "It only performs mathematical calculations", "It works without training data"], "correct_answers": [1], "explanation": "Generative AI creates new content."},
    {"question": "Which of the following is an example of Generative AI?", "options": ["Calculator", "ChatGPT", "Spreadsheet software", "Printer"], "correct_answers": [1], "explanation": "ChatGPT generates text content using AI."},
]},
"ai-01-m02": {"pass_mark": 70, "questions": [
    {"question": "What is the primary purpose of machine learning?", "options": ["Execute predefined rules", "Learn patterns from data", "Store information", "Build computer hardware"], "correct_answers": [1], "explanation": "ML learns patterns from data automatically."},
    {"question": "What architecture powers modern large language models?", "options": ["Decision Trees", "Transformers", "Linear Regression", "Random Forest"], "correct_answers": [1], "explanation": "Transformers with attention mechanism power modern LLMs."},
    {"question": "What are tokens in language models?", "options": ["Entire documents", "Small pieces of text used by AI models", "Images", "Programming commands"], "correct_answers": [1], "explanation": "Tokens are the smallest units AI processes."},
    {"question": "Large Language Models generate text by:", "options": ["Copying training data", "Predicting the next most likely token", "Using predefined templates", "Searching the internet"], "correct_answers": [1], "explanation": "LLMs predict the next token sequentially."},
]},
"ai-01-m03": {"pass_mark": 70, "questions": [
    {"question": "What is the purpose of prompt engineering?", "options": ["Train AI models", "Design instructions to guide AI outputs", "Build neural networks", "Create datasets"], "correct_answers": [1], "explanation": "Prompt engineering designs instructions for better AI outputs."},
    {"question": "Which component defines the perspective the AI should take?", "options": ["Context", "Role", "Output format", "Task"], "correct_answers": [1], "explanation": "Role defines the AI's perspective."},
    {"question": "What is Zero-Shot prompting?", "options": ["Giving multiple examples before asking a task", "Asking a task without providing examples", "Training the model with new data", "Breaking down reasoning steps"], "correct_answers": [1], "explanation": "Zero-shot means no examples provided."},
    {"question": "What is the main purpose of Chain-of-Thought prompting?", "options": ["Increase dataset size", "Force AI to answer quickly", "Encourage step-by-step reasoning", "Train a new model"], "correct_answers": [2], "explanation": "CoT encourages step-by-step reasoning."},
]},
"ai-01-m04": {"pass_mark": 70, "questions": [
    {"question": "Which AI tool is widely used for conversational interaction?", "options": ["Excel", "ChatGPT", "Photoshop", "WordPress"], "correct_answers": [1], "explanation": "ChatGPT is the most popular conversational AI."},
    {"question": "Which AI assistant is known for strong reasoning and document analysis?", "options": ["Claude", "Gemini", "Notion", "Canva"], "correct_answers": [0], "explanation": "Claude excels at reasoning and long documents."},
    {"question": "What is a common use case of AI writing assistants?", "options": ["Hardware design", "Generating marketing content", "Network security", "Database management"], "correct_answers": [1], "explanation": "AI writing tools generate marketing content."},
    {"question": "Which AI tool is integrated with Google's ecosystem?", "options": ["ChatGPT", "Claude", "Gemini", "Jasper"], "correct_answers": [2], "explanation": "Gemini is Google's AI assistant."},
]},
"ai-01-m05": {"pass_mark": 70, "questions": [
    {"question": "What is the main function of AI image generation?", "options": ["Analyze images", "Create images from text prompts", "Edit videos", "Build databases"], "correct_answers": [1], "explanation": "AI image generation creates images from text."},
    {"question": "Which technology powers most modern AI image generation?", "options": ["Decision Trees", "Diffusion Models", "Linear Regression", "Rule-Based Systems"], "correct_answers": [1], "explanation": "Diffusion models gradually denoise images."},
    {"question": "What is an important component of an image prompt?", "options": ["Lighting description", "Hardware configuration", "Database query", "Network protocol"], "correct_answers": [0], "explanation": "Lighting is key for image prompt quality."},
    {"question": "Which tool is an open-source image generation model?", "options": ["Midjourney", "Stable Diffusion", "Photoshop", "Illustrator"], "correct_answers": [1], "explanation": "Stable Diffusion is open-source."},
]},
"ai-01-m06": {"pass_mark": 70, "questions": [
    {"question": "What is one major benefit of using AI for research?", "options": ["It replaces all research methods", "It summarizes large amounts of info quickly", "It removes the need for reading", "It stores data permanently"], "correct_answers": [1], "explanation": "AI quickly summarizes large information volumes."},
    {"question": "AI writing assistants are commonly used for:", "options": ["Hardware design", "Writing emails and reports", "Network security", "Database management"], "correct_answers": [1], "explanation": "AI assists with emails, reports, and content."},
    {"question": "What is the first step in most automated workflows?", "options": ["Output generation", "Trigger or input event", "Data deletion", "Hardware setup"], "correct_answers": [1], "explanation": "Workflows start with a trigger."},
    {"question": "Which platforms are commonly used for automation?", "options": ["Zapier and Make", "Photoshop and Illustrator", "Excel and Word", "Chrome and Firefox"], "correct_answers": [0], "explanation": "Zapier and Make are automation platforms."},
]},
"ai-01-m07": {"pass_mark": 70, "questions": [
    {"question": "What does API stand for?", "options": ["Automated Program Interface", "Application Programming Interface", "Artificial Processing Integration", "Advanced Program Integration"], "correct_answers": [1], "explanation": "API = Application Programming Interface."},
    {"question": "What is the main purpose of an API?", "options": ["Store data permanently", "Allow software systems to communicate", "Replace programming languages", "Build hardware systems"], "correct_answers": [1], "explanation": "APIs enable software communication."},
    {"question": "What happens when an app sends a request to an AI API?", "options": ["The AI model generates a response", "The system shuts down", "The API deletes the request", "The application restarts"], "correct_answers": [0], "explanation": "The AI model processes and responds."},
    {"question": "Which platform allows devs to experiment with AI models?", "options": ["Photoshop", "Google AI Studio", "Excel", "WordPress"], "correct_answers": [1], "explanation": "Google AI Studio is for AI experimentation."},
]},
"ai-01-m08": {"pass_mark": 70, "questions": [
    {"question": "Why do AI systems use external knowledge retrieval?", "options": ["To reduce model size", "To access info not in training data", "To improve graphics", "To store images"], "correct_answers": [1], "explanation": "RAG accesses external knowledge."},
    {"question": "What are embeddings?", "options": ["Images stored in databases", "Numerical representations of data", "Programming commands", "Hardware components"], "correct_answers": [1], "explanation": "Embeddings are numerical vectors of meaning."},
    {"question": "What type of database stores embeddings?", "options": ["Relational database", "Vector database", "Spreadsheet", "File system"], "correct_answers": [1], "explanation": "Vector databases store embeddings."},
    {"question": "What does RAG stand for?", "options": ["Retrieval-Augmented Generation", "Random AI Generation", "Rapid Algorithm Growth", "Recursive AI Graph"], "correct_answers": [0], "explanation": "RAG = Retrieval-Augmented Generation."},
]},
"ai-01-m09": {"pass_mark": 70, "questions": [
    {"question": "What distinguishes an AI agent from a basic chatbot?", "options": ["It only generates text", "It can plan and execute tasks autonomously", "It stores data permanently", "It replaces databases"], "correct_answers": [1], "explanation": "Agents plan and execute autonomously."},
    {"question": "Which step comes first in the AI agent workflow?", "options": ["Execution", "Evaluation", "Goal definition", "Tool integration"], "correct_answers": [2], "explanation": "Goal definition comes first."},
    {"question": "What is a multi-agent system?", "options": ["A database with multiple tables", "Multiple AI agents collaborating to complete tasks", "A system with multiple users", "A computer network"], "correct_answers": [1], "explanation": "Multiple specialized agents working together."},
    {"question": "Which framework is commonly used for building AI agents?", "options": ["Photoshop", "LangChain", "Excel", "Chrome"], "correct_answers": [1], "explanation": "LangChain is a popular agent framework."},
]},
"ai-01-m10": {"pass_mark": 70, "questions": [
    {"question": "What is the purpose of the UI in an AI application?", "options": ["Train the AI model", "Allow users to interact with the system", "Store data permanently", "Generate training datasets"], "correct_answers": [1], "explanation": "UI enables user interaction."},
    {"question": "Which component processes user prompts?", "options": ["Printer", "AI model", "Monitor", "Network cable"], "correct_answers": [1], "explanation": "The AI model processes prompts."},
    {"question": "What is a common use case for AI chatbots?", "options": ["Hardware design", "Customer support", "Database management", "Network monitoring"], "correct_answers": [1], "explanation": "Customer support is the top chatbot use case."},
    {"question": "What is the final step after building an AI app?", "options": ["Deleting the code", "Deployment", "Hardware assembly", "Database formatting"], "correct_answers": [1], "explanation": "Deployment makes the app accessible."},
]},
"ai-01-m11": {"pass_mark": 70, "questions": [
    {"question": "What causes bias in AI systems?", "options": ["Perfect datasets", "Imbalanced or biased training data", "Hardware limitations", "Network errors"], "correct_answers": [1], "explanation": "Biased training data causes AI bias."},
    {"question": "What is an AI hallucination?", "options": ["AI system shutting down", "AI generating incorrect but confident answers", "AI storing too much data", "AI running slowly"], "correct_answers": [1], "explanation": "Hallucinations are confident but wrong outputs."},
    {"question": "Why is data privacy important in AI systems?", "options": ["To increase computing power", "To protect sensitive information", "To reduce algorithm complexity", "To improve graphics"], "correct_answers": [1], "explanation": "Privacy protects sensitive information."},
    {"question": "Which principle is part of responsible AI development?", "options": ["Secrecy", "Fairness", "Randomness", "Automation"], "correct_answers": [1], "explanation": "Fairness is a core responsible AI principle."},
]},
"ai-01-m12": {"pass_mark": 70, "questions": [
    {"question": "What is multimodal AI?", "options": ["AI that processes only text", "AI that processes multiple types of data", "AI that only generates images", "AI that runs offline"], "correct_answers": [1], "explanation": "Multimodal AI handles text, images, audio, video."},
    {"question": "What type of content can AI video generation models create?", "options": ["Text documents", "Video sequences", "Spreadsheets", "Databases"], "correct_answers": [1], "explanation": "AI video models create video sequences."},
    {"question": "Which concept describes humans working together with AI?", "options": ["Autonomous AI control", "Human-AI collaboration", "AI domination", "Data automation"], "correct_answers": [1], "explanation": "Human-AI collaboration is the future model."},
    {"question": "Which career focuses on designing prompts for AI?", "options": ["Network Engineer", "Prompt Engineer", "Database Administrator", "Hardware Engineer"], "correct_answers": [1], "explanation": "Prompt Engineers design AI prompts and workflows."},
]},
}

# ── Final Mega Quiz ──────────────────────────────────────────────────
FINAL_QUIZ = {"pass_mark": 70, "questions": [
    {"question": "What is the primary capability of Generative AI?", "options": ["Storing large datasets", "Generating new content such as text or images", "Replacing all computer programs", "Only analyzing images"], "correct_answers": [1], "explanation": "GenAI generates new content."},
    {"question": "Which architecture powers most modern LLMs?", "options": ["Decision Trees", "Transformers", "Linear Regression", "Random Forest"], "correct_answers": [1], "explanation": "Transformers power modern LLMs."},
    {"question": "What is the purpose of prompt engineering?", "options": ["Training AI models", "Designing instructions to guide AI outputs", "Building neural networks", "Writing programming languages"], "correct_answers": [1], "explanation": "Prompt engineering guides AI behavior."},
    {"question": "Which technique provides examples within the prompt?", "options": ["Zero-shot prompting", "Few-shot prompting", "Random prompting", "Token prompting"], "correct_answers": [1], "explanation": "Few-shot provides examples in the prompt."},
    {"question": "What technology powers most AI image generation?", "options": ["Decision Trees", "Diffusion Models", "Clustering Algorithms", "Linear Regression"], "correct_answers": [1], "explanation": "Diffusion models power image generation."},
    {"question": "What is the purpose of an API in AI applications?", "options": ["To train datasets", "To allow software systems to communicate with AI models", "To replace programming languages", "To create images"], "correct_answers": [1], "explanation": "APIs connect applications to AI models."},
    {"question": "What type of database stores embeddings for semantic search?", "options": ["Relational Database", "Vector Database", "Spreadsheet Database", "File Storage Database"], "correct_answers": [1], "explanation": "Vector databases store embeddings."},
    {"question": "What does RAG stand for?", "options": ["Retrieval-Augmented Generation", "Recursive Algorithm Generator", "Random AI Graph", "Rapid Application Generator"], "correct_answers": [0], "explanation": "RAG = Retrieval-Augmented Generation."},
    {"question": "What distinguishes an AI agent from a basic chatbot?", "options": ["It only generates images", "It can plan and execute tasks autonomously", "It stores user data permanently", "It only answers questions"], "correct_answers": [1], "explanation": "Agents plan and execute autonomously."},
    {"question": "What is one major risk associated with Generative AI?", "options": ["AI systems never make mistakes", "AI hallucinations (generating incorrect info)", "AI cannot process text", "AI cannot generate content"], "correct_answers": [1], "explanation": "Hallucinations are a major GenAI risk."},
]}

# ── Final Projects ───────────────────────────────────────────────────
PROJECTS = [
    {"_id": "ai-01-proj-1", "module_id": "FINAL_PROJECT", "problem_statement": "AI Meeting Intelligence System — Build an AI system that turns meetings into structured decisions, action items, responsible team members, and follow-up timelines.", "requirements": ["Upload meeting transcript", "AI summarizes discussion", "Extracts tasks and owners", "Generates follow-up checklist"], "rubric": {"completeness": 30, "functionality": 30, "creativity": 20, "presentation": 20}},
    {"_id": "ai-01-proj-2", "module_id": "FINAL_PROJECT", "problem_statement": "AI Customer Insight Engine — Build an AI system that analyzes customer conversations and extracts product insights using embeddings, vector DBs, and RAG.", "requirements": ["User uploads feedback dataset", "AI outputs top problems", "Emerging patterns analysis", "Product roadmap suggestions"], "rubric": {"completeness": 30, "functionality": 30, "creativity": 20, "presentation": 20}},
    {"_id": "ai-01-proj-3", "module_id": "FINAL_PROJECT", "problem_statement": "AI Micro-Startup Generator — Build a tool that helps founders discover small profitable startup ideas by analyzing industry pain points and generating MVP ideas.", "requirements": ["User inputs industry/skillset/market", "AI generates niche startup ideas", "Competitor overview", "MVP feature set"], "rubric": {"completeness": 30, "functionality": 30, "creativity": 20, "presentation": 20}},
]

# ── Main seed function ───────────────────────────────────────────────
async def seed():
    print("=== Seeding ai-01 Generative AI Specialist Course ===\n")

    # 1. Clean existing data for this course
    await db["modules"].delete_many({"course_id": COURSE_ID})
    await db["theories"].delete_many({"module_id": {"$regex": "^ai-01-m"}})
    await db["quizzes"].delete_many({"module_id": {"$regex": "^ai-01-m"}})
    await db["quizzes"].delete_many({"course_id": COURSE_ID, "module_id": "FINAL_ASSESSMENT"})
    await db["projects"].delete_many({"_id": {"$regex": "^ai-01-proj"}})
    print("✓ Cleaned existing data")

    # 2. Insert modules
    for mod in MODULES:
        mod["course_id"] = COURSE_ID
        await db["modules"].insert_one(mod)
    print(f"✓ Inserted {len(MODULES)} modules")

    # 3. Insert theories
    for mod_id, theory in THEORIES.items():
        theory_doc = {
            "_id": f"{mod_id}-theory",
            "module_id": mod_id,
            "markdown_content": theory["markdown_content"],
            "reading_time": theory["reading_time"],
            "key_takeaways": theory["key_takeaways"],
        }
        await db["theories"].insert_one(theory_doc)
    print(f"✓ Inserted {len(THEORIES)} theories")

    # 4. Insert module quizzes
    for mod_id, quiz in QUIZZES.items():
        quiz_doc = {
            "_id": f"{mod_id}-quiz",
            "module_id": mod_id,
            "pass_mark": quiz["pass_mark"],
            "questions": quiz["questions"],
        }
        await db["quizzes"].insert_one(quiz_doc)
    print(f"✓ Inserted {len(QUIZZES)} module quizzes")

    # 5. Insert final mega quiz
    final_quiz_doc = {
        "course_id": COURSE_ID,
        "module_id": "FINAL_ASSESSMENT",
        "title": "Final Mega Quiz — Generative AI",
        "difficulty": "Advanced",
        "pass_mark": FINAL_QUIZ["pass_mark"],
        "questions": FINAL_QUIZ["questions"],
    }
    await db["quizzes"].insert_one(final_quiz_doc)
    print("✓ Inserted final mega quiz")

    # 6. Insert projects
    for proj in PROJECTS:
        await db["projects"].insert_one(proj)
    print(f"✓ Inserted {len(PROJECTS)} final projects")

    # 7. Update course document
    await db["courses"].update_one(
        {"_id": COURSE_ID},
        {"$set": {
            "modules_count": len(MODULES),
            "school": "AI & Data",
            "skills": ["LLMs", "GPT", "Transformers"],
            "duration": "10 Weeks",
        }}
    )
    print("✓ Updated course document")

    # 8. Insert dummy videos for each module
    for mod in MODULES:
        video_doc = {
            "_id": f"{mod['_id']}-video",
            "module_id": mod["_id"],
            "video_url": "https://www.youtube.com/watch?v=aircAruvnKk",
            "duration": "15 min",
            "is_dummy": True,
        }
        await db["videos"].update_one(
            {"_id": video_doc["_id"]},
            {"$setOnInsert": video_doc},
            upsert=True
        )
    print(f"✓ Inserted {len(MODULES)} dummy videos")

    print("\n=== DONE! All content seeded for ai-01 ===")

if __name__ == "__main__":
    asyncio.run(seed())
