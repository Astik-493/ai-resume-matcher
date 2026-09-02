import io
import re
from typing import List, Dict, Any, Set
import pdfplumber
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

CANONICAL_SKILLS_TAXONOMY = [
    # Languages
    'python', 'javascript', 'typescript', 'java', 'c++', 'c#', 'golang', 'go', 'rust',
    'ruby', 'php', 'swift', 'kotlin', 'sql', 'r', 'html5', 'css3', 'bash', 'shell', 'scala',

    # Data Science & AI
    'pandas', 'numpy', 'scikit-learn', 'pytorch', 'tensorflow', 'keras', 'xgboost',
    'lightgbm', 'hugging face', 'langchain', 'llamaindex', 'openai', 'nlp', 'deep learning',
    'machine learning', 'computer vision', 'vector search', 'rag pipelines', 'pinecone',
    'chroma', 'milvus', 'statistics', 'statistical modeling', 'exploratory data analysis',
    'hypothesis testing', 'predictive modeling', 'data visualization', 'a/b testing',
    'feature engineering', 'model evaluation', 'time series', 'data warehousing',
    'etl pipelines', 'tableau', 'power bi', 'looker', 'excel', 'spark', 'pyspark',

    # Frontend
    'react', 'react.js', 'next.js', 'vue', 'vue.js', 'angular', 'redux', 'zustand',
    'tailwind css', 'tailwind', 'bootstrap', 'sass', 'webpack', 'vite', 'jest',
    'cypress', 'playwright', 'ui/ux', 'figma', 'storybook', 'design systems',
    'web performance', 'responsive design', 'accessibility', 'wcag',

    # Backend & APIs
    'node.js', 'express', 'express.js', 'fastapi', 'django', 'flask', 'spring boot',
    'nestjs', 'graphql', 'graphql apis', 'rest apis', 'restful apis', 'grpc',
    'microservices', 'oauth', 'oauth2', 'jwt', 'websockets', 'kafka', 'rabbitmq',
    'celery', 'database indexing', 'performance tuning',

    # Databases
    'postgresql', 'mongodb', 'mysql', 'redis', 'elasticsearch', 'cassandra',
    'dynamodb', 'supabase', 'firebase', 'bigquery', 'snowflake', 'redshift', 'sqlite',

    # Cloud & DevOps
    'aws', 'amazon web services', 'gcp', 'google cloud', 'azure', 'docker',
    'kubernetes', 'terraform', 'ci/cd', 'ci/cd pipelines', 'github actions',
    'gitlab ci', 'jenkins', 'linux', 'prometheus', 'grafana', 'helm', 'ansible',
    'cloud infrastructure', 'serverless', 'nginx',

    # Methodologies
    'agile/scrum', 'agile', 'scrum', 'jira', 'unit testing', 'integration testing',
    'tdd', 'automated testing', 'system architecture', 'distributed systems', 'git'
]

