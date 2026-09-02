// Comprehensive client-side NLP and gap analysis engine
// Industry-Standard Canonical Skills & Competency Extractor (100% Noise-Free)

// Curated canonical taxonomy of genuine technical & domain skills
const CANONICAL_SKILLS_TAXONOMY = [
  // Programming Languages
  'python', 'javascript', 'typescript', 'java', 'c++', 'c#', 'golang', 'go', 'rust',
  'ruby', 'php', 'swift', 'kotlin', 'sql', 'r', 'html5', 'css3', 'bash', 'shell', 'scala',

  // Data Science, ML & AI
  'pandas', 'numpy', 'scikit-learn', 'pytorch', 'tensorflow', 'keras', 'xgboost',
  'lightgbm', 'hugging face', 'langchain', 'llamaindex', 'openai', 'nlp', 'deep learning',
  'machine learning', 'computer vision', 'vector search', 'rag pipelines', 'pinecone',
  'chroma', 'milvus', 'statistics', 'statistical modeling', 'exploratory data analysis',
  'hypothesis testing', 'predictive modeling', 'data visualization', 'a/b testing',
  'feature engineering', 'model evaluation', 'time series', 'data warehousing',
  'etl pipelines', 'tableau', 'power bi', 'looker', 'excel', 'spark', 'pyspark',

  // Frontend & UI
  'react', 'react.js', 'next.js', 'vue', 'vue.js', 'angular', 'redux', 'zustand',
  'tailwind css', 'tailwind', 'bootstrap', 'sass', 'webpack', 'vite', 'jest',
  'cypress', 'playwright', 'ui/ux', 'figma', 'storybook', 'design systems',
  'web performance', 'responsive design', 'accessibility', 'wcag',

  // Backend & APIs
  'node.js', 'express', 'express.js', 'fastapi', 'django', 'flask', 'spring boot',
  'nestjs', 'graphql', 'graphql apis', 'rest apis', 'restful apis', 'grpc',
  'microservices', 'oauth', 'oauth2', 'jwt', 'websockets', 'kafka', 'rabbitmq',
  'celery', 'database indexing', 'performance tuning',

  // Databases & Warehouses
  'postgresql', 'mongodb', 'mysql', 'redis', 'elasticsearch', 'cassandra',
  'dynamodb', 'supabase', 'firebase', 'bigquery', 'snowflake', 'redshift', 'sqlite',

  // Cloud & DevOps
  'aws', 'amazon web services', 'gcp', 'google cloud', 'azure', 'docker',
  'kubernetes', 'terraform', 'ci/cd', 'ci/cd pipelines', 'github actions',
  'gitlab ci', 'jenkins', 'linux', 'prometheus', 'grafana', 'helm', 'ansible',
  'cloud infrastructure', 'serverless', 'nginx',

  // Engineering Methodologies & Testing
  'agile/scrum', 'agile', 'scrum', 'jira', 'unit testing', 'integration testing',
  'tdd', 'automated testing', 'system architecture', 'distributed systems', 'git'
];

// Display name mapping for proper capitalizations
const SKILL_DISPLAY_NAMES = {
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
};

