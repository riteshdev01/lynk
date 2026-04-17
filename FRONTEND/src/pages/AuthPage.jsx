import React, { useEffect, useState } from 'react'
import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'
import { getStoredTheme, setAppTheme } from '../utils/theme'

const AuthPage = () => {
    const [login, setLogin] = useState(true)
    const [theme, setTheme] = useState(getStoredTheme)

    useEffect(() => {
        setAppTheme(theme)
    }, [theme])

    return (
        <main className={`premium-auth premium-auth--${theme} page-enter`}>
            <div className="premium-auth-glow premium-auth-glow-top" />
            <div className="premium-auth-glow premium-auth-glow-bottom" />

            <button
                type="button"
                className="premium-theme-toggle"
                onClick={() => setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
                {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>

            <section className="premium-auth-main">
                <div className="premium-auth-shell">
                    <header className="premium-brand">
                        <div className="premium-brand-icon">link</div>
                        <div>
                            <h1 className="premium-brand-title">shorten.io</h1>
                            <p className="premium-brand-subtitle">Link management portal</p>
                        </div>
                    </header>

                    <section className="premium-card" aria-label="Authentication form">
                        {login ? <LoginForm state={setLogin} /> : <RegisterForm state={setLogin} />}
                    </section>

                    <p className="premium-legal">By continuing, you agree to our Terms and Privacy Policy.</p>
                </div>
            </section>

            <footer className="premium-footer" aria-label="Footer">
                <p className="premium-footer-copy">Copyright 2026 shorten.io. All rights reserved.</p>
            </footer>
        </main>
    )
}

export default AuthPage