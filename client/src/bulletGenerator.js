export function generateTailoredBullet(skill) {
  if (!skill || !skill.trim()) return '';

  const cleanSkill = skill.trim();

  const templates = [
    `Architected and deployed scalable services utilizing ${cleanSkill}, improving system throughput by 32% and reducing endpoint latency from 450ms to 120ms.`,
    `Integrated ${cleanSkill} into existing microservices workflows, automating data processing pipelines and saving 15+ engineering hours per sprint.`,
    `Designed and implemented core application features leveraging ${cleanSkill}, increasing overall test coverage to 92% and accelerating release cycles by 40%.`,
    `Spearheaded the migration of critical backend modules to ${cleanSkill}, achieving 99.95% system uptime while cutting cloud infrastructure costs by 24%.`,
    `Collaborated with cross-functional teams to build and monitor high-volume data streams using ${cleanSkill}, supporting 100K+ daily active users without performance degradation.`
  ];

  // Return a random tailored bullet from the templates
  const randomIndex = Math.floor(Math.random() * templates.length);
  return templates[randomIndex];
}

export function calculateSubScores(matchScore, missingCount, matchedCount, resumeWordCount = 300) {
  // 1. Technical Skills Score
  const totalKeywords = missingCount + matchedCount;
  const skillsScore = totalKeywords > 0 
    ? Math.round((matchedCount / totalKeywords) * 100)
    : Math.round(matchScore);

  // 2. Role Alignment Score (based on cosine similarity)
  const roleScore = Math.min(Math.max(Math.round(matchScore * 1.05), 10), 98);

  // 3. ATS Length & Formatting Score (ideal is 350-700 words)
  let formattingScore = 85;
  if (resumeWordCount < 150) formattingScore = 45;
  else if (resumeWordCount < 250) formattingScore = 65;
  else if (resumeWordCount >= 300 && resumeWordCount <= 800) formattingScore = 95;
  else formattingScore = 75;

  // 4. Action & Impact Rating
  const impactScore = Math.min(Math.max(Math.round((matchScore + skillsScore) / 2), 20), 95);

  return {
    skillsScore,
    roleScore,
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
