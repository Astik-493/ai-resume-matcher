// Pre-configured industry standard job description templates

export const ROLE_CATEGORIES = {
  software: {
    label: '💻 Software & Web',
    roles: [
      {
        id: 'fullstack',
        title: 'Full Stack Engineer',
        skills: ['React', 'Node.js', 'TypeScript', 'Express', 'PostgreSQL', 'REST APIs', 'Docker', 'Git'],
        descriptions: {
          entry: `Junior Full Stack Developer:
• Key Responsibilities:
  - Assist in developing responsive web user interfaces using React and modern JavaScript/TypeScript.
  - Write and maintain backend RESTful APIs using Node.js and Express.
  - Collaborate on database schema design with PostgreSQL and MongoDB.
  - Participate in code reviews, bug fixes, and unit testing.
• Requirements:
  - 0-2 years of software engineering experience or bootcamp/degree equivalent.
  - Solid understanding of HTML5, CSS3, JavaScript (ES6+), and React.
  - Basic knowledge of REST APIs, Git version control, and relational databases.`,
          mid: `Full Stack Engineer:
• Key Responsibilities:
  - Build scalable, responsive web applications utilizing React, TypeScript, and Node.js.
  - Design and integrate RESTful and GraphQL APIs with database persistence (PostgreSQL/MongoDB).
  - Optimize frontend bundle performance and backend throughput.
  - Write comprehensive automated unit and integration tests (Jest, Cypress).
• Requirements:
  - 3+ years of full-stack development experience.
  - Strong proficiency in React, state management (Redux/Zustand), and Node.js.
  - Experience with Docker, CI/CD pipelines, and cloud services (AWS/GCP).`,
          senior: `Senior Full Stack Engineer:
• Key Responsibilities:
  - Architect and lead development of high-throughput web applications with React, TypeScript, and Node.js/Express.
  - Design resilient microservices architectures and distributed database solutions.
  - Mentor junior engineers, establish coding standards, and lead technical design reviews.
  - Oversee CI/CD automation, cloud infrastructure deployment (AWS/Docker/Kubernetes), and performance tuning.
• Requirements:
  - 5+ years of production full-stack engineering experience.
  - Deep mastery of modern JavaScript/TypeScript, React ecosystem, and backend Node.js frameworks.
  - Proven track record in system architecture, database optimization, and high-availability cloud deployments.`
        }
      },
      {
        id: 'frontend',
        title: 'Frontend Engineer (React)',
        skills: ['React', 'TypeScript', 'Next.js', 'CSS3/Tailwind', 'Redux', 'Web Performance', 'Testing Library'],
        descriptions: {
          mid: `Frontend Engineer (React & TypeScript):
• Key Responsibilities:
  - Develop modular, accessible, and high-performance UI components using React and TypeScript.
  - Implement complex state management, client-side routing, and responsive layouts.
  - Collaborate closely with UI/UX designers to translate Figma mockups into pixel-perfect code.
  - Profile and optimize web vitals, bundle size, and rendering speed.
• Requirements:
  - 3+ years of professional frontend web development.
  - Expert proficiency with React, TypeScript, modern CSS, and REST/GraphQL API integration.
  - Familiarity with Jest, React Testing Library, and Webpack/Vite.`
        }
      },
      {
        id: 'backend',
        title: 'Backend Engineer (Python / Node)',
        skills: ['Python', 'FastAPI', 'Node.js', 'PostgreSQL', 'Redis', 'Microservices', 'Docker', 'AWS'],
        descriptions: {
          mid: `Backend Software Engineer:
• Key Responsibilities:
  - Design and maintain robust, high-performance REST and gRPC microservices using Python (FastAPI/Django) or Node.js.
  - Implement efficient database queries, indexing, and data models in PostgreSQL and MongoDB.
  - Implement caching layers using Redis and message queues using Kafka or RabbitMQ.
  - Ensure backend security, authentication (OAuth2/JWT), and data protection.
• Requirements:
  - 3+ years of backend engineering experience.
  - Strong command of Python or Node.js with asynchronous programming paradigms.
  - Experience with SQL performance tuning, containerization (Docker), and cloud deployments.`
        }
      },
      {
        id: 'mobile',
        title: 'Mobile App Developer',
        skills: ['React Native', 'Flutter', 'iOS/Swift', 'Android/Kotlin', 'REST APIs', 'App Store Deployment'],
        descriptions: {
          mid: `Mobile Application Engineer:
• Key Responsibilities:
  - Develop and maintain cross-platform mobile apps using React Native or Flutter for iOS and Android.
  - Integrate native modules, camera APIs, push notifications, and offline storage.
  - Publish and manage app releases on Apple App Store and Google Play Store.
  - Troubleshoot performance issues, UI stutter, and memory management.
• Requirements:
  - 3+ years of production mobile application development.
  - Solid knowledge of React Native or Flutter, mobile UI guidelines, and RESTful API consumption.`
        }
      }
    ]
  },
  ai_data: {
    label: '🤖 AI, ML & Data',
    roles: [
      {
        id: 'ai_ml_eng',
        title: 'AI / Machine Learning Engineer',
        skills: ['Python', 'PyTorch', 'TensorFlow', 'scikit-learn', 'NLP', 'FastAPI', 'Vector DBs', 'LLMs', 'MLOps'],
        descriptions: {
          mid: `Machine Learning Engineer:
• Key Responsibilities:
  - Develop, fine-tune, and deploy machine learning and NLP models into production services.
  - Implement vector search, embeddings, and RAG pipelines using frameworks like LangChain and LlamaIndex.
  - Build scalable model inference microservices with FastAPI and Docker.
  - Monitor model drift, accuracy metrics, and inference latency in production.
• Requirements:
  - 3+ years of experience in ML engineering and applied AI.
  - Strong proficiency in Python, PyTorch/TensorFlow, scikit-learn, and data preprocessing libraries (Pandas, NumPy).
  - Experience with vector databases (Pinecone, Chroma, Milvus) and cloud ML infrastructure.`
        }
      },
      {
        id: 'data_scientist',
        title: 'Data Scientist',
        skills: ['Python', 'SQL', 'Pandas', 'Statistics', 'Machine Learning', 'Data Visualization', 'A/B Testing'],
        descriptions: {
          mid: `Data Scientist:
• Key Responsibilities:
  - Perform exploratory data analysis, statistical modeling, and hypothesis testing on large datasets.
  - Build predictive models to uncover actionable business trends and user behavior patterns.
  - Design and analyze rigorous A/B experiments to measure feature impact.
  - Build interactive visualization dashboards and communicate findings to leadership.
• Requirements:
  - 3+ years of experience in data science, predictive modeling, and statistical analysis.
  - Advanced SQL and Python (Pandas, NumPy, Seaborn, scikit-learn) capabilities.
  - Master's or Bachelor's in Computer Science, Data Science, Statistics, or related STEM field.`
        }
      },
      {
        id: 'data_analyst',
        title: 'Data Analyst / BI Engineer',
        skills: ['SQL', 'Tableau', 'PowerBI', 'Excel', 'Python', 'Data Warehousing', 'ETL', 'Dashboarding'],
        descriptions: {
          mid: `Data Analyst & BI Specialist:
• Key Responsibilities:
  - Write complex SQL queries across data warehouses (BigQuery, Snowflake, Redshift) to aggregate business metrics.
  - Build and maintain executive dashboards using Tableau, Power BI, or Looker.
  - Partner with product and growth teams to track key performance indicators (KPIs) and funnels.
  - Automate routine reporting workflows and ETL pipelines.
• Requirements:
  - 2+ years of experience in data analysis and business intelligence.
  - Expert SQL querying ability and dashboard design expertise.
  - Strong analytical problem-solving and presentation skills.`
        }
      }
    ]
  },
  cloud_devops: {
    label: '☁️ Cloud & DevOps',
    roles: [
      {
        id: 'devops',
        title: 'DevOps / SRE Engineer',
        skills: ['Kubernetes', 'Docker', 'Terraform', 'AWS/GCP', 'CI/CD (GitHub Actions)', 'Linux', 'Prometheus', 'Grafana'],
        descriptions: {
          mid: `DevOps & Site Reliability Engineer (SRE):
• Key Responsibilities:
  - Manage and automate Kubernetes clusters, containerized deployments, and cloud infrastructure with Terraform.
  - Build robust CI/CD pipelines (GitHub Actions, GitLab CI) for zero-downtime releases.
  - Configure monitoring, alerting, and logging systems using Prometheus, Grafana, and ELK stack.
  - Maintain 99.99% system availability, execute incident response, and lead root cause analysis.
• Requirements:
  - 3+ years of DevOps or SRE experience.
  - Expertise with AWS or GCP, Kubernetes, Docker, Infrastructure-as-Code (Terraform), and Linux scripting.`
        }
      },
      {
        id: 'security_analyst',
        title: 'Cybersecurity / SecOps Analyst',
        skills: ['Vulnerability Scanning', 'SIEM', 'Network Security', 'OWASP Top 10', 'Incident Response', 'Compliance (SOC2)'],
        descriptions: {
          mid: `Cybersecurity Analyst:
• Key Responsibilities:
  - Conduct vulnerability assessments, code security audits, and penetration tests.
  - Monitor security event logs (SIEM) and respond rapidly to potential security threats.
  - Ensure application security according to OWASP guidelines and regulatory standards (SOC2, ISO27001).
• Requirements:
  - 3+ years of cybersecurity, SecOps, or information security analysis experience.
  - Familiarity with network protocols, firewall management, and cloud security best practices.`
        }
      }
    ]
  },
  product_design: {
    label: '🚀 Product & Design',
    roles: [
      {
        id: 'product_manager',
        title: 'Technical Product Manager',
        skills: ['Product Strategy', 'Agile/Scrum', 'Roadmapping', 'User Research', 'Data Analysis', 'Jira', 'Cross-functional Leadership'],
        descriptions: {
          mid: `Technical Product Manager:
• Key Responsibilities:
  - Define product vision, technical roadmaps, and detailed user stories for engineering squads.
  - Conduct user interviews, market research, and metric-driven validation to prioritize features.
  - Lead sprint planning, backlog grooming, and cross-functional feature launches.
• Requirements:
  - 3+ years of product management experience for technical SaaS or digital products.
  - Strong understanding of software architecture, APIs, and agile methodologies.`
        }
      },
      {
        id: 'ui_ux_designer',
        title: 'UI/UX Product Designer',
        skills: ['Figma', 'User Research', 'Design Systems', 'Wireframing', 'Prototyping', 'Usability Testing', 'Interaction Design'],
        descriptions: {
          mid: `UI/UX Product Designer:
• Key Responsibilities:
  - Create wireframes, interactive prototypes, and polished design systems in Figma.
  - Conduct user testing and synthesize qualitative feedback into intuitive user interfaces.
  - Collaborate with frontend engineers to guarantee design fidelity and accessibility (WCAG).
• Requirements:
  - 3+ years of product design experience with a strong portfolio showcasing web/mobile apps.
  - Mastery of Figma, auto-layout, design tokens, and component libraries.`
        }
      }
    ]
  }
}

