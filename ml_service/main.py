import io
import re
from typing import List, Dict, Any, Set
import pdfplumber
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

EXPANDED_STOP_WORDS: Set[str] = {
    'and', 'the', 'to', 'a', 'of', 'in', 'for', 'is', 'on', 'that', 'by', 'this',
    'with', 'i', 'you', 'it', 'not', 'or', 'be', 'are', 'from', 'at', 'as', 'your',
    'all', 'have', 'new', 'more', 'an', 'was', 'we', 'will', 'home', 'can', 'us',
    'about', 'if', 'page', 'my', 'has', 'search', 'free', 'but', 'our', 'one',
    'other', 'do', 'no', 'information', 'time', 'they', 'site', 'he', 'up', 'may',
    'what', 'which', 'their', 'news', 'out', 'use', 'any', 'there', 'see', 'only',
    'so', 'his', 'when', 'contact', 'here', 'business', 'who', 'web', 'also', 'now',
    'help', 'get', 'view', 'online', 'first', 'been', 'would', 'how', 'were', 'me',
    'services', 'some', 'these', 'click', 'its', 'like', 'service', 'than', 'find',
    'date', 'back', 'top', 'people', 'had', 'list', 'name', 'just', 'over', 'state',
    'year', 'day', 'into', 'email', 'two', 'world', 'next', 'used', 'work', 'last',
    'most', 'make', 'them', 'should', 'system', 'post', 'such', 'please', 'available',
    'message', 'after', 'best', 'software', 'well', 'where', 'years', 'company',
    'group', 'need', 'many', 'user', 'said', 'does', 'set', 'under', 'general',
    'part', 'could', 'great', 'must', 'report', 'off', 'details', 'line', 'terms',
    'before', 'did', 'send', 'right', 'type', 'because', 'those', 'using', 'results',
    'take', 'within', 'want', 'between', 'code', 'show', 'even', 'check', 'same',
    'section', 'found', 'both', 'total', 'place', 'end', 'following', 'without',
    'per', 'current', 'posts', 'guide', 'location', 'change', 'text', 'level',
    'profile', 'previous', 'form', 'main', 'another', 'why', 'tools', 'low',
    'value', 'jobs', 'provide', 'learn', 'around', 'course', 'job', 'process',
    'point', 'join', 'look', 'team', 'note', 'really', 'action', 'start',
    'plan', 'required', 'better', 'say', 'questions', 'test', 'again', 'issues',
    'users', 'complete', 'working', 'candidate', 'candidates', 'opportunity',
    'responsibilities', 'qualifications', 'duties', 'role', 'position',
    'requirement', 'requirements', 'skills', 'experience', 'preferred', 'plus',
    'strong', 'hands-on', 'degree', 'equivalent', 'building', 'scalable', 'products',
    # Filter common verbs and filler words
    'perform', 'performing', 'build', 'large', 'key', 'across', 'various', 'deliver',
    'delivering', 'assist', 'assisting', 'closely', 'drive', 'driving', 'demonstrated',
    'deep', 'solid', 'proven', 'lead', 'leading', 'scale', 'scaling', 'real', 'solve',
    'solving', 'apply', 'applying', 'collaborate', 'collaborating', 'support',
    'supporting', 'ensure', 'ensuring', 'write', 'writing', 'create', 'creating',
    'maintain', 'maintaining', 'taking', 'making', 'member', 'related', 'science',
    'field', 'ability', 'proficient', 'proficiency', 'knowledge', 'understanding',
    'familiarity', 'background', 'bachelor', 'master', 'phd', 'bootcamp', 'degree',
    'stem', 'high', 'good', 'excellent', 'fast-paced', 'environment', 'solutions',
    'impactful', 'complex', 'modern', 'standards', 'practices', 'technologies',
    'daily', 'active', 'functional', 'technical', 'deliverables', 'methods', 'things'
}

COMPOUND_PHRASES = [
    'a/b testing',
    'statistical modeling',
    'exploratory data analysis',
    'hypothesis testing',
    'predictive modeling',
    'data visualization',
    'machine learning',
    'deep learning',
    'natural language processing',
    'computer vision',
    'vector search',
    'rag pipelines',
    'restful apis',
    'rest apis',
    'graphql apis',
    'microservices',
    'ci/cd pipelines',
    'ci/cd',
    'design systems',
    'cloud infrastructure',
    'unit testing',
    'integration testing',
    'agile/scrum',
    'data warehousing',
    'feature engineering',
    'model evaluation',
    'distributed systems',
    'performance tuning',
    'database indexing'
]


def calculate_raw_cosine(resume_text: str, job_description: str) -> float:
    """Return raw cosine similarity."""
    if not resume_text.strip() or not job_description.strip():
        return 0.0
    vectorizer = TfidfVectorizer(stop_words="english")
    vectors = vectorizer.fit_transform([resume_text, job_description])
    return float(cosine_similarity(vectors[0:1], vectors[1:2])[0][0])


