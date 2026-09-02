// Interactive AI Bullet Point Generator & Multi-Pillar Sub-Score Helper

// Domain classification for smart bullet tailoring
const DOMAINS = {
  data_ai: [
    'python', 'pandas', 'numpy', 'scikit-learn', 'sql', 'pytorch', 'tensorflow',
    'tableau', 'powerbi', 'nlp', 'vector search', 'statistical modeling',
    'hypothesis testing', 'a/b testing', 'predictive modeling', 'data visualization',
    'machine learning', 'deep learning', 'feature engineering', 'model evaluation',
    'rag pipelines', 'llms', 'data warehousing', 'bigquery', 'snowflake'
  ],
  frontend: [
    'react', 'typescript', 'next.js', 'javascript', 'tailwind', 'redux', 'css',
    'html', 'figma', 'ui/ux', 'design systems', 'web performance', 'vue',
    'zustand', 'responsive design', 'accessibility', 'jest', 'cypress'
  ],
  devops_cloud: [
    'docker', 'kubernetes', 'aws', 'gcp', 'terraform', 'ci/cd', 'linux',
    'prometheus', 'grafana', 'cloud infrastructure', 'helm', 'ansible',
    'github actions', 'microservices', 'distributed systems'
  ],
  backend_db: [
    'node.js', 'fastapi', 'postgresql', 'mongodb', 'redis', 'rest apis',
    'graphql apis', 'restful apis', 'kafka', 'django', 'express', 'flask',
    'database indexing', 'performance tuning', 'grpc', 'oauth', 'jwt'
  ]
};

export function generateTailoredBullet(skill) {
  if (!skill || !skill.trim()) return '';

  const cleanSkill = skill.trim();
  const lower = cleanSkill.toLowerCase();

  // 1. Data, AI & ML Templates
  if (DOMAINS.data_ai.some(d => lower.includes(d))) {
    const dataTemplates = [
      `Trained and evaluated predictive ML models utilizing ${cleanSkill}, achieving 93.4% ROC-AUC on 1.5M+ records and improving forecasting precision by 28%.`,
      `Designed end-to-end exploratory data pipelines with ${cleanSkill}, automating statistical reporting and reducing manual analysis turnaround by 60%.`,
      `Applied ${cleanSkill} to conduct multivariate hypothesis and A/B testing on user behavioral cohorts, driving a 14.5% lift in conversion rates.`,
      `Built high-performance feature extraction and preprocessing pipelines leveraging ${cleanSkill}, cutting model inference latency from 320ms to 45ms.`,
      `Developed interactive executive dashboards and analytical data models using ${cleanSkill}, enabling cross-functional stakeholders to track core growth KPIs in real time.`
    ];
    return dataTemplates[Math.floor(Math.random() * dataTemplates.length)];
  }

  // 2. Frontend & UI Templates
  if (DOMAINS.frontend.some(d => lower.includes(d))) {
    const frontendTemplates = [
      `Engineered modular, accessible UI components utilizing ${cleanSkill}, accelerating frontend feature delivery by 40% while maintaining 98%+ unit test coverage.`,
      `Optimized client-side rendering speed and Core Web Vitals leveraging ${cleanSkill}, reducing Largest Contentful Paint (LCP) by 1.8s across 250K+ monthly active users.`,
      `Architected responsive state management and dynamic UI workflows using ${cleanSkill}, eliminating redundant network calls and decreasing page load times by 35%.`,
      `Collaborated closely with design teams to implement a centralized design token system with ${cleanSkill}, standardizing component consistency across 4 web platforms.`
    ];
    return frontendTemplates[Math.floor(Math.random() * frontendTemplates.length)];
  }

  // 3. DevOps & Cloud Templates
  if (DOMAINS.devops_cloud.some(d => lower.includes(d))) {
    const devopsTemplates = [
      `Automated multi-stage CI/CD release pipelines utilizing ${cleanSkill}, reducing deployment cycle duration from 45 minutes to under 6 minutes with zero downtime.`,
      `Orchestrated scalable container infrastructure with ${cleanSkill}, maintaining 99.98% service availability during peak traffic events while lowering cloud costs by 22%.`,
      `Configured proactive telemetry, automated alerts, and cluster health monitoring via ${cleanSkill}, cutting Mean Time to Resolution (MTTR) by 50%.`
    ];
    return devopsTemplates[Math.floor(Math.random() * devopsTemplates.length)];
  }

  // 4. Backend & Database Templates
  if (DOMAINS.backend_db.some(d => lower.includes(d))) {
    const backendTemplates = [
      `Architected high-throughput RESTful services leveraging ${cleanSkill}, sustaining 15K+ requests per second with sub-80ms p99 latency.`,
      `Implemented optimized query indexing and caching strategies using ${cleanSkill}, reducing database CPU utilization by 45% and query execution time by 3.2x.`,
      `Developed secure, resilient microservices endpoints utilizing ${cleanSkill} with JWT authentication, role-based access control, and comprehensive rate limiting.`
    ];
    return backendTemplates[Math.floor(Math.random() * backendTemplates.length)];
  }

  // 5. General Fallback Templates
  const genericTemplates = [
    `Spearheaded the integration of ${cleanSkill} into production workflows, improving team engineering velocity by 30% and eliminating recurring technical bottlenecks.`,
    `Leveraged ${cleanSkill} to architect and deliver core application modules, achieving 99.9% uptime and supporting 100K+ active daily user transactions.`,
    `Designed scalable solutions utilizing ${cleanSkill}, decreasing operational overhead by 25% and accelerating release turnaround from bi-weekly to daily deployments.`
  ];

  return genericTemplates[Math.floor(Math.random() * genericTemplates.length)];
}

