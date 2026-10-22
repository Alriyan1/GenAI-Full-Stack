import React, { useState, useRef } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useAuth } from '../../auth/hooks/useAuth'
import { useNavigate, Link } from 'react-router'

const SAMPLE_JD = `Role: Senior Full Stack Engineer (React & Node.js)

Key Responsibilities:
• Architect, design, and implement end-to-end web applications with high throughput and low latency.
• Build reusable, responsive front-end components using React, modern CSS, and state management.
• Design secure, scalable REST & GraphQL APIs using Node.js, Express, and MongoDB/PostgreSQL.
• Implement authentication, RBAC, caching layers (Redis), and database query optimizations.
• Write clean, testable code with high unit/integration test coverage.

Requirements:
• 3+ years of professional software engineering experience.
• Strong command of JavaScript, TypeScript, React, Node.js, and modern async patterns.
• Experience with cloud deployments, Docker, Git workflows, and CI/CD pipelines.`

const SAMPLE_SELF = `Full Stack Developer with 3 years of hands-on experience building web applications using React, Node.js, Express, and MongoDB. Recently led the architecture of an AI-driven workflow tool that reduced report generation latency by 45%. Proficient in asynchronous architecture, RESTful API design, database indexing, and automated testing. Eager to showcase large-scale system design and clean code craftsmanship.`

const Home = () => {
    const { user, handleLogout } = useAuth()
    const { loading, generateReport, reports = [] } = useInterview()
    const [ jobDescription, setJobDescription ] = useState("")
    const [ selfDescription, setSelfDescription ] = useState("")
    const [ selectedFile, setSelectedFile ] = useState(null)
    const [ isDragging, setIsDragging ] = useState(false)
    const [ isGenerating, setIsGenerating ] = useState(false)
    const [ error, setError ] = useState("")

    const resumeInputRef = useRef(null)
    const navigate = useNavigate()

    const handleFileValidationAndSet = (file) => {
        setError("")
        if (!file) return

        const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
        if (!isPdf) {
            setError("Please upload a valid PDF document.")
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("File size exceeds 5MB limit. Please upload a smaller PDF.")
            return
        }

        setSelectedFile(file)
    }

    const handleFileChange = (e) => {
        const file = e.target.files?.[ 0 ]
        handleFileValidationAndSet(file)
    }

    const handleRemoveFile = (e) => {
        if (e) e.stopPropagation()
        setSelectedFile(null)
        if (resumeInputRef.current) {
            resumeInputRef.current.value = ""
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
        const file = e.dataTransfer?.files?.[ 0 ]
        handleFileValidationAndSet(file)
    }

    const handleLoadSample = () => {
        setJobDescription(SAMPLE_JD)
        setSelfDescription(SAMPLE_SELF)
        setError("")
    }

    const handleClear = () => {
        setJobDescription("")
        setSelfDescription("")
        handleRemoveFile()
        setError("")
    }

    const formatFileSize = (bytes) => {
        if (!bytes) return "0 B"
        if (bytes < 1024) return `${bytes} B`
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    }

    const handleGenerateReport = async () => {
        setError("")

        if (!jobDescription.trim()) {
            setError("Target Job Description is required to generate targeted interview questions.")
            return
        }

        if (!selectedFile && !selfDescription.trim()) {
            setError("Please upload your Resume (PDF) or provide a Quick Self-Description to personalize your strategy.")
            return
        }

        setIsGenerating(true)
        try {
            const data = await generateReport({
                jobDescription: jobDescription.trim(),
                selfDescription: selfDescription.trim(),
                resumeFile: selectedFile
            })

            if (data && data._id) {
                navigate(`/interview/${data._id}`)
            } else {
                throw new Error("Report generation completed without a valid report ID.")
            }
        } catch (err) {
            console.error("Failed to generate report:", err)
            setError(err.message || "Failed to generate interview strategy. Please try again.")
        } finally {
            setIsGenerating(false)
        }
    }

    if (loading && !isGenerating && (!reports || reports.length === 0)) {
        return (
            <main className='loading-screen'>
                <div className='spinner' />
                <h1>Loading your interview workspace...</h1>
            </main>
        )
    }

    return (
        <div className='home-page'>
            {/* Ambient Background Glows */}
            <div className='bg-glow bg-glow-left' />
            <div className='bg-glow bg-glow-right' />

            {/* Top Navigation Bar */}
            <header className='top-navbar'>
                <div className='nav-container'>
                    <Link to="/" className='brand'>
                        <div className='brand-icon'>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                            </svg>
                        </div>
                        <div className='brand-text'>
                            <span className='brand-name'>PrepAI</span>
                            <span className='brand-badge'>STUDIO</span>
                        </div>
                    </Link>

                    <div className='nav-actions'>
                        <div className='model-indicator'>
                            <span className='status-dot' />
                            <span className='model-name'>Gemini 3 Flash AI</span>
                        </div>

                        {user && (
                            <div className='user-profile'>
                                <div className='avatar'>
                                    {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <span className='username'>{user.username || user.email}</span>
                                <button onClick={handleLogout} className='logout-btn' title='Sign out'>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                        <polyline points="16 17 21 12 16 7" />
                                        <line x1="21" y1="12" x2="9" y2="12" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className='hero-section'>
                <div className='hero-badge'>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span>AI-Powered Precision Interview Preparation</span>
                </div>
                <h1 className='hero-title'>
                    Master Your Next Role with <span className='gradient-text'>Targeted Prep</span>
                </h1>
                <p className='hero-subtitle'>
                    Provide the job requirements and your candidate profile. Our AI synthesizes high-yield technical questions, behavioral frameworks, skill gap diagnosis, and an actionable road map.
                </p>
            </section>

            {/* Workspace Main Area */}
            <main className='workspace-container'>
                {/* Error Banner */}
                {error && (
                    <div className='alert-banner alert-banner--error'>
                        <div className='alert-content'>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            <span>{error}</span>
                        </div>
                        <button onClick={() => setError("")} className='alert-close' title='Dismiss error'>✕</button>
                    </div>
                )}

                {/* Studio Card */}
                <div className='interview-card'>
                    {/* Header Controls */}
                    <div className='interview-card__header'>
                        <div className='header-tabs'>
                            <span className='tab-pill'>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                    <line x1="8" y1="21" x2="16" y2="21" />
                                    <line x1="12" y1="17" x2="12" y2="21" />
                                </svg>
                                Strategy Configuration
                            </span>
                        </div>

                        <div className='quick-actions'>
                            <button
                                type='button'
                                onClick={handleLoadSample}
                                className='action-link'
                                title='Autofill sample job description and profile'
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="16" y1="13" x2="8" y2="13" />
                                    <line x1="16" y1="17" x2="8" y2="17" />
                                </svg>
                                Load Sample
                            </button>

                            {(jobDescription || selfDescription || selectedFile) && (
                                <button
                                    type='button'
                                    onClick={handleClear}
                                    className='action-link danger'
                                    title='Clear inputs'
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="3 6 5 6 21 6" />
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                    </svg>
                                    Reset
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Studio Body */}
                    <div className='interview-card__body'>
                        {/* Left Panel - Job Description */}
                        <div className='panel panel--left'>
                            <div className='panel__header'>
                                <span className='panel__icon'>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                    </svg>
                                </span>
                                <h2>Target Job Description</h2>
                                <span className='badge badge--required'>Required</span>
                            </div>

                            <textarea
                                value={jobDescription}
                                onChange={(e) => {
                                    setJobDescription(e.target.value)
                                    if (error) setError("")
                                }}
                                className='panel__textarea'
                                placeholder={`Paste the target job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, large-scale system design, and performance profiling...'`}
                                maxLength={5000}
                                rows={14}
                            />
                            <div className='char-counter'>{jobDescription.length.toLocaleString()} / 5,000 chars</div>
                        </div>

                        {/* Vertical Divider */}
                        <div className='panel-divider' />

                        {/* Right Panel - Profile */}
                        <div className='panel panel--right'>
                            <div className='panel__header'>
                                <span className='panel__icon'>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                </span>
                                <h2>Your Profile</h2>
                            </div>

                            {/* Upload Resume */}
                            <div className='upload-section'>
                                <label className='section-label'>
                                    Upload Candidate Resume
                                    <span className='badge badge--best'>Best Results</span>
                                </label>

                                <input
                                    ref={resumeInputRef}
                                    hidden
                                    type='file'
                                    id='resume'
                                    name='resume'
                                    accept='.pdf,application/pdf'
                                    onChange={handleFileChange}
                                />

                                {!selectedFile ? (
                                    <label
                                        className={`dropzone ${isDragging ? 'is-dragging' : ''}`}
                                        htmlFor='resume'
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                    >
                                        <span className='dropzone__icon'>
                                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="16 16 12 12 8 16" />
                                                <line x1="12" y1="12" x2="12" y2="21" />
                                                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                                            </svg>
                                        </span>
                                        <p className='dropzone__title'>Click to browse or drop resume</p>
                                        <p className='dropzone__subtitle'>PDF Document • Up to 5 MB</p>
                                    </label>
                                ) : (
                                    <div className='file-preview-card'>
                                        <div className='file-preview-info'>
                                            <span className='file-badge'>PDF</span>
                                            <div className='file-meta'>
                                                <span className='file-name' title={selectedFile.name}>{selectedFile.name}</span>
                                                <span className='file-size'>{formatFileSize(selectedFile.size)} • Ready for analysis</span>
                                            </div>
                                        </div>
                                        <button
                                            type='button'
                                            onClick={handleRemoveFile}
                                            className='remove-file-btn'
                                            title='Remove attached resume'
                                        >
                                            ✕
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* OR Divider */}
                            <div className='or-divider'><span>OR</span></div>

                            {/* Quick Self-Description */}
                            <div className='self-description'>
                                <label className='section-label' htmlFor='selfDescription'>
                                    Quick Self-Description
                                </label>
                                <textarea
                                    value={selfDescription}
                                    onChange={(e) => {
                                        setSelfDescription(e.target.value)
                                        if (error) setError("")
                                    }}
                                    id='selfDescription'
                                    name='selfDescription'
                                    className='panel__textarea panel__textarea--short'
                                    placeholder="Briefly describe your standout skills, projects, and years of experience if you don't have a resume handy..."
                                    rows={5}
                                />
                            </div>

                            {/* Info Box */}
                            <div className='info-box'>
                                <span className='info-box__icon'>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="12" stroke="#1a1f27" strokeWidth="2" />
                                        <line x1="12" y1="16" x2="12.01" y2="16" stroke="#1a1f27" strokeWidth="2" />
                                    </svg>
                                </span>
                                <p>Either a <strong>Resume</strong> or a <strong>Self Description</strong> is used by the AI model to personalize question difficulty and identify skill gaps.</p>
                            </div>
                        </div>
                    </div>

                    {/* Card Footer */}
                    <div className='interview-card__footer'>
                        <span className='footer-info'>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            AI Strategy Generation &bull; Approx 15–25s
                        </span>

                        <button
                            onClick={handleGenerateReport}
                            disabled={isGenerating || !jobDescription.trim()}
                            className='generate-btn'
                        >
                            {isGenerating ? (
                                <>
                                    <span className='spinner spinner--small' />
                                    <span>Synthesizing Strategy Report...</span>
                                </>
                            ) : (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                                    </svg>
                                    <span>Generate Interview Strategy</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Recent Reports Section */}
                {reports && reports.length > 0 && (
                    <section className='recent-reports'>
                        <h2 className='section-title'>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            Your Prepared Interview Plans ({reports.length})
                        </h2>

                        <ul className='reports-list'>
                            {reports.map((rep) => (
                                <li
                                    key={rep._id}
                                    className='report-item'
                                    onClick={() => navigate(`/interview/${rep._id}`)}
                                >
                                    <div className='report-card-top'>
                                        <h3>{rep.title || 'Target Role Strategy'}</h3>
                                        <svg className='open-arrow' width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="5" y1="12" x2="19" y2="12" />
                                            <polyline points="12 5 19 12 12 19" />
                                        </svg>
                                    </div>
                                    <p className='report-meta'>Created on {new Date(rep.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                    <span className={`match-badge ${(rep.matchScore || 0) >= 80 ? 'score--high' : (rep.matchScore || 0) >= 60 ? 'score--mid' : 'score--low'}`}>
                                        Match Score: {rep.matchScore ?? 0}%
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Page Footer */}
                <footer className='page-footer'>
                    <a href='#'>Privacy Policy</a>
                    <a href='#'>Terms of Service</a>
                    <a href='#'>Documentation</a>
                    <a href='#'>AI Safety & Ethics</a>
                </footer>
            </main>
        </div>
    )
}

export default Home