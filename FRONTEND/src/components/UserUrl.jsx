import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { deleteUserUrl, getAllUserUrls } from '../api/user.api'
import { queryClient } from '../main'

const UserUrl = () => {
  const shortBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '')
  const { data: urls, isLoading, isError, error } = useQuery({
    queryKey: ['userUrls'],
    queryFn: getAllUserUrls,
    refetchInterval: 30000, // Refetch every 30 seconds to update click counts
    staleTime: 0, // Consider data stale immediately so it refetches when invalidated
  })
  const [copiedId, setCopiedId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [deleteError, setDeleteError] = useState('')

  const displayHost = (() => {
    try {
      return new URL(shortBaseUrl).host
    } catch (parseError) {
      return shortBaseUrl.replace(/^https?:\/\//, '')
    }
  })()

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    
    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopiedId(null)
    }, 2000)
  }

  const handleDelete = async (id) => {
    try {
      setDeletingId(id)
      setDeleteError('')
      await deleteUserUrl(id)
      await queryClient.invalidateQueries({ queryKey: ['userUrls'] })
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete URL.')
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="dashboard-empty-state" role="status" aria-label="Loading your URLs">
        <div className="dashboard-spinner" aria-hidden="true"></div>
        <p>Loading your links...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="app-alert my-4" role="alert">
        Error loading your URLs: {error.message}
      </div>
    )
  }

  if (!urls.urls || urls.urls.length === 0) {
    return (
      <div id="recent-links" className="dashboard-empty-state">
        <p className="dashboard-empty-title">No links yet</p>
        <p>Create your first short link above and it will appear here instantly.</p>
      </div>
    )
  }

  const sortedUrls = [...urls.urls].reverse()
  const totalClicks = sortedUrls.reduce((total, item) => total + (item.clicks || 0), 0)
  const activeLinks = sortedUrls.length
  const averageClicks = activeLinks > 0 ? Math.round((totalClicks / activeLinks) * 10) / 10 : 0

  return (
    <section id="recent-links" className="dashboard-links-wrap">
      <div className="dashboard-panel-head dashboard-panel-head-split">
        <div>
          <h2>Recent links</h2>
          <p>Your latest shortened URLs and their click activity.</p>
        </div>
        <span className="dashboard-host-badge">{displayHost}</span>
      </div>

      <div className="dashboard-stat-grid" aria-label="Summary metrics">
        <article className="dashboard-stat-card">
          <p>Total clicks</p>
          <strong>{totalClicks.toLocaleString()}</strong>
        </article>
        <article className="dashboard-stat-card">
          <p>Active links</p>
          <strong>{activeLinks.toLocaleString()}</strong>
        </article>
        <article className="dashboard-stat-card">
          <p>Avg clicks/link</p>
          <strong>{averageClicks.toLocaleString()}</strong>
        </article>
      </div>

      {deleteError && (
        <div className="app-alert" role="alert">
          {deleteError}
        </div>
      )}

      <div className="dashboard-links-card">
        <div className="dashboard-table-wrap">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Original URL</th>
                <th>Short URL</th>
                <th>Clicks</th>
                <th className="dashboard-cell-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedUrls.map((url) => (
                <tr key={url._id}>
                  <td>
                    <p className="dashboard-url-text" title={url.full_url}>{url.full_url}</p>
                  </td>
                  <td>
                    <a
                      href={`${shortBaseUrl}/${url.short_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="dashboard-short-link"
                    >
                      {`${displayHost}/${url.short_url}`}
                    </a>
                  </td>
                  <td>
                    <span className="dashboard-click-pill">
                      {url.clicks} {url.clicks === 1 ? 'click' : 'clicks'}
                    </span>
                  </td>
                  <td className="dashboard-cell-right">
                    <div className="dashboard-row-actions">
                      <a
                        href={`${shortBaseUrl}/${url.short_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="dashboard-open-inline"
                        aria-label={`Open short URL ${url.short_url} in new tab`}
                      >
                        Open
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopy(`${shortBaseUrl}/${url.short_url}`, url._id)}
                        aria-label={`Copy short URL ${url.short_url}`}
                        className={`dashboard-copy-inline ${copiedId === url._id ? 'is-success' : ''}`}
                        disabled={deletingId === url._id}
                      >
                        {copiedId === url._id ? 'Copied' : 'Copy'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(url._id)}
                        aria-label={`Delete short URL ${url.short_url}`}
                        className="dashboard-delete-inline"
                        disabled={deletingId === url._id}
                      >
                        {deletingId === url._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default UserUrl