/**
 * Smart Generator: Generates a complete professional Job Description from brief user notes/title
 */
export function generateSmartJobDescription(inputPrompt, seniority = 'mid') {
  if (!inputPrompt || !inputPrompt.trim()) {
    return ''
  }

  const clean = inputPrompt.trim().toLowerCase()

  // Match against known templates if close
  for (const catKey of Object.keys(ROLE_CATEGORIES)) {
    for (const role of ROLE_CATEGORIES[catKey].roles) {
      if (
        clean.includes(role.title.toLowerCase()) ||
        clean.includes(role.id) ||
        role.skills.some(s => clean.includes(s.toLowerCase()))
      ) {
        if (role.descriptions[seniority]) {
          return role.descriptions[seniority]
        }
        if (role.descriptions.mid) {
          return role.descriptions.mid
        }
      }
    }
  }

  // Format customized generated description based on keywords
  const title = inputPrompt.split(/[,.\n]/)[0].trim()
  const expYears = seniority === 'entry' ? '1-2' : seniority === 'senior' ? '5+' : '3-5'
  const levelTitle = seniority === 'entry' ? 'Junior' : seniority === 'senior' ? 'Senior' : ''

  return `${levelTitle ? levelTitle + ' ' : ''}${title.charAt(0).toUpperCase() + title.slice(1)}:

• Role Overview:
  We are looking for a talented professional to join our team to build scalable solutions, collaborate cross-functionally, and drive impactful results based on modern industry standards.

• Key Responsibilities:
  - Design, develop, and maintain core application modules and project deliverables.
  - Collaborate with cross-functional team members (product, engineering, and design) to define clear requirements.
  - Write clean, maintainable, and well-tested code following best engineering practices.
  - Troubleshoot bottlenecks, fix bugs, and continuously improve system performance and reliability.
  - Participate in agile ceremonies, sprint reviews, and technical documentation.

• Qualifications & Requirements:
  - ${expYears} years of hands-on experience in related technology and industry domains.
  - Solid understanding of relevant tools, frameworks, database architectures, and best practices.
  - Demonstrated ability to translate functional requirements into robust, high-quality deliverables.
  - Strong analytical problem-solving skills and effective communication in team environments.
  - Familiarity with Git version control, CI/CD pipelines, and cloud environments.`
}
