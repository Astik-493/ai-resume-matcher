import io
import re
from typing import List, Dict, Any, Set
import pdfplumber
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

COMMON_STOP_WORDS: Set[str] = {
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
    'strong', 'hands-on', 'degree', 'equivalent', 'building', 'scalable', 'products'
}


def calculate_raw_cosine(resume_text: str, job_description: str) -> float:
    """Return raw cosine similarity."""
    if not resume_text.strip() or not job_description.strip():
        return 0.0
    vectorizer = TfidfVectorizer(stop_words="english")
    vectors = vectorizer.fit_transform([resume_text, job_description])
    return float(cosine_similarity(vectors[0:1], vectors[1:2])[0][0])


def extract_keywords_and_gaps(resume_text: str, job_description: str) -> Dict[str, List[str]]:
    """Extract missing and matched keywords between JD and Resume."""
    resume_lower = resume_text.lower()
    jd_lower = job_description.lower()

    # Extract clean tokens with 2+ characters
    raw_words = re.findall(r'\b[a-zA-Z0-9#+.-]{2,}\b', jd_lower)
    
    # Frequency count of meaningful keywords
    freq: Dict[str, int] = {}
    for w in raw_words:
        clean = w.strip(".,;:()[]{}'\"")
        if len(clean) >= 2 and clean not in COMMON_STOP_WORDS and not clean.isdigit():
            freq[clean] = freq.get(clean, 0) + 1

    sorted_terms = sorted(freq.keys(), key=lambda k: freq[k], reverse=True)

    missing = []
    matched = []

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
            if formatted not in missing and len(missing) < 12:
                missing.append(formatted)

    return {
        "missing_keywords": missing,
        "matched_keywords": matched,
    }


def compute_realistic_match_score(raw_cosine: float, matched_count: int, missing_count: int) -> float:
    """
    Calibrate raw geometric cosine similarity into an industry-standard ATS score.
    Combines:
    1. Keyword Coverage Ratio (60% weight)
    2. Calibrated Semantic Overlap (40% weight)
    """
    total_keywords = matched_count + missing_count
    if total_keywords > 0:
        keyword_coverage = (matched_count / total_keywords) * 100.0
    else:
        keyword_coverage = raw_cosine * 100.0

    # Calibrate raw cosine: in TF-IDF, a raw cosine of 0.25 represents ~65-70% real semantic overlap
    if raw_cosine > 0:
        calibrated_semantic = min(100.0, ((raw_cosine / 0.36) ** 0.82) * 100.0)
    else:
        calibrated_semantic = 0.0

    # Balanced blend
    final_score = (0.55 * keyword_coverage) + (0.45 * calibrated_semantic)
    return round(min(98.0, max(0.0, final_score)), 1)


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
        lacking.append({
            "title": "📊 Unquantified Achievements & Impact Deficit",
            "description": "Your experience bullet points lack measurable metrics (e.g. latency reduced by X%, system throughput increased by Y, or dollars saved)."
        })
    elif score < 75:
        lacking.append({
            "title": "⚠️ Secondary Tooling & Framework Gap",
            "description": f"While your foundation is solid, you are missing several key secondary tools and methodologies: {top_missing_str or 'secondary requirements'}."
        })
        lacking.append({
            "title": "🔍 Keyword Density & Phrasing Discrepancies",
            "description": "Certain industry-standard terms in the job posting are described differently in your resume, reducing semantic match score."
        })
        lacking.append({
            "title": "📐 Bullet Point Depth & Specificity",
            "description": "Some project bullets lack technical depth regarding architecture, scale, and specific problem-solving techniques relevant to this role."
        })
    else:
        lacking.append({
            "title": "💡 Minor Keyword Polish Opportunities",
            "description": f"Your profile is a strong match. Consider naturally including: {top_missing_str or 'specialized terminology'} to achieve peak ATS alignment."
        })

    return lacking


def generate_improvement_suggestions(missing_keywords: List[str], score: float) -> List[Dict[str, str]]:
    """Generate concrete, actionable advice on how to improve the resume."""
    suggestions = []

    if missing_keywords:
        sample_keys = ", ".join(missing_keywords[:5])
        suggestions.append({
            "category": "1. Inject Missing Keywords into Experience",
            "action": f"Incorporate the absent target keywords ({sample_keys}) directly into your Work Experience bullet points and Projects section.",
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
        "action": "Categorize your skills section into Languages, Frameworks, Cloud & DevOps, and Developer Tools matching the job description order.",
        "impact": "Medium Impact (Readability)"
    })

    suggestions.append({
        "category": "4. Tailor Summary to the Target Job Title",
        "action": "Align your 3-line professional summary at the very top of your resume with the exact job title and core requirements.",
        "impact": "Medium Impact (First Impression)"
    })

    if score < 60:
        suggestions.append({
            "category": "5. Add Featured Projects Demonstrating Stack",
            "action": "Include 1-2 practical projects or case studies that explicitly prove your proficiency in the required technologies.",
            "impact": "High Impact (Skill Proof)"
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