SKILL_DISPLAY_NAMES = {
    'python': 'Python',
    'javascript': 'JavaScript',
    'typescript': 'TypeScript',
    'java': 'Java',
    'c++': 'C++',
    'c#': 'C#',
    'golang': 'Go',
    'go': 'Go',
    'rust': 'Rust',
    'ruby': 'Ruby',
    'php': 'PHP',
    'swift': 'Swift',
    'kotlin': 'Kotlin',
    'sql': 'SQL',
    'r': 'R',
    'html5': 'HTML5',
    'css3': 'CSS3',
    'bash': 'Bash',
    'shell': 'Shell',
    'scala': 'Scala',
    'pandas': 'Pandas',
    'numpy': 'NumPy',
    'scikit-learn': 'Scikit-learn',
    'pytorch': 'PyTorch',
    'tensorflow': 'TensorFlow',
    'keras': 'Keras',
    'xgboost': 'XGBoost',
    'lightgbm': 'LightGBM',
    'hugging face': 'Hugging Face',
    'langchain': 'LangChain',
    'llamaindex': 'LlamaIndex',
    'openai': 'OpenAI',
    'nlp': 'NLP (Natural Language Processing)',
    'deep learning': 'Deep Learning',
    'machine learning': 'Machine Learning',
    'computer vision': 'Computer Vision',
    'vector search': 'Vector Search',
    'rag pipelines': 'RAG Pipelines',
    'pinecone': 'Pinecone',
    'chroma': 'Chroma',
    'milvus': 'Milvus',
    'statistics': 'Statistics',
    'statistical modeling': 'Statistical Modeling',
    'exploratory data analysis': 'Exploratory Data Analysis (EDA)',
    'hypothesis testing': 'Hypothesis Testing',
    'predictive modeling': 'Predictive Modeling',
    'data visualization': 'Data Visualization',
    'a/b testing': 'A/B Testing',
    'feature engineering': 'Feature Engineering',
    'model evaluation': 'Model Evaluation',
    'time series': 'Time Series Analysis',
    'data warehousing': 'Data Warehousing',
    'etl pipelines': 'ETL Pipelines',
    'tableau': 'Tableau',
    'power bi': 'Power BI',
    'looker': 'Looker',
    'excel': 'Excel',
    'spark': 'Apache Spark',
    'pyspark': 'PySpark',
    'react': 'React',
    'react.js': 'React.js',
    'next.js': 'Next.js',
    'vue': 'Vue.js',
    'vue.js': 'Vue.js',
    'angular': 'Angular',
    'redux': 'Redux',
    'zustand': 'Zustand',
    'tailwind css': 'Tailwind CSS',
    'tailwind': 'Tailwind CSS',
    'bootstrap': 'Bootstrap',
    'sass': 'Sass',
    'webpack': 'Webpack',
    'vite': 'Vite',
    'jest': 'Jest',
    'cypress': 'Cypress',
    'playwright': 'Playwright',
    'ui/ux': 'UI/UX Design',
    'figma': 'Figma',
    'storybook': 'Storybook',
    'design systems': 'Design Systems',
    'web performance': 'Web Performance',
    'responsive design': 'Responsive Design',
    'accessibility': 'Web Accessibility (WCAG)',
    'wcag': 'WCAG Accessibility',
    'node.js': 'Node.js',
    'express': 'Express.js',
    'express.js': 'Express.js',
    'fastapi': 'FastAPI',
    'django': 'Django',
    'flask': 'Flask',
    'spring boot': 'Spring Boot',
    'nestjs': 'NestJS',
    'graphql': 'GraphQL',
    'graphql apis': 'GraphQL APIs',
    'rest apis': 'REST APIs',
    'restful apis': 'RESTful APIs',
    'grpc': 'gRPC',
    'microservices': 'Microservices',
    'oauth': 'OAuth 2.0',
    'oauth2': 'OAuth 2.0',
    'jwt': 'JWT Authentication',
    'websockets': 'WebSockets',
    'kafka': 'Apache Kafka',
    'rabbitmq': 'RabbitMQ',
    'celery': 'Celery',
    'database indexing': 'Database Indexing',
    'performance tuning': 'Performance Tuning',
    'postgresql': 'PostgreSQL',
    'mongodb': 'MongoDB',
    'mysql': 'MySQL',
    'redis': 'Redis',
    'elasticsearch': 'Elasticsearch',
    'cassandra': 'Cassandra',
    'dynamodb': 'DynamoDB',
    'supabase': 'Supabase',
    'firebase': 'Firebase',
    'bigquery': 'Google BigQuery',
    'snowflake': 'Snowflake',
    'redshift': 'Amazon Redshift',
    'sqlite': 'SQLite',
    'aws': 'AWS Cloud',
    'amazon web services': 'AWS Cloud',
    'gcp': 'Google Cloud (GCP)',
    'google cloud': 'Google Cloud (GCP)',
    'azure': 'Microsoft Azure',
    'docker': 'Docker',
    'kubernetes': 'Kubernetes',
    'terraform': 'Terraform (IaC)',
    'ci/cd': 'CI/CD Automation',
    'ci/cd pipelines': 'CI/CD Pipelines',
    'github actions': 'GitHub Actions',
    'gitlab ci': 'GitLab CI',
    'jenkins': 'Jenkins',
    'linux': 'Linux',
    'prometheus': 'Prometheus',
    'grafana': 'Grafana',
    'helm': 'Helm',
    'ansible': 'Ansible',
    'cloud infrastructure': 'Cloud Infrastructure',
    'serverless': 'Serverless Architecture',
    'nginx': 'Nginx',
    'agile/scrum': 'Agile / Scrum',
    'agile': 'Agile Methodology',
    'scrum': 'Scrum Framework',
    'jira': 'Jira',
    'unit testing': 'Unit Testing',
    'integration testing': 'Integration Testing',
    'tdd': 'Test-Driven Development (TDD)',
    'automated testing': 'Automated Testing',
    'system architecture': 'System Architecture',
    'distributed systems': 'Distributed Systems',
    'git': 'Git Version Control'
}


def extract_skills_and_keywords(job_description: str, resume_text: str) -> Dict[str, List[str]]:
    jd_lower = (job_description or '').lower()
    resume_lower = (resume_text or '').lower()

    missing = []
    matched = []
    matched_canonical_keys = set()

    sorted_canonical = sorted(CANONICAL_SKILLS_TAXONOMY, key=len, reverse=True)

    for skill in sorted_canonical:
        escaped = re.escape(skill)
        pattern = rf'(^|[^a-zA-Z0-9#+.-]){escaped}([^a-zA-Z0-9#+.-]|$)'
        
        if re.search(pattern, jd_lower):
            if any(skill in k and k != skill for k in matched_canonical_keys):
                continue

            matched_canonical_keys.add(skill)
            is_present = bool(re.search(pattern, resume_lower))
            display_name = SKILL_DISPLAY_NAMES.get(skill, skill.title())

            if is_present:
                if display_name not in matched:
                    matched.append(display_name)
            else:
                if display_name not in missing:
                    missing.append(display_name)

    return {"missing_keywords": missing, "matched_keywords": matched}