export function extractSkillsAndKeywords(jobDescription, resumeText) {
  const jdLower = (jobDescription || '').toLowerCase();
  const resumeLower = (resumeText || '').toLowerCase();

  const missing = [];
  const matched = [];
  const matchedCanonicalKeys = new Set();

  // Sort canonical skills by length descending so longer phrases match before substrings
  const sortedCanonical = [...CANONICAL_SKILLS_TAXONOMY].sort((a, b) => b.length - a.length);

  for (const skill of sortedCanonical) {
    // Check if the skill is mentioned in the Job Description
    // Word boundary check or exact phrase match
    const regex = new RegExp(`(^|[^a-zA-Z0-9#+.-])${skill.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}([^a-zA-Z0-9#+.-]|$)`, 'i');
    
    if (regex.test(jdLower)) {
      // Avoid duplicate sub-phrases (e.g. if 'graphql apis' matched, don't also add 'graphql')
      if (Array.from(matchedCanonicalKeys).some(k => k.includes(skill) && k !== skill)) {
        continue;
      }

      matchedCanonicalKeys.add(skill);

      // Check if candidate's resume possesses this skill
      const isPresentInResume = regex.test(resumeLower);
      const displayName = SKILL_DISPLAY_NAMES[skill] || skill.charAt(0).toUpperCase() + skill.slice(1);

      if (isPresentInResume) {
        if (!matched.includes(displayName)) matched.push(displayName);
      } else {
        if (!missing.includes(displayName)) missing.push(displayName);
      }
    }
  }

  // Fallback: If no canonical skills matched in JD (e.g. non-tech prompt), extract key clean words
  if (matched.length === 0 && missing.length === 0) {
    const rawTokens = jdLower.match(/[a-zA-Z0-9#+.-]{3,}/g) || [];
    const stopWords = new Set(['and', 'the', 'for', 'with', 'that', 'this', 'from', 'have', 'your', 'will', 'role', 'work', 'team']);
    for (const token of rawTokens) {
      if (!stopWords.has(token) && isNaN(token)) {
        const isPresent = resumeLower.includes(token);
        const name = token.charAt(0).toUpperCase() + token.slice(1);
        if (isPresent) {
          if (!matched.includes(name) && matched.length < 8) matched.push(name);
        } else {
          if (!missing.includes(name) && missing.length < 6) missing.push(name);
        }
      }
    }
  }

  return { missingKeywords: missing, matchedKeywords: matched };
}

export function calibrateMatchScore(rawScore, matchedCount, missingCount) {
  const total = matchedCount + missingCount;
  if (total === 0) return Math.min(Math.max(rawScore, 10), 98);

  const skillCoverage = (matchedCount / total) * 100;

  // Realistic ATS Scoring based on genuine skills:
  // - 80%+ skills matched (e.g. Python, SQL, Pandas, NumPy, Scikit-learn): Score 85 - 98%
  // - 50-79% skills matched: Score 68 - 84%
  // - 25-49% skills matched: Score 45 - 67%
  // - <25% skills matched: Score 15 - 44%
  let calibrated = 0;
  if (skillCoverage >= 80) {
    calibrated = 85 + (skillCoverage - 80) * 0.65; // 85 - 98%
  } else if (skillCoverage >= 50) {
    calibrated = 68 + (skillCoverage - 50) * 0.55; // 68 - 84.5%
  } else if (skillCoverage >= 25) {
    calibrated = 45 + (skillCoverage - 25) * 0.9; // 45 - 67.5%
  } else {
    calibrated = Math.max(15, skillCoverage * 1.8); // 15 - 45%
  }

  return Math.round(Math.min(Math.max(calibrated, 10), 98) * 10) / 10;
}

export function analyzeGapsAndImprovements(resumeText, jobDescription, initialScore) {
  const { missingKeywords, matchedKeywords } = extractSkillsAndKeywords(jobDescription, resumeText);
  const calibratedScore = calibrateMatchScore(initialScore, matchedKeywords.length, missingKeywords.length);

  // Lacking Areas based on genuine skills
  const lackingAreas = [];
  const topMissing = missingKeywords.slice(0, 4).join(', ');

  if (calibratedScore < 50) {
    lackingAreas.push({
      title: '🚨 Major Technical Skill Disconnect',
      description: topMissing
        ? `Your resume is missing fundamental core technologies required for this role: ${topMissing}. ATS parsers will likely filter out the application.`
        : `Your resume language has substantial divergence from the core technical keywords required in this job description.`
    });

    lackingAreas.push({
      title: '⚠️ Role Title & Core Experience Mismatch',
      description: `Your headline and experience bullet points do not explicitly align with the primary technologies demanded in the job posting.`
    });
  } else if (calibratedScore < 75) {
    lackingAreas.push({
      title: '⚠️ Secondary Methodologies & Tooling Gap',
      description: topMissing
        ? `You have strong foundational alignment! To boost your ATS ranking, consider incorporating: ${topMissing}.`
        : `Secondary toolsets and frameworks in the job posting are not clearly highlighted in your project bullets.`
    });

    lackingAreas.push({
      title: '📊 Measurable Accomplishments & Scale',
      description: `Add more quantifiable metrics (e.g. % accuracy, scale, latency reduced, revenue impact) to prove real-world production impact.`
    });
  } else {
    lackingAreas.push({
      title: '🌟 Outstanding Technical Alignment',
      description: `Your resume demonstrates exceptional coverage of the core programming languages, tools, and libraries required for this role.`
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
    const sampleKeys = missingKeywords.slice(0, 3).join(', ');
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
    action: `Rewrite accomplishments using: "Accomplished [X], as measured by [Y], by doing [Z]". For example: "Trained XGBoost models achieving 94% precision on 2M+ records, reducing churn by 18%".`,
    impact: 'High Impact (Recruiter Appeal)'
  });

  improvementSuggestions.push({
    category: '3. Restructure Technical Skills Section',
    action: `Group your skills into clear categories that mirror the job posting: Languages, Libraries/Frameworks, Databases, and Tools. Place the most relevant skills first.`,
    impact: 'Medium Impact (Readability)'
  });

  return {
    calibrated_score: calibratedScore,
    missing_keywords: missingKeywords,
    matched_keywords: matchedKeywords,
    lacking_areas: lackingAreas,
    improvement_suggestions: improvementSuggestions
  };
}
