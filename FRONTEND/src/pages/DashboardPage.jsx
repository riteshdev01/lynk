import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../api/user.api'
import { logout } from '../store/slice/authSlice'
import UrlForm from '../components/UrlForm'
import UserUrl from '../components/UserUrl'
import { getStoredTheme, setAppTheme } from '../utils/theme'

const DashboardPage = () => {
  const [theme, setTheme] = useState(getStoredTheme)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    setAppTheme(theme)
  }, [theme])

  const onLogout = async () => {
    try {
      await logoutUser()
    } catch (error) {
      // Clear local session even if API logout fails.
    } finally {
      dispatch(logout())
      navigate({ to: '/auth' })
    }
  }

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U'

  return (
    <main className={`dashboard-page dashboard-theme--${theme} page-enter`}>
      <aside className="dashboard-sidebar" aria-label="Dashboard navigation">
        <div className="dashboard-brand">
          <span className="dashboard-brand-mark">↗</span>
          <div>
            <p className="dashboard-brand-name">Shorten.io</p>
            <p className="dashboard-brand-subtitle">Workspace</p>
          </div>
        </div>

        <nav className="dashboard-nav">
          <a href="#create-link" className="dashboard-nav-link is-active">Create Link</a>
          <a href="#link-insights" className="dashboard-nav-link">Insights</a>
          <a href="#recent-links" className="dashboard-nav-link">Recent Links</a>
          <Link to="/" className="dashboard-nav-link">Public Home</Link>
        </nav>

        <button className="dashboard-logout" onClick={onLogout} type="button">
          Log out
        </button>
      </aside>

      <section className="dashboard-main">
        <header className="dashboard-topbar">
          <div>
            <p className="dashboard-kicker">Overview</p>
            <h1 className="dashboard-title">Dashboard</h1>
          </div>

          <div className="dashboard-topbar-actions">
            <button
              type="button"
              className="dashboard-theme-toggle"
              onClick={() => setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>

            <div className="dashboard-user-pill" aria-label="Current user">
              <span className="dashboard-user-avatar">{userInitial}</span>
              <div>
                <p className="dashboard-user-name">{user?.name || 'Signed in user'}</p>
                <p className="dashboard-user-email">{user?.email || 'Manage links and analytics'}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          <section id="create-link" className="dashboard-panel">
            <div className="dashboard-panel-head">
              <h2>Create short link</h2>
              <p>Paste your long URL and generate a clean short link.</p>
            </div>
            <UrlForm />
          </section>

          <section id="link-insights" className="dashboard-panel dashboard-panel-flat">
            <UserUrl />
          </section>
        </div>
      </section>
    </main>
  )
}

export default DashboardPage