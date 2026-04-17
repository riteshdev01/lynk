import React, { useState } from 'react';
import { loginUser } from '../api/user.api';
import { useDispatch } from 'react-redux';
import { login } from '../store/slice/authSlice.js';
import { useNavigate } from '@tanstack/react-router';

const LoginForm = ({ state }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = await loginUser(password, email);
            dispatch(login(data.user));
            navigate({ to: '/dashboard' });
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="premium-form">
            <header className="premium-form-head">
                <p className="premium-form-kicker">Shorten.io access portal</p>
                <h2 className="premium-form-title">Sign in to shorten.io</h2>
                <p className="premium-form-copy">Enter your credentials to manage your ecosystem.</p>
            </header>

            {error && (
                <div className="premium-error" role="alert">
                    {error}
                </div>
            )}

            <div className="premium-field">
                <label className="premium-label" htmlFor="email">
                    Email address
                </label>
                <div className="premium-input-wrap">
                    <span className="premium-input-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 6h16v12H4z" />
                            <path d="m4 7 8 6 8-6" />
                        </svg>
                    </span>
                    <input
                        className="premium-input"
                        id="email"
                        type="email"
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="premium-field">
                <div className="premium-field-row">
                    <label className="premium-label" htmlFor="password">
                        Password
                    </label>
                    <button className="premium-link-btn" type="button" aria-label="Forgot password">
                        Forgot password?
                    </button>
                </div>

                <div className="premium-input-wrap">
                    <span className="premium-input-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="4" y="10" width="16" height="10" rx="2" />
                            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                        </svg>
                    </span>
                    <input
                        className="premium-input premium-input-password"
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        className="premium-password-toggle"
                        type="button"
                        onClick={() => setShowPassword((currentValue) => !currentValue)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                            {showPassword ? (
                                <>
                                    <path d="M3 3l18 18" />
                                    <path d="M10.6 10.6A2 2 0 0 0 13.4 13.4" />
                                    <path d="M7.5 7.7A10.7 10.7 0 0 1 12 6c5.5 0 9.5 6 9.5 6a20.4 20.4 0 0 1-4.1 4.5" />
                                    <path d="M6.3 6.3A20.7 20.7 0 0 0 2.5 12s4 6 9.5 6a11 11 0 0 0 4-0.8" />
                                </>
                            ) : (
                                <>
                                    <path d="M2.5 12S6.5 6 12 6s9.5 6 9.5 6-4 6-9.5 6-9.5-6-9.5-6Z" />
                                    <circle cx="12" cy="12" r="3" />
                                </>
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            <div className="premium-actions">
                <label className="premium-remember">
                    <input type="checkbox" />
                    <span>Remember me</span>
                </label>
            </div>

            <button className="premium-submit" type="submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Continue'}
            </button>

            <div className="premium-switch">
                <span>New to shorten.io?</span>
                <button type="button" className="premium-switch-link" onClick={() => state(false)}>
                    Request access
                </button>
            </div>
        </form>
    );
};

export default LoginForm;