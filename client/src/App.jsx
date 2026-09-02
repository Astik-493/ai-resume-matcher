import { useState, useRef } from 'react'
import axios from 'axios'
import {
  UploadCloud,
  FileText,
  Sparkles,
  AlertCircle,
  X,
  Loader2,
  CheckCircle2,
  Briefcase,
  Layers,
  Copy,
  Check,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  XCircle,
  Wand2,
  LayoutGrid,
  Edit3,
  RotateCcw,
  Compass,
  History,
  Download,
  Trash2,
  Zap
} from 'lucide-react'
import { ROLE_CATEGORIES, generateSmartJobDescription } from './jobTemplates'
import { analyzeGapsAndImprovements } from './analysisEngine'
import { generateTailoredBullet, calculateSubScores, exportReportMarkdown } from './bulletGenerator'
import './App.css'

function App() {
  const [file, setFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)
  const [copiedBullet, setCopiedBullet] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  // JD Assistant state
  const [jdTab, setJdTab] = useState('presets') // 'presets' | 'ai_prompt' | 'custom'
  const [aiPrompt, setAiPrompt] = useState('')
  const [selectedSeniority, setSelectedSeniority] = useState('mid')
  const [selectedRole, setSelectedRole] = useState('fullstack')
  const [isGeneratingJd, setIsGeneratingJd] = useState(false)

  // Live Bullet Generator state
  const [selectedBulletSkill, setSelectedBulletSkill] = useState('')
  const [generatedBullet, setGeneratedBullet] = useState('')

  // History state
  const [showHistory, setShowHistory] = useState(false)
  const [historyList, setHistoryList] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  const fileInputRef = useRef(null)

  // Fetch match history from MongoDB Atlas
  const fetchHistory = async () => {
    setLoadingHistory(true)
    try {
      const res = await axios.get('http://localhost:5001/api/history')
      setHistoryList(res.data || [])
    } catch (err) {
      console.error('Failed to fetch history:', err)
    } finally {
      setLoadingHistory(false)
    }
  }

  const handleDeleteHistory = async (id, e) => {
    e.stopPropagation()
    try {
      await axios.delete(`http://localhost:5001/api/history/${id}`)
      setHistoryList((prev) => prev.filter((item) => item._id !== id))
    } catch (err) {
      console.error('Failed to delete history item:', err)
    }
  }

  // Handle PDF file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf' && !selectedFile.name.endsWith('.pdf')) {
        setError('Please upload a valid PDF document.')
        return
      }
      setFile(selectedFile)
      setError(null)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      if (droppedFile.type !== 'application/pdf' && !droppedFile.name.endsWith('.pdf')) {
        setError('Please upload a valid PDF document.')
        return
      }
      setFile(droppedFile)
      setError(null)
    }
  }

  const handleRemoveFile = (e) => {
    e.stopPropagation()
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Role Preset Selection
  const handleSelectRolePreset = (role) => {
    setSelectedRole(role.id)
    const desc = role.descriptions[selectedSeniority] || role.descriptions.mid || Object.values(role.descriptions)[0]
    setJobDescription(desc)
  }

  // AI Auto-generate / expand from brief notes
  const handleAiGenerateJd = () => {
    if (!aiPrompt.trim()) {
      const generated = generateSmartJobDescription(selectedRole, selectedSeniority)
      setJobDescription(generated)
      return
    }

    setIsGeneratingJd(true)
    setTimeout(() => {
      const generated = generateSmartJobDescription(aiPrompt, selectedSeniority)
      setJobDescription(generated)
      setIsGeneratingJd(false)
    }, 300)
  }

  // Main Scan API call
  const handleScan = async (e) => {
    e.preventDefault()

    if (!file) {
      setError('Please upload your resume PDF before scanning.')
      return
    }

    if (!jobDescription.trim()) {
      setError('Please provide or auto-generate a job description.')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('job_description', jobDescription.trim())

      const response = await axios.post('http://localhost:5001/api/match', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setResult(response.data)
    } catch (err) {
      console.error('Scan error:', err)
      const message =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        'Failed to connect to the backend server. Make sure the server is running on http://localhost:5001.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleResetAll = () => {
    setFile(null)
    setJobDescription('')
    setResult(null)
    setError(null)
    setAiPrompt('')
    setSelectedRole('')
    setGeneratedBullet('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleCopySnippet = (text) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyBullet = (text) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopiedBullet(true)
    setTimeout(() => setCopiedBullet(false), 2000)
  }

  const handleGenerateBulletForSkill = (skill) => {
    setSelectedBulletSkill(skill)
    const bullet = generateTailoredBullet(skill, selectedRole)
    setGeneratedBullet(bullet)
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
  }

  // Score calculation & visual attributes
  const score = result?.match_score ?? 0
  const radius = 78
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (Math.min(Math.max(score, 0), 100) / 100) * circumference

  const getScoreColor = (val) => {
    if (val >= 75) return '#10b981' // Emerald
    if (val >= 50) return '#f59e0b' // Amber
    return '#f43f5e' // Rose
  }

  const getScoreBadge = (val) => {
    if (val >= 75) {
      return {
        label: 'Strong Match (75%+)',
        class: 'status-high-match',
        icon: <CheckCircle2 size={16} />,
        headline: '🌟 Outstanding ATS & Skill Alignment!',
        explanation:
          'Your resume exhibits high keyword correlation and strong domain coverage with this job description. Minor polish will make you an elite candidate.'
      }
    }
    if (val >= 50) {
      return {
        label: 'Moderate Match (50-74%)',
        class: 'status-mid-match',
        icon: <TrendingUp size={16} />,
        headline: '⚡ Solid Base — Targeted Optimization Needed',
        explanation:
          'Your profile contains good foundational overlap, but several key frameworks, responsibilities, or bullet points need tighter alignment.'
      }
    }
    return {
      label: 'Low Match (<50%)',
      class: 'status-low-match',
      icon: <AlertTriangle size={16} />,
      headline: '⚠️ Action Required: Key Gaps Detected',
      explanation:
        'Your resume is missing core skills and keywords prioritized in this posting. Follow the step-by-step blueprint below to bridge the gap.'
    }
  }

  const badgeInfo = getScoreBadge(score)

  // Robust analysis derivation: merge backend data with client-side NLP engine
  const fallbackAnalysis = analyzeGapsAndImprovements(
    result?.resume_snippet || '',
    jobDescription,
    score
  )

  const missingKeywords = (result?.missing_keywords && result.missing_keywords.length > 0)
    ? result.missing_keywords
    : fallbackAnalysis.missing_keywords

  const matchedKeywords = (result?.matched_keywords && result.matched_keywords.length > 0)
    ? result.matched_keywords
    : fallbackAnalysis.matched_keywords

  const lackingAreas = (result?.lacking_areas && result.lacking_areas.length > 0)
    ? result.lacking_areas
    : fallbackAnalysis.lacking_areas

  const improvementSuggestions = (result?.improvement_suggestions && result.improvement_suggestions.length > 0)
    ? result.improvement_suggestions
    : fallbackAnalysis.improvement_suggestions

  // Multi-Pillar Sub-Scores
  const subScores = calculateSubScores(
    score,
    missingKeywords.length,
    matchedKeywords.length,
    result?.word_count?.resume || 300
  )

  // Export report handler
  const handleExportReport = () => {
    const markdown = exportReportMarkdown(
      score,
      missingKeywords,
      matchedKeywords,
      lackingAreas,
      improvementSuggestions,
      result?.resume_snippet
    )
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `resume_match_report_${score}pct.md`
    link.click()
  }

  return (
    <div className="app-viewport">
      <div className="ambient-glow ambient-glow-1"></div>
      <div className="ambient-glow ambient-glow-2"></div>
      <div className="ambient-glow ambient-glow-3"></div>

      <div className="main-layout">
        {/* Top Navbar */}
        <nav className="top-navbar">
          <div className="brand-identity">
            <div className="brand-icon-wrap">
              <Sparkles size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 className="brand-title">AI Career Copilot</h1>
                <span className="brand-badge">PRO</span>
              </div>
            </div>
          </div>

          <div className="nav-actions">
            <div className="status-indicator">
              <span className="status-dot"></span>
              <span>NLP Match Engine Ready</span>
            </div>

            <button
              className="btn-nav-action"
              onClick={() => {
                fetchHistory()
                setShowHistory(true)
              }}
              title="View Scan History"
            >
              <History size={15} />
              <span>History</span>
            </button>

            {(file || jobDescription || result) && (
              <button className="btn-nav-action" onClick={handleResetAll}>
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <header className="hero-section">
          <div className="hero-pill">
            <Compass size={14} />
            <span>Intelligent Resume &amp; Role Alignment Scanner</span>
          </div>

          <h2 className="hero-headline">
            Optimize Your Resume for <span className="hero-gradient-highlight">Any Career Opportunity</span>
          </h2>

          <p className="hero-description">
            Upload your resume and choose or auto-generate a targeted job description. Our AI analyzes semantic keyword coverage, detects critical skill deficits, and builds a customized improvement blueprint.
          </p>
        </header>

        {/* Alert Error Banner */}
        {error && (
          <div className="alert-error">
            <AlertCircle size={22} color="#fb7185" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div className="alert-content">
              <div className="alert-title">Analysis Failed</div>
              <p className="alert-msg">{error}</p>
            </div>
            <button
              className="btn-close-alert"
              onClick={() => setError(null)}
              title="Dismiss error"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Input Workspace Grid */}
        <div className="workspace-grid">
          {/* Resume Upload Panel */}
          <div className="glass-panel">
            <div className="panel-header">
              <div className="panel-title-wrap">
                <div className="panel-icon-box">
                  <FileText size={20} />
                </div>
                <h3 className="panel-title">1. Upload Resume</h3>
              </div>
              <span className="panel-tag">PDF Only</span>
            </div>

            <div
              className={`resume-dropzone ${isDragging ? 'active' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden-file-input"
                onChange={handleFileChange}
              />

              <div className="dropzone-icon-circle">
                <UploadCloud size={32} />
              </div>

              <p className="dropzone-headline">
                <span>Click to browse</span> or drag &amp; drop
              </p>
              <p className="dropzone-subline">Select your existing PDF resume</p>
            </div>

            {file && (
              <div className="selected-file-card">
                <div className="file-info-group">
                  <div className="file-badge-icon">
                    <FileText size={20} />
                  </div>
                  <div className="file-text-details">
                    <div className="file-filename" title={file.name}>
                      {file.name}
                    </div>
                    <span className="file-filesize">{formatFileSize(file.size)}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-remove-selected"
                  onClick={handleRemoveFile}
                  title="Remove file"
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Job Description & Smart Generator Panel */}
          <div className="glass-panel">
            <div className="panel-header">
              <div className="panel-title-wrap">
                <div className="panel-icon-box">
                  <Briefcase size={20} />
                </div>
                <h3 className="panel-title">2. Target Job Description</h3>
              </div>
              <span className="panel-tag">Smart Assistant</span>
            </div>

            {/* Assistant Sub-Tabs */}
            <div className="jd-tab-bar">
              <button
                type="button"
                className={`jd-tab-btn ${jdTab === 'presets' ? 'active' : ''}`}
                onClick={() => setJdTab('presets')}
              >
                <LayoutGrid size={15} />
                <span>1-Click Roles</span>
              </button>
              <button
                type="button"
                className={`jd-tab-btn ${jdTab === 'ai_prompt' ? 'active' : ''}`}
                onClick={() => setJdTab('ai_prompt')}
              >
                <Wand2 size={15} />
                <span>AI Generator</span>
              </button>
              <button
                type="button"
                className={`jd-tab-btn ${jdTab === 'custom' ? 'active' : ''}`}
                onClick={() => setJdTab('custom')}
              >
                <Edit3 size={15} />
                <span>Edit Text</span>
              </button>
            </div>

            {/* Tab 1: Popular Role Presets */}
            {jdTab === 'presets' && (
              <div className="roles-preset-container">
                {Object.entries(ROLE_CATEGORIES).map(([catKey, category]) => (
                  <div key={catKey} className="role-category-block">
                    <div className="category-label">{category.label}</div>
                    <div className="roles-chips-grid">
                      {category.roles.map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          className={`role-chip ${selectedRole === r.id ? 'selected' : ''}`}
                          onClick={() => handleSelectRolePreset(r)}
                        >
                          <Sparkles size={12} color="#818cf8" />
                          <span>{r.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 2: AI Prompt & Auto-Expand */}
            {jdTab === 'ai_prompt' && (
              <div className="ai-expander-box">
                <div className="ai-expander-header">
                  <Wand2 size={16} />
                  <span>Generate Complete Description from Short Notes</span>
                </div>
                <input
                  type="text"
                  className="ai-expander-prompt-input"
                  placeholder="e.g. Full stack developer with React, Node.js, and Postgres..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAiGenerateJd()
                    }
                  }}
                />

                <div className="seniority-selector-row">
                  <span className="seniority-label">Seniority Level:</span>
                  <div className="seniority-buttons">
                    <button
                      type="button"
                      className={`btn-seniority ${selectedSeniority === 'entry' ? 'active' : ''}`}
                      onClick={() => setSelectedSeniority('entry')}
                    >
                      Junior (0-2y)
                    </button>
                    <button
                      type="button"
                      className={`btn-seniority ${selectedSeniority === 'mid' ? 'active' : ''}`}
                      onClick={() => setSelectedSeniority('mid')}
                    >
                      Mid-Level (3-5y)
                    </button>
                    <button
                      type="button"
                      className={`btn-seniority ${selectedSeniority === 'senior' ? 'active' : ''}`}
                      onClick={() => setSelectedSeniority('senior')}
                    >
                      Senior (5+y)
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-ai-generate"
                  onClick={handleAiGenerateJd}
                  disabled={isGeneratingJd}
                >
                  {isGeneratingJd ? (
                    <>
                      <Loader2 size={16} className="spin-loader" />
                      <span>Generating Requirements...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>Generate Full Job Description</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Textarea View */}
            <div className="jd-textarea-wrap">
              <textarea
                className="jd-rich-textarea"
                placeholder="Click a role above or paste a job description with responsibilities and requirements..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={jdTab === 'custom' ? 10 : 6}
              />
              <div className="jd-footer-info">
                <span>{jobDescription.trim().length} characters • {jobDescription.trim() ? jobDescription.trim().split(/\s+/).length : 0} words</span>
                <span>{jobDescription ? '✅ Description Ready' : '⚡ Select a role or type above'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scan Button Action */}
        <div className="action-center">
          <button
            type="button"
            className="btn-primary-scan"
            onClick={handleScan}
            disabled={loading || !file || !jobDescription.trim()}
          >
            <div className="btn-shimmer"></div>
            {loading ? (
              <>
                <Loader2 size={24} className="spin-loader" />
                <span>Extracting Text &amp; Calculating Match...</span>
              </>
            ) : (
              <>
                <Sparkles size={24} />
                <span>Scan &amp; Analyze Resume Match</span>
              </>
            )}
          </button>
        </div>

        {/* Results Hub */}
        {result && (
          <div className="results-container">
            {/* Score & Verdict Hero Banner */}
            <div className="score-hero-banner">
              <div className="score-hero-layout">
                {/* Score Gauge */}
                <div className="gauge-box">
                  <div className="gauge-svg-holder">
                    <svg className="gauge-canvas" viewBox="0 0 200 200">
                      <circle
                        className="gauge-track-path"
                        cx="100"
                        cy="100"
                        r={radius}
                        strokeWidth="15"
                        fill="transparent"
                      />
                      <circle
                        className="gauge-progress-path"
                        cx="100"
                        cy="100"
                        r={radius}
                        strokeWidth="15"
                        fill="transparent"
                        stroke={getScoreColor(score)}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                      />
                    </svg>
                    <div className="gauge-center-content">
                      <span className="gauge-big-num">
                        {score}
                        <span style={{ fontSize: '1.5rem', color: '#94a3b8' }}>%</span>
                      </span>
                      <span className="gauge-label-text">Match Score</span>
                    </div>
                  </div>
                </div>

                {/* Score Details Side */}
                <div className="score-meta-side">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <div className={`score-status-pill ${badgeInfo.class}`}>
                      {badgeInfo.icon}
                      <span>{badgeInfo.label}</span>
                    </div>

                    <button
                      type="button"
                      className="btn-nav-action"
                      onClick={handleExportReport}
                      title="Download full analysis as Markdown"
                    >
                      <Download size={14} />
                      <span>Export Report</span>
                    </button>
                  </div>

                  <h3 className="score-main-headline">{badgeInfo.headline}</h3>
                  <p className="score-main-desc">{badgeInfo.explanation}</p>

                  <div className="quick-stats-row">
                    <div className="stat-capsule">
                      <XCircle size={20} color="#f43f5e" />
                      <div>
                        <div className="stat-capsule-val">{missingKeywords.length}</div>
                        <div className="stat-capsule-name">Missing Keywords</div>
                      </div>
                    </div>

                    <div className="stat-capsule">
                      <CheckCircle size={20} color="#10b981" />
                      <div>
                        <div className="stat-capsule-val">{matchedKeywords.length}</div>
                        <div className="stat-capsule-name">Matched Skills</div>
                      </div>
                    </div>

                    {result.word_count && (
                      <div className="stat-capsule">
                        <FileText size={20} color="#818cf8" />
                        <div>
                          <div className="stat-capsule-val">{result.word_count.resume}</div>
                          <div className="stat-capsule-name">Resume Words</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Multi-Pillar Sub-Scores Progress */}
              <div className="subscores-grid">
                <div className="subscore-box">
                  <div className="subscore-header">
                    <span className="subscore-title">🎯 Technical Skills</span>
                    <span className="subscore-value">{subScores.skillsScore}%</span>
                  </div>
                  <div className="subscore-bar-bg">
                    <div
                      className="subscore-bar-fill"
                      style={{ width: `${subScores.skillsScore}%`, background: '#6366f1' }}
                    ></div>
                  </div>
                </div>

                <div className="subscore-box">
                  <div className="subscore-header">
                    <span className="subscore-title">🏢 Role Experience</span>
                    <span className="subscore-value">{subScores.roleScore}%</span>
                  </div>
                  <div className="subscore-bar-bg">
                    <div
                      className="subscore-bar-fill"
                      style={{ width: `${subScores.roleScore}%`, background: '#a855f7' }}
                    ></div>
                  </div>
                </div>

                <div className="subscore-box">
                  <div className="subscore-header">
                    <span className="subscore-title">📐 ATS Density</span>
                    <span className="subscore-value">{subScores.formattingScore}%</span>
                  </div>
                  <div className="subscore-bar-bg">
                    <div
                      className="subscore-bar-fill"
                      style={{ width: `${subScores.formattingScore}%`, background: '#06b6d4' }}
                    ></div>
                  </div>
                </div>

                <div className="subscore-box">
                  <div className="subscore-header">
                    <span className="subscore-title">⚡ Impact Rating</span>
                    <span className="subscore-value">{subScores.impactScore}%</span>
                  </div>
                  <div className="subscore-bar-bg">
                    <div
                      className="subscore-bar-fill"
                      style={{ width: `${subScores.impactScore}%`, background: '#10b981' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Interactive Resume Bullet Point Optimizer */}
            <div className="bullet-generator-card">
              <div className="bullet-gen-header">
                <div className="bullet-gen-title-group">
                  <div className="panel-icon-box" style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc' }}>
                    <Zap size={20} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#ffffff' }}>
                      AI Resume Bullet Tailorer (Google XYZ Formula)
                    </h4>
                    <p style={{ margin: '3px 0 0 0', fontSize: '0.825rem', color: '#94a3b8' }}>
                      Click any missing skill below to auto-generate a high-impact, ATS-optimized accomplishment bullet:
                    </p>
                  </div>
                </div>
              </div>

              <div className="bullet-gen-chips-row">
                {missingKeywords.slice(0, 8).map((skill, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`bullet-skill-chip ${selectedBulletSkill === skill ? 'active' : ''}`}
                    onClick={() => handleGenerateBulletForSkill(skill)}
                  >
                    <Sparkles size={12} color="#c084fc" />
                    <span>Generate for {skill}</span>
                  </button>
                ))}
              </div>

              {generatedBullet && (
                <div className="generated-bullet-box">
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#c084fc', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      ✨ Optimized Bullet Point ({selectedBulletSkill}):
                    </span>
                    <p className="bullet-text-rendered">"{generatedBullet}"</p>
                  </div>
                  <button
                    type="button"
                    className="btn-copy-code"
                    onClick={() => handleCopyBullet(generatedBullet)}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {copiedBullet ? (
                      <>
                        <Check size={14} color="#10b981" />
                        <span style={{ color: '#10b981' }}>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copy Bullet</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Two Column: Keywords Analysis with Search Filter */}
            <div className="two-col-grid">
              {/* Missing Keywords Box */}
              <div className="detail-card">
                <div className="detail-card-header">
                  <div className="detail-card-title-group">
                    <XCircle size={20} color="#f43f5e" />
                    <h4 className="detail-card-title">Missing Job Keywords</h4>
                  </div>
                  <span className="panel-tag" style={{ color: '#fb7185' }}>
                    {missingKeywords.length} Absent
                  </span>
                </div>

                <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 0.85rem 0' }}>
                  These key competencies in the job description were not found in your resume:
                </p>

                {missingKeywords.length > 0 ? (
                  <div className="keywords-badge-cloud">
                    {missingKeywords.map((kw, idx) => (
                      <span
                        key={idx}
                        className="badge-missing"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleGenerateBulletForSkill(kw)}
                        title="Click to generate bullet point"
                      >
                        <X size={12} /> {kw}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.875rem', color: score >= 75 ? '#34d399' : '#fca5a5' }}>
                    {score >= 75
                      ? '🎉 Great job! No major keyword omissions detected.'
                      : '⚠️ Major vocabulary gap: Your resume does not contain key terms from this job post.'}
                  </p>
                )}
              </div>

              {/* Matched Keywords Box */}
              <div className="detail-card">
                <div className="detail-card-header">
                  <div className="detail-card-title-group">
                    <CheckCircle size={20} color="#10b981" />
                    <h4 className="detail-card-title">Matched Core Skills</h4>
                  </div>
                  <span className="panel-tag" style={{ color: '#34d399' }}>
                    {matchedKeywords.length} Present
                  </span>
                </div>

                <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 0.85rem 0' }}>
                  Successfully identified competencies that match the role requirements:
                </p>

                {matchedKeywords.length > 0 ? (
                  <div className="keywords-badge-cloud">
                    {matchedKeywords.map((kw, idx) => (
                      <span key={idx} className="badge-matched">
                        <Check size={12} /> {kw}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                    No significant direct keyword overlap found yet.
                  </p>
                )}
              </div>
            </div>

            {/* Two Column: What is Lacking vs Improvement Blueprint */}
            <div className="two-col-grid">
              {/* What the Resume is Lacking */}
              <div className="detail-card">
                <div className="detail-card-header">
                  <div className="detail-card-title-group">
                    <AlertTriangle size={20} color="#fbbf24" />
                    <h4 className="detail-card-title">What Your Resume is Lacking</h4>
                  </div>
                </div>

                <div className="lacking-items-list">
                  {lackingAreas.length > 0 ? (
                    lackingAreas.map((item, idx) => (
                      <div key={idx} className="lacking-row-item">
                        <AlertCircle size={18} className="lacking-row-icon" />
                        <div>
                          <div className="lacking-row-title">{item.title}</div>
                          <p className="lacking-row-desc">{item.description}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: '0.875rem', color: score >= 75 ? '#34d399' : '#fca5a5' }}>
                      {score >= 75
                        ? '🎉 No critical deficits found. Your resume demonstrates solid role alignment.'
                        : '⚠️ Low alignment detected: Your resume is missing core competencies and required frameworks for this role.'}
                    </p>
                  )}
                </div>
              </div>

              {/* Actionable Improvement Blueprint */}
              <div className="detail-card">
                <div className="detail-card-header">
                  <div className="detail-card-title-group">
                    <Lightbulb size={20} color="#818cf8" />
                    <h4 className="detail-card-title">Actionable Improvement Guide</h4>
                  </div>
                </div>

                <div className="improvement-steps-list">
                  {improvementSuggestions.length > 0 ? (
                    improvementSuggestions.map((step, idx) => (
                      <div key={idx} className="improvement-step-item">
                        <div className="step-num-pill">{idx + 1}</div>
                        <div className="step-content-area">
                          <div className="step-top-row">
                            <span className="step-category-name">{step.category}</span>
                            <span className="impact-tag">{step.impact}</span>
                          </div>
                          <p className="step-action-desc">{step.action}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: '0.875rem', color: score >= 75 ? '#cbd5e1' : '#fca5a5' }}>
                      {score >= 75
                        ? 'Your profile matches closely with the target role. Continue to refine specific achievements for submission.'
                        : 'Recommended: Add missing tech stack keywords, restructure your skills section, and quantify your project impacts using the Google XYZ formula.'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Parsed Resume Content */}
            <div className="detail-card">
              <div className="detail-card-header">
                <div className="detail-card-title-group">
                  <Layers size={18} color="#818cf8" />
                  <h4 className="detail-card-title">Parsed Resume Content</h4>
                </div>
                <button
                  type="button"
                  className="btn-copy-code"
                  onClick={() =>
                    handleCopySnippet(result.resume_snippet || result.parsed_text || '')
                  }
                >
                  {copied ? (
                    <>
                      <Check size={14} color="#10b981" />
                      <span style={{ color: '#10b981' }}>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy Snippet</span>
                    </>
                  )}
                </button>
              </div>
              <div className="parsed-snippet-box">
                {result.resume_snippet ||
                  result.parsed_text ||
                  'No extracted text available.'}
              </div>
            </div>
          </div>
        )}

        {/* History Modal */}
        {showHistory && (
          <div className="modal-overlay" onClick={() => setShowHistory(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title">
                  <History size={20} color="#818cf8" />
                  <span>Recent Scans History (MongoDB Atlas)</span>
                </div>
                <button
                  className="btn-close-alert"
                  onClick={() => setShowHistory(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body">
                {loadingHistory ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <Loader2 size={24} className="spin-loader" />
                    <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Loading past scans...</p>
                  </div>
                ) : historyList.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                    <p style={{ color: '#94a3b8' }}>No previous scans recorded yet.</p>
                  </div>
                ) : (
                  historyList.map((item) => (
                    <div key={item._id} className="history-item-row">
                      <div style={{ textAlign: 'left', flex: 1 }}>
                        <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem' }}>
                          {item.jobDescription.split('\n')[0].substring(0, 50) || 'Job Match Scan'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                          {new Date(item.createdAt).toLocaleString()} • {item.missingKeywords?.length || 0} missing keywords
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div
                          className="history-score-tag"
                          style={{
                            color: getScoreColor(item.matchScore),
                            background: `${getScoreColor(item.matchScore)}15`
                          }}
                        >
                          {item.matchScore}%
                        </div>
                        <button
                          type="button"
                          className="btn-remove-selected"
                          onClick={(e) => handleDeleteHistory(item._id, e)}
                          title="Delete from history"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App