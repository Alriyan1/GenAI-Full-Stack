import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'

const Register = () => {
    const navigate = useNavigate()
    const [ username, setUsername ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ error, setError ] = useState("")
    const [ isSubmitting, setIsSubmitting ] = useState(false)

    const { loading, handleRegister } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        if (!username.trim() || !email.trim() || !password.trim()) {
            setError("Please fill in all required fields.")
            return
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.")
            return
        }

        setIsSubmitting(true)
        try {
            await handleRegister({
                username: username.trim(),
                email: email.trim(),
                password
            })
            navigate("/")
        } catch (err) {
            setError(err.message || "Failed to register account. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="auth-page">
            {/* Brand Logo */}
            <div className="auth-brand">
                <div className="brand-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                </div>
                <span className="brand-title">PrepAI</span>
                <span className="brand-badge">STUDIO</span>
            </div>

            {/* Form Card */}
            <div className="form-container">
                <div className="form-header">
                    <h1>Create Account</h1>
                    <p>Start mastering your technical and behavioral interviews</p>
                </div>

                {error && (
                    <div className="auth-alert">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Full Name or Username</label>
                        <div className="input-wrapper">
                            <span className="input-icon">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </span>
                            <input
                                onChange={(e) => {
                                    setUsername(e.target.value)
                                    if (error) setError("")
                                }}
                                value={username}
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Alex Morgan"
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">Email Address</label>
                        <div className="input-wrapper">
                            <span className="input-icon">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                            </span>
                            <input
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                    if (error) setError("")
                                }}
                                value={email}
                                type="email"
                                id="email"
                                name="email"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrapper">
                            <span className="input-icon">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                            </span>
                            <input
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                    if (error) setError("")
                                }}
                                value={password}
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Minimum 6 characters"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || loading}
                        className="auth-submit-btn"
                    >
                        {isSubmitting ? (
                            <>
                                <span className="spinner spinner--small" />
                                <span>Creating Account...</span>
                            </>
                        ) : (
                            <span>Create Free Account</span>
                        )}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account? <Link to="/login">Sign In</Link>
                </p>
            </div>
        </main>
    )
}

export default Register