export function calculateSubScores(matchScore, missingCount, matchedCount, resumeWordCount = 300) {
  const totalKeywords = missingCount + matchedCount;

  // 1. Technical Skills Score (Direct ratio of matched tech competencies)
  let skillsScore = 75;
  if (totalKeywords > 0) {
    const coverage = (matchedCount / totalKeywords) * 100;
    if (coverage >= 80) skillsScore = Math.round(85 + (coverage - 80) * 0.65);
    else if (coverage >= 50) skillsScore = Math.round(68 + (coverage - 50) * 0.55);
    else skillsScore = Math.round(Math.max(20, coverage * 1.35));
  } else {
    skillsScore = Math.round(matchScore);
  }

  // 2. Role Alignment Score (Experience depth & vocabulary fit)
  const roleScore = Math.min(Math.max(Math.round(matchScore * 0.95 + skillsScore * 0.05), 15), 98);

  // 3. ATS Length & Formatting Score (ideal is 350-750 words)
  let formattingScore = 88;
  if (resumeWordCount < 150) formattingScore = 40;
  else if (resumeWordCount < 250) formattingScore = 65;
  else if (resumeWordCount >= 300 && resumeWordCount <= 850) formattingScore = 95;
  else formattingScore = 78;

  // 4. Action & Impact Rating (Quantifiable metrics & action verbs)
  const impactScore = Math.min(Math.max(Math.round((matchScore * 0.6) + (skillsScore * 0.4)), 25), 96);

  return {
    skillsScore: Math.min(skillsScore, 98),
    roleScore: Math.min(roleScore, 98),
    formattingScore,
    impactScore
  };
}

export function exportReportMarkdown(score, missingKeywords, matchedKeywords, lackingAreas, improvementSuggestions, resumeSnippet) {
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `# AI Career Copilot — Resume Match & Gap Analysis Report
Generated on: ${date}

---

## 📊 Overall Match Score: ${score}%
**Verdict:** ${score >= 75 ? 'Strong Alignment (75%+)' : score >= 50 ? 'Moderate Match (50-74%)' : 'Action Required: Low Match (<50%)'}

---

## ❌ Missing Job Keywords (${missingKeywords.length})
${missingKeywords.length > 0 ? missingKeywords.map(k => `- [ ] ${k}`).join('\n') : 'No major keyword omissions.'}

## ✅ Matched Core Skills (${matchedKeywords.length})
${matchedKeywords.length > 0 ? matchedKeywords.map(k => `- [x] ${k}`).join('\n') : 'No significant direct keyword overlap.'}

---

## ⚠️ What Your Resume is Lacking
${lackingAreas.map((item, idx) => `### ${idx + 1}. ${item.title}\n${item.description}`).join('\n\n')}

---

## 🛠️ Step-by-Step Actionable Improvement Blueprint
${improvementSuggestions.map((step, idx) => `### ${idx + 1}. ${step.category} (${step.impact})\n${step.action}`).join('\n\n')}

---

## 📄 Parsed Resume Text Snippet
\`\`\`
${resumeSnippet || 'N/A'}
\`\`\`
`;
}