def extract_keywords_and_gaps(resume_text: str, job_description: str) -> Dict[str, List[str]]:
    """Extract missing and matched skills and technical phrases."""
    resume_lower = resume_text.lower()
    jd_lower = job_description.lower()

    missing = []
    matched = []
    checked_phrases = set()

    # 1. Check compound technical phrases
    for phrase in COMPOUND_PHRASES:
        if phrase in jd_lower:
            checked_phrases.add(phrase)
            is_matched = phrase in resume_lower
            formatted = " ".join(w.capitalize() for w in phrase.split())
            if is_matched:
                if formatted not in matched:
                    matched.append(formatted)
            else:
                if formatted not in missing:
                    missing.append(formatted)

    # 2. Extract clean single tokens from JD
    raw_words = re.findall(r'\b[a-zA-Z0-9#+.-]{2,}\b', jd_lower)
    freq: Dict[str, int] = {}
    for w in raw_words:
        clean = w.strip(".,;:()[]{}'\"")
        if (
            len(clean) >= 2
            and clean not in EXPANDED_STOP_WORDS
            and not clean.isdigit()
            and not any(clean in p for p in checked_phrases)
        ):
            freq[clean] = freq.get(clean, 0) + 1

    sorted_terms = sorted(freq.keys(), key=lambda k: freq[k], reverse=True)

    for term in sorted_terms:
        pattern = r'\b' + re.escape(term) + r'\b'
        is_matched = bool(re.search(pattern, resume_lower))

        formatted = (
            term.upper()
            if term in {'api', 'sql', 'aws', 'gcp', 'ui', 'ux', 'ci', 'cd', 'ml', 'ai', 'rest', 'nlp', 'git'}
            else term.title()
        )

        if is_matched:
            if formatted not in matched and len(matched) < 12:
                matched.append(formatted)
        else:
            if formatted not in missing and len(missing) < 10:
                missing.append(formatted)

    return {
        "missing_keywords": missing,
        "matched_keywords": matched,
    }


def compute_realistic_match_score(raw_cosine: float, matched_count: int, missing_count: int) -> float:
    """
    Skill-weighted ATS score calculation.
    """
    total = matched_count + missing_count
    if total == 0:
        return 50.0

    skill_coverage = (matched_count / total) * 100.0

    if skill_coverage >= 80:
        calibrated = 82.0 + (skill_coverage - 80.0) * 0.8
    elif skill_coverage >= 50:
        calibrated = 65.0 + (skill_coverage - 50.0) * 0.55
    elif skill_coverage >= 25:
        calibrated = 40.0 + (skill_coverage - 25.0) * 1.0
    else:
        calibrated = max(12.0, skill_coverage * 1.6)

    final_score = (0.85 * calibrated) + (0.15 * min(100.0, (raw_cosine / 0.30) * 75.0))
    return round(min(98.0, max(10.0, final_score)), 1)


def generate_lacking_areas(missing_keywords: List[str], score: float) -> List[Dict[str, str]]:
    """Determine what specific aspects the resume is lacking."""
    lacking = []
    top_missing_str = ", ".join(missing_keywords[:4]) if missing_keywords else ""

    if score < 50:
        lacking.append({
            "title": "🚨 Severe Keyword & Technical Skill Disconnect",
            "description": f"Your resume is missing critical technical keywords emphasized in the job description: {top_missing_str or 'essential tools and frameworks'}. Applicant Tracking Systems (ATS) will likely filter your application out before review."
        })
        lacking.append({
            "title": "⚠️ Role Title & Core Experience Mismatch",
            "description": "Your resume headline and work history do not explicitly align with the required job role and core technical responsibilities."
        })
        lacking.append({
            "title": "📉 Lack of Targeted Project & Technology Bullet Points",
            "description": "Your listed projects and accomplishments do not demonstrate hands-on experience solving challenges with the required stack."
        })
    elif score < 75:
        lacking.append({
            "title": "⚠️ Secondary Tooling & Methodology Gap",
            "description": f"While your core technical stack is strong, you can optimize your score by explicitly incorporating: {top_missing_str or 'secondary requirements'}."
        })
        lacking.append({
            "title": "🔍 Keyword Density & Phrasing Alignment",
            "description": "Certain industry-standard terms in the job posting are described differently in your resume, reducing semantic match score."
        })
        lacking.append({
            "title": "📊 Measurable Accomplishments & Scale",
            "description": "Add more quantifiable metrics (e.g. model accuracy %, latency reduced, datasets processed) to prove real-world production impact."
        })
    else:
        lacking.append({
            "title": "🌟 High Technical Skill Alignment",
            "description": "Your resume strongly demonstrates the primary technologies and tools required for this role."
        })
        if top_missing_str:
            lacking.append({
                "title": "💡 Minor Polish Opportunities",
                "description": f"To reach peak 95%+ ATS optimization, consider naturally including mentions of: {top_missing_str}."
            })

    return lacking


def generate_improvement_suggestions(missing_keywords: List[str], score: float) -> List[Dict[str, str]]:
    """Generate concrete, actionable advice on how to improve the resume."""
    suggestions = []

    if missing_keywords:
        sample_keys = ", ".join(missing_keywords[:4])
        suggestions.append({
            "category": "1. Inject Missing Methodologies into Bullets",
            "action": f"Incorporate absent terms ({sample_keys}) naturally into your Work Experience bullet points and Projects section.",
            "impact": "High Impact (ATS Ranking)"
        })
    else:
        suggestions.append({
            "category": "1. Keyword Frequency Alignment",
            "action": "Ensure core technical requirements from the posting appear 2-3 times across your resume sections naturally.",
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

    if score < 70:
        suggestions.append({
            "category": "4. Tailor Summary to the Target Job Title",
            "action": "Align your 3-line professional summary at the very top of your resume with the exact job title and core requirements.",
            "impact": "Medium Impact (First Impression)"
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

        raw_cosine = calculate_raw_cosine(resume_text, job_description)
        gap_data = extract_keywords_and_gaps(resume_text, job_description)
        
        missing_keywords = gap_data["missing_keywords"]
        matched_keywords = gap_data["matched_keywords"]

        # Compute realistic calibrated match score
        match_score = compute_realistic_match_score(raw_cosine, len(matched_keywords), len(missing_keywords))

        lacking_areas = generate_lacking_areas(missing_keywords, match_score)
        improvement_suggestions = generate_improvement_suggestions(missing_keywords, match_score)

        # Snippet (first 400 chars for good readability)
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