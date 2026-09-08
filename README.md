# AI Resume Matcher & Career Copilot

AI Resume Matcher is a web tool built to help job seekers compare their resumes directly against target job postings before submitting applications. It identifies missing technical keywords, calculates realistic ATS match scores, and provides concrete suggestions to tailor your resume for better visibility.

---

## What Problem Does This Solve?

Most company recruiting pipelines use Applicant Tracking Systems (ATS) and automated screening tools to parse resumes for specific technologies, skills, and quantified metrics. Even qualified candidates are frequently filtered out simply because their resume uses different phrasing or omits key terms mentioned in the job description.

This tool helps candidates:
- Check how well their resume aligns with a specific job description.
- Spot missing technical requirements, frameworks, databases, and tools.
- Get a realistic compatibility score that reflects true qualifications rather than basic word matching.
- Generate strong, quantified bullet points tailored to specific engineering roles.

---

## Key Capabilities

### 1. Resume vs. Job Description Matching
- Upload any standard PDF resume and paste a target job description.
- The system extracts the text, recognizes technical skills on both sides, and shows:
  - **Matched Skills**: Technical competencies present in both documents.
  - **Missing Skills**: Key requirements from the job description not found in your resume.
  - **Overall Match Score**: A calibrated compatibility score.

### 2. Google XYZ Resume Bullet Generator
- Helps rewrite vague resume statements into strong, quantified accomplishments using the Google XYZ structure:
  > *"Accomplished [X], as measured by [Y], by doing [Z]"*
- Tailors phrasing based on your target domain (Frontend, Backend, Data/AI, Cloud/DevOps).

### 3. Smart Role Presets & JD Assistant
- Includes ready-to-use job description templates for common roles (Software Engineering, Data Science, Cloud & DevOps, Product) across different seniority levels.
- Built-in prompt expander that turns short notes into realistic job descriptions for quick testing.

### 4. Multi-Category Scoring
Breaks your match down across four main areas:
- **Core Skills**: Coverage of essential tech stack requirements.
- **Domain Experience**: Seniority and technical depth alignment.
- **Keyword Density**: Natural inclusion and frequency of industry terms.
- **Impact & Metrics**: Presence of measurable achievements and scale.

### 5. Scan History & Export
- Keeps a record of previous scans so you can track how changes improve your score over time.
- Allows exporting complete diagnostic reports as Markdown files.

---

## How It Works

- **Frontend (React + Vite)**: Provides an interactive dashboard for uploading resumes, viewing gap analysis, and generating tailored bullet points.
- **Backend (Node.js + Express)**: Manages file processing, scan history with MongoDB, and relays requests to the ML service.
- **ML Service (Python + FastAPI)**: Extracts text from resumes with `pdfplumber` and evaluates skill overlap and vector similarity using `scikit-learn`.

---

## Running Locally

1. **ML Service**:
   ```bash
   cd ml_service
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   python3 -m uvicorn main:app --reload --port 8000
   ```

2. **Backend Server**:
   ```bash
   cd server
   npm install
   node index.js
   ```

3. **Frontend Client**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

---

## License

MIT
