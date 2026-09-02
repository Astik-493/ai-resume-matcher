// Comprehensive client-side NLP and gap analysis engine
// Accurate Skill & Domain Keyword Extraction (Filters out conversational verbs and noise)

const EXPANDED_STOP_WORDS = new Set([
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
  // Common action verbs & non-skill descriptive words
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
]);

// High-value technical concepts and compound phrases
const COMPOUND_PHRASES = [
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
];

export function extractSkillsAndKeywords(jobDescription, resumeText) {
  const jdLower = (jobDescription || '').toLowerCase();
  const resumeLower = (resumeText || '').toLowerCase();

  const missing = [];
  const matched = [];
  const checkedPhrases = new Set();

  // 1. Check for compound phrases in the JD
  for (const phrase of COMPOUND_PHRASES) {
    if (jdLower.includes(phrase)) {
      checkedPhrases.add(phrase);
      const isMatched = resumeLower.includes(phrase);
      const formatted = phrase
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      if (isMatched) {
        if (!matched.includes(formatted)) matched.push(formatted);
      } else {
        if (!missing.includes(formatted)) missing.push(formatted);
      }
    }
  }

  // 2. Extract clean single tokens from JD
  const rawWords = jdLower.match(/[a-z0-9#+.-]{2,}/gi) || [];
  const freq = {};

  for (const w of rawWords) {
    const clean = w.toLowerCase().replace(/^[^\w#+]+|[^\w#+]+$/g, '');
    if (
      clean.length >= 2 &&
      !EXPANDED_STOP_WORDS.has(clean) &&
      isNaN(clean) &&
      !Array.from(checkedPhrases).some(p => p.includes(clean))
    ) {
      freq[clean] = (freq[clean] || 0) + 1;
    }
  }

  // Sort by frequency
  const sortedKeywords = Object.keys(freq).sort((a, b) => freq[b] - freq[a]);

  for (const kw of sortedKeywords) {
    const escaped = kw.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    const isPresent = regex.test(resumeLower);

    const formattedKw =
      ['api', 'sql', 'aws', 'gcp', 'ui', 'ux', 'ci', 'cd', 'ml', 'ai', 'rest', 'nlp', 'git'].includes(kw)
        ? kw.toUpperCase()
        : kw.charAt(0).toUpperCase() + kw.slice(1);

    if (isPresent) {
      if (!matched.includes(formattedKw) && matched.length < 12) {
        matched.push(formattedKw);
      }
    } else {
      if (!missing.includes(formattedKw) && missing.length < 10) {
        missing.push(formattedKw);
      }
    }
  }

  return { missingKeywords: missing, matchedKeywords: matched };
}

export function calibrateMatchScore(rawScore, matchedCount, missingCount) {
  const total = matchedCount + missingCount;
  if (total === 0) return Math.min(Math.max(rawScore, 10), 98);

  const skillCoverage = (matchedCount / total) * 100;

  // In ATS grading:
  // If candidate has 70%+ of actual tech skills, score is 75-90%+
  // If candidate has 50% of tech skills, score is 65-75%
  // If candidate has 20-30% of tech skills, score is 40-55%
  // If candidate has < 15% of tech skills, score is < 30%
  let calibrated = 0;
  if (skillCoverage >= 80) {
    calibrated = 82 + (skillCoverage - 80) * 0.8; // 82 - 98%
  } else if (skillCoverage >= 50) {
    calibrated = 65 + (skillCoverage - 50) * 0.55; // 65 - 81.5%
  } else if (skillCoverage >= 25) {
    calibrated = 40 + (skillCoverage - 25) * 1.0; // 40 - 65%
  } else {
    calibrated = Math.max(12, skillCoverage * 1.6); // 12 - 40%
  }

  // Factor in raw cosine as subtle contextual nuance (15% weight)
  const finalScore = (0.85 * calibrated) + (0.15 * Math.min(100, (rawScore / 30) * 75));
  return Math.round(Math.min(Math.max(finalScore, 10), 98) * 10) / 10;
}

export function analyzeGapsAndImprovements(resumeText, jobDescription, initialScore) {
  const { missingKeywords, matchedKeywords } = extractSkillsAndKeywords(jobDescription, resumeText);

  // Calibrate match score so reasonable resumes with strong tools (Python, SQL, Pandas, NumPy, Scikit-learn) score appropriately (e.g. 80%+)
  const calibratedScore = calibrateMatchScore(initialScore, matchedKeywords.length, missingKeywords.length);

  // Lacking Areas based on score & missing keywords
  const lackingAreas = [];
  const topMissing = missingKeywords.slice(0, 4).join(', ');

  if (calibratedScore < 50) {
    lackingAreas.push({
      title: '🚨 Severe Keyword & Technical Skill Disconnect',
      description: topMissing
        ? `Your resume is missing fundamental keywords prioritized by the job posting, such as: ${topMissing}. ATS systems will filter your resume out before a recruiter sees it.`
        : `Your resume language has substantial divergence from the core technical keywords required in this job description.`
    });

    lackingAreas.push({
      title: '⚠️ Role Title & Summary Mismatch',
      description: `The professional summary or headline does not explicitly target the required position and fails to highlight the primary tech stack and domain expertise.`
    });

    lackingAreas.push({
      title: '📉 Lack of Targeted Experience & Tech Stack Bullet Points',
      description: `Your work experience descriptions do not demonstrate hands-on application of the tools, frameworks, and workflows required in this job's daily responsibilities.`
    });
  } else if (calibratedScore < 75) {
    lackingAreas.push({
      title: '⚠️ Secondary Frameworks & Methodology Gap',
      description: topMissing
        ? `While your core tech stack is strong, you can optimize your score by explicitly incorporating: ${topMissing}.`
        : `Secondary toolsets and frameworks in the job posting are not clearly highlighted in your project bullets.`
    });

    lackingAreas.push({
      title: '🔍 Keyword Density & Phrasing Alignment',
      description: `Certain industry-standard terms and exact phrase matches in the job posting are phrased differently in your resume, reducing semantic similarity.`
    });

    lackingAreas.push({
      title: '📊 Measurable Accomplishments & Scale',
      description: `Add more quantifiable metrics (e.g. model accuracy %, latency reduced, datasets processed) to prove real-world production impact.`
    });
  } else {
    lackingAreas.push({
      title: '🌟 High Technical Skill Alignment',
      description: `Your resume strongly demonstrates the primary technologies and tools required for this role.`
    });

    if (topMissing) {
      lackingAreas.push({
        title: '💡 Minor Polish Opportunities',
        description: `To reach peak 95%+ ATS optimization, consider naturally including mentions of: ${topMissing}.`
      });
    }
  }

  // Improvement Suggestions
  const improvementSuggestions = [];

  if (missingKeywords.length > 0) {
    const sampleKeys = missingKeywords.slice(0, 4).join(', ');
    improvementSuggestions.push({
      category: '1. Inject Missing Methodologies into Bullets',
      action: `Incorporate absent terms (${sampleKeys}) naturally into your Work Experience and Featured Projects sections with contextual usage.`,
      impact: 'High Impact (ATS Ranking)'
    });
  } else {
    improvementSuggestions.push({
      category: '1. Keyword Alignment',
      action: `Ensure all key terms and technologies mentioned in the job description appear at least 2-3 times across your resume sections.`,
      impact: 'High Impact (ATS Ranking)'
    });
  }

  improvementSuggestions.push({
    category: '2. Apply the Google XYZ Bullet Formula',
    action: `Rewrite your bullet points following: "Accomplished [X], as measured by [Y], by doing [Z]". For example: "Trained XGBoost models achieving 94% precision on 2M+ records, reducing churn by 18%".`,
    impact: 'High Impact (Recruiter Appeal)'
  });

  improvementSuggestions.push({
    category: '3. Restructure Technical Skills Section',
    action: `Group your skills into clear categories that mirror the job posting: Languages, Libraries/Frameworks, Databases, and Tools. Place the most relevant skills first.`,
    impact: 'Medium Impact (Readability)'
  });

  if (calibratedScore < 70) {
    improvementSuggestions.push({
      category: '4. Tailor Summary to the Target Job Title',
      action: `Update your 3-line professional summary at the very top of your resume to include the exact job title and your years of experience in the core required technologies.`,
      impact: 'Medium Impact (First Impression)'
    });
  }

  return {
    calibrated_score: calibratedScore,
    missing_keywords: missingKeywords,
    matched_keywords: matchedKeywords,
    lacking_areas: lackingAreas,
    improvement_suggestions: improvementSuggestions
  };
}