def compute_realistic_match_score(matched_count: int, missing_count: int) -> float:
    total = matched_count + missing_count
    if total == 0:
        return 50.0

    skill_coverage = (matched_count / total) * 100.0

    if skill_coverage >= 80:
        calibrated = 85.0 + (skill_coverage - 80.0) * 0.65
    elif skill_coverage >= 50:
        calibrated = 68.0 + (skill_coverage - 50.0) * 0.55
    elif skill_coverage >= 25:
        calibrated = 45.0 + (skill_coverage - 25.0) * 0.9
    else:
        calibrated = max(15.0, skill_coverage * 1.8)

    return round(min(98.0, max(10.0, calibrated)), 1)


def generate_lacking_areas(missing_keywords: List[str], score: float) -> List[Dict[str, str]]:
    lacking = []
    top_missing_str = ", ".join(missing_keywords[:4]) if missing_keywords else ""

    if score < 50:
        lacking.append({
            "title": "🚨 Major Technical Skill Disconnect",
            "description": f"Your resume is missing fundamental core technologies required for this role: {top_missing_str or 'essential tools'}. ATS parsers will likely filter out the application."
        })
        lacking.append({
            "title": "⚠️ Role Title & Core Experience Mismatch",
            "description": "Your headline and experience bullet points do not explicitly align with the primary technologies demanded in the job posting."
        })
    elif score < 75:
        lacking.append({
            "title": "⚠️ Secondary Methodologies & Tooling Gap",
            "description": f"You have strong foundational alignment! To boost your ATS ranking, consider incorporating: {top_missing_str or 'secondary requirements'}."
        })
        lacking.append({
            "title": "📊 Measurable Accomplishments & Scale",
            "description": "Add more quantifiable metrics (e.g. % accuracy, scale, latency reduced, revenue impact) to prove real-world production impact."
        })
    else:
        lacking.append({
            "title": "🌟 Outstanding Technical Alignment",
            "description": "Your resume demonstrates exceptional coverage of the core programming languages, tools, and libraries required for this role."
        })
        if top_missing_str:
            lacking.append({
                "title": "💡 Minor Polish Opportunities",
                "description": f"To reach peak 95%+ ATS optimization, consider naturally including mentions of: {top_missing_str}."
            })

    return lacking


def generate_improvement_suggestions(missing_keywords: List[str], score: float) -> List[Dict[str, str]]:
    suggestions = []

    if missing_keywords:
        sample_keys = ", ".join(missing_keywords[:3])
        suggestions.append({
            "category": "1. Inject Missing Methodologies into Bullets",
            "action": f"Incorporate absent terms ({sample_keys}) naturally into your Work Experience and Featured Projects sections with contextual usage.",
            "impact": "High Impact (ATS Ranking)"
        })
    else:
        suggestions.append({
            "category": "1. Keyword Alignment",
            "action": "Ensure all key terms and technologies mentioned in the job description appear at least 2-3 times across your resume sections.",
            "impact": "High Impact (ATS Ranking)"
        })

    suggestions.append({
        "category": "2. Apply the Google XYZ Bullet Formula",
        "action": "Rewrite accomplishments using: 'Accomplished [X] as measured by [Y], by doing [Z]'. Add specific metrics (%, latency, users, scale).",
        "impact": "High Impact (Recruiter Appeal)"
    })

    suggestions.append({
        "category": "3. Restructure Technical Skills Section",
        "action": "Categorize your skills section into Languages, Libraries/Frameworks, Databases, and Tools matching the job description order.",
        "impact": "Medium Impact (Readability)"
    })

    return suggestions


@app.post("/api/v1/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...),
) -> Dict[str, Any]:
    try:
        file_contents = await file.read()
        with pdfplumber.open(io.BytesIO(file_contents)) as pdf:
            resume_text = "\n".join(page.extract_text() or "" for page in pdf.pages).strip()

        if not resume_text:
            raise HTTPException(status_code=400, detail="Could not extract text from the uploaded PDF. Please make sure it is not a scanned image PDF.")

        gap_data = extract_skills_and_keywords(job_description, resume_text)
        missing_keywords = gap_data["missing_keywords"]
        matched_keywords = gap_data["matched_keywords"]

        match_score = compute_realistic_match_score(len(matched_keywords), len(missing_keywords))
        lacking_areas = generate_lacking_areas(missing_keywords, match_score)
        improvement_suggestions = generate_improvement_suggestions(missing_keywords, match_score)

        snippet = resume_text[:400] + ("..." if len(resume_text) > 400 else "")

        return {
            "status": "success",
            "match_score": match_score,
            "resume_snippet": snippet,
            "missing_keywords": missing_keywords,
            "matched_keywords": matched_keywords,
            "lacking_areas": lacking_areas,
            "improvement_suggestions": improvement_suggestions,
            "word_count": {
                "resume": len(resume_text.split()),
                "job_description": len(job_description.split())
            }
        }
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error)) from error