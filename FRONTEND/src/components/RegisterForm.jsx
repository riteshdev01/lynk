import React, { useState } from 'react';
import { registerUser } from '../api/user.api';
import { useDispatch } from 'react-redux';
import { login } from '../store/slice/authSlice';
import { useNavigate } from '@tanstack/react-router';

const RegisterForm = ({state}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();    
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const data = await registerUser(name, password, email);
      dispatch(login(data.user))
      navigate({to:"/dashboard"})
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="premium-form">
      <header className="premium-form-head">
        <p className="premium-form-kicker">Request access</p>
        <h2 className="premium-form-title">Create account</h2>
        <p className="premium-form-copy">Set up your identity to manage links and monitor performance.</p>
      </header>

      {error && (
        <div className="premium-error" role="alert">
          {error}
        </div>
      )}

      <div className="premium-field">
        <label className="premium-label" htmlFor="name">
          Full name
        </label>
        <div className="premium-input-wrap">
          <span className="premium-input-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" />
              <path d="M4 20a8 8 0 0 1 16 0" />
            </svg>
          </span>
          <input
            className="premium-input"
            id="name"
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
      </div>

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
        <label className="premium-label" htmlFor="password">
          Password
        </label>
        <div className="premium-input-wrap">
          <span className="premium-input-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="10" width="16" height="10" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>
          </span>
          <input
            className="premium-input"
            id="password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
      </div>

      <button
        className="premium-submit"
        type="submit"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Request Access'}
      </button>

      <div className="premium-switch">
        <span>Already have an account?</span>
        <button type="button" className="premium-switch-link" onClick={() => state(true)}>
          Sign in
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;