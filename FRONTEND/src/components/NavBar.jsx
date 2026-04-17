import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from '@tanstack/react-router';
import { logoutUser } from '../api/user.api';
import { logout } from '../store/slice/authSlice';
import { getStoredTheme, setAppTheme } from '../utils/theme';

const Navbar = () => {
  const [theme, setTheme] = useState(getStoredTheme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const onToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    setAppTheme(nextTheme);
  };

  const onLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      // Ignore backend logout failure and clear local auth state anyway.
    } finally {
      dispatch(logout());
      navigate({ to: '/auth' });
    }
  };

  return (
    <nav className="app-navbar">
      <div className="app-navbar-inner">
        <div className="app-navbar-row">
          <div className="app-navbar-brand-wrap">
            <Link to="/" className="app-navbar-brand">
              shorten.io
            </Link>
          </div>

          <div className="app-navbar-actions">
            <button
              type="button"
              className="app-theme-toggle"
              onClick={onToggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="app-navbar-link"
                >
                  Dashboard
                </Link>
                <span className="app-navbar-user">
                  {user?.name ? `Hi, ${user.name}` : 'Signed in'}
                </span>
                <button
                  onClick={onLogout}
                  className="app-btn app-btn-danger px-3 py-2 text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="app-btn app-btn-primary px-3 py-2 text-sm"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;