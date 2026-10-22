import React, { useState, useEffect } from 'react'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate, useParams, Link } from 'react-router'

const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Questions', icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>) },
    { id: 'behavioral', label: 'Behavioral Questions', icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>) },
    { id: 'roadmap', label: 'Preparation Road Map', icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>) },
]

// ── Sub-components ────────────────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
    const [ open, setOpen ] = useState(index === 0)
    const [ copied, setCopied ] = useState(false)

    const handleCopy = (e) => {
        e.stopPropagation()
        navigator.clipboard.writeText(item.question)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className={`q-card ${open ? 'q-card--open' : ''}`}>
            <div className='q-card__header' onClick={() => setOpen(o => !o)}>
                <span className='q-card__index'>Q{index + 1}</span>
                <p className='q-card__question'>{item.question}</p>
                <div className='q-card__actions'>
                    <button
                        type='button'
                        onClick={handleCopy}
                        className='q-card__copy-btn'
                        title='Copy question to clipboard'
                    >
                        {copied ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3fb950" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                        ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                        )}
                    </button>
                    <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </span>
                </div>
            </div>

            {open && (
                <div className='q-card__body'>
                    <div className='q-card__section'>
                        <div className='q-card__section-header'>
                            <span className='q-card__tag q-card__tag--intention'>Interviewer Intention</span>
                        </div>
                        <p className='q-card__text'>{item.intention}</p>
                    </div>

                    <div className='q-card__section'>
                        <div className='q-card__section-header'>
                            <span className='q-card__tag q-card__tag--answer'>Framework & Model Answer</span>
                        </div>
                        <p className='q-card__text'>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day }) => (
    <div className='roadmap-day'>
        <div className='roadmap-day__header'>
            <span className='roadmap-day__badge'>Day {day.day}</span>
            <h3 className='roadmap-day__focus'>{day.focus}</h3>
        </div>
        <ul className='roadmap-day__tasks'>
            {(day.tasks || []).map((task, i) => (
                <li key={i}>
                    <span className='roadmap-day__bullet' />
                    <span>{task}</span>
                </li>
            ))}
        </ul>
    </div>
)

// ── Main Component ────────────────────────────────────────────────────────────
const Interview = () => {
    const [ activeNav, setActiveNav ] = useState('technical')
    const [ isDownloading, setIsDownloading ] = useState(false)
    const { report, getReportById, loading, getResumePdf } = useInterview()
    const { interviewId } = useParams()

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [ interviewId ])

    const handleDownloadResume = async () => {
        if (!interviewId || isDownloading) return
        setIsDownloading(true)
        try {
            await getResumePdf(interviewId)
        } catch (err) {
            console.error("Resume download error:", err)
        } finally {
            setIsDownloading(false)
        }
    }

    if (loading && !report) {
        return (
            <main className='loading-screen'>
                <div className='spinner' />
                <h1>Loading your intelligence report...</h1>
            </main>
        )
    }

    if (!report) {
        return (
            <main className='loading-screen'>
                <h1>Interview Strategy Report Not Found</h1>
                <p style={{ color: '#7d8590', fontSize: '0.9rem' }}>The requested report ID may have expired or belongs to another user session.</p>
                <Link to="/" className='button primary-button' style={{ marginTop: '1rem' }}>
                    ← Back to Studio Dashboard
                </Link>
            </main>
        )
    }

    const techQuestions = report.technicalQuestions || []
    const behavQuestions = report.behavioralQuestions || []
    const prepPlan = report.preparationPlan || []
    const skillGaps = report.skillGaps || []

    const scoreColor =
        (report.matchScore || 0) >= 80 ? 'score--high' :
            (report.matchScore || 0) >= 60 ? 'score--mid' : 'score--low'

    return (
        <div className='interview-page'>
            {/* Top Workspace Bar */}
            <header className='report-topbar'>
                <div className='report-topbar__left'>
                    <Link to="/" className='back-link'>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                        <span>Dashboard</span>
                    </Link>
                    <span className='report-topbar__sep'>/</span>
                    <h1 className='report-title'>{report.title || 'Technical Role Strategy Report'}</h1>
                </div>

                <div className='report-topbar__right'>
                    <div className={`match-badge ${scoreColor}`}>
                        <span>{report.matchScore ?? 0}% Match Score</span>
                    </div>
                </div>
            </header>

            {/* 3-Column Studio Layout */}
            <div className='interview-layout'>

                {/* ── Left Navigation ── */}
                <nav className='interview-nav'>
                    <div className="nav-content">
                        <p className='interview-nav__label'>Report Sections</p>

                        <button
                            className={`interview-nav__item ${activeNav === 'technical' ? 'interview-nav__item--active' : ''}`}
                            onClick={() => setActiveNav('technical')}
                        >
                            <span className='interview-nav__icon'>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="16 18 22 12 16 6" />
                                    <polyline points="8 6 2 12 8 18" />
                                </svg>
                            </span>
                            <span className='interview-nav__text'>Technical</span>
                            <span className='interview-nav__badge'>{techQuestions.length}</span>
                        </button>

                        <button
                            className={`interview-nav__item ${activeNav === 'behavioral' ? 'interview-nav__item--active' : ''}`}
                            onClick={() => setActiveNav('behavioral')}
                        >
                            <span className='interview-nav__icon'>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                </svg>
                            </span>
                            <span className='interview-nav__text'>Behavioral</span>
                            <span className='interview-nav__badge'>{behavQuestions.length}</span>
                        </button>

                        <button
                            className={`interview-nav__item ${activeNav === 'roadmap' ? 'interview-nav__item--active' : ''}`}
                            onClick={() => setActiveNav('roadmap')}
                        >
                            <span className='interview-nav__icon'>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polygon points="3 11 22 2 13 21 11 13 3 11" />
                                </svg>
                            </span>
                            <span className='interview-nav__text'>Road Map</span>
                            <span className='interview-nav__badge'>{prepPlan.length}d</span>
                        </button>
                    </div>

                    <button
                        onClick={handleDownloadResume}
                        disabled={isDownloading}
                        className='resume-download-btn'
                    >
                        {isDownloading ? (
                            <>
                                <span className='spinner spinner--small' />
                                <span>Generating PDF...</span>
                            </>
                        ) : (
                            <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                                <span>Export Resume PDF</span>
                            </>
                        )}
                    </button>
                </nav>

                <div className='interview-divider' />

                {/* ── Center Content ── */}
                <main className='interview-content'>
                    {activeNav === 'technical' && (
                        <section className='content-section'>
                            <div className='content-header'>
                                <div>
                                    <h2>Technical Questions</h2>
                                    <p className='content-sub'>High-probability questions tailored to the job description and candidate experience level.</p>
                                </div>
                                <span className='content-header__count'>{techQuestions.length} Questions</span>
                            </div>

                            <div className='q-list'>
                                {techQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'behavioral' && (
                        <section className='content-section'>
                            <div className='content-header'>
                                <div>
                                    <h2>Behavioral Questions</h2>
                                    <p className='content-sub'>Scenario and STAR framework questions assessing leadership, collaboration, and culture fit.</p>
                                </div>
                                <span className='content-header__count'>{behavQuestions.length} Questions</span>
                            </div>

                            <div className='q-list'>
                                {behavQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'roadmap' && (
                        <section className='content-section'>
                            <div className='content-header'>
                                <div>
                                    <h2>Preparation Road Map</h2>
                                    <p className='content-sub'>Structured day-by-day revision milestones focused on high-impact target concepts.</p>
                                </div>
                                <span className='content-header__count'>{prepPlan.length} Days</span>
                            </div>

                            <div className='roadmap-list'>
                                {prepPlan.map((day) => (
                                    <RoadMapDay key={day.day} day={day} />
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                <div className='interview-divider' />

                {/* ── Right Sidebar ── */}
                <aside className='interview-sidebar'>
                    {/* Match Score Meter */}
                    <div className='sidebar-card match-score-card'>
                        <p className='sidebar-label'>Profile Alignment</p>
                        <div className={`match-score-ring ${scoreColor}`}>
                            <span className='match-score-val'>{report.matchScore ?? 0}</span>
                            <span className='match-score-symbol'>%</span>
                        </div>
                        <p className='match-score-sub'>
                            {(report.matchScore || 0) >= 80 ? 'Exceptional Match' : (report.matchScore || 0) >= 60 ? 'Competitive Candidate' : 'Foundation to Build'}
                        </p>
                    </div>

                    {/* Skill Gaps */}
                    <div className='sidebar-card skill-gaps-card'>
                        <div className='sidebar-card-header'>
                            <p className='sidebar-label'>Diagnosed Skill Gaps</p>
                            <span className='gaps-count'>{skillGaps.length}</span>
                        </div>

                        <div className='skill-gaps__list'>
                            {skillGaps.length > 0 ? (
                                skillGaps.map((gap, i) => (
                                    <div key={i} className={`skill-tag skill-tag--${gap.severity || 'medium'}`}>
                                        <span className='severity-dot' />
                                        <span className='skill-name'>{gap.skill}</span>
                                        <span className='severity-label'>{gap.severity || 'medium'}</span>
                                    </div>
                                ))
                            ) : (
                                <p className='empty-gaps'>No critical gaps identified.</p>
                            )}
                        </div>
                    </div>

                    {/* Quick Stats Summary */}
                    <div className='sidebar-card stats-summary-card'>
                        <p className='sidebar-label'>Strategy Overview</p>
                        <div className='stats-grid'>
                            <div className='stat-cell'>
                                <span className='stat-num'>{techQuestions.length}</span>
                                <span className='stat-desc'>Tech Qs</span>
                            </div>
                            <div className='stat-cell'>
                                <span className='stat-num'>{behavQuestions.length}</span>
                                <span className='stat-desc'>Behavioral</span>
                            </div>
                            <div className='stat-cell'>
                                <span className='stat-num'>{prepPlan.length}</span>
                                <span className='stat-desc'>Plan Days</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}

export default Interview