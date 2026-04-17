import React, { useState } from 'react'
import { createShortUrl } from '../api/shortUrl.api'
import { useSelector } from 'react-redux'
import { queryClient } from '../main'

const UrlForm = () => {
  const [url, setUrl] = useState('')
  const [shortUrl, setShortUrl] = useState()
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(null)
  const [customSlug, setCustomSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const {isAuthenticated} = useSelector((state) => state.auth)

  const isValidUrl = (value) => {
    try {
      const parsed = new URL(value)
      return parsed.protocol === 'http:' || parsed.protocol === 'https:'
    } catch (error) {
      return false
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!url.trim()) {
      setError('Please enter a URL.')
      return
    }

    if (!isValidUrl(url.trim())) {
      setError('Please enter a valid URL that starts with http:// or https://')
      return
    }

    try {
      setLoading(true)
      const shortUrl = await createShortUrl(url,customSlug)
      setShortUrl(shortUrl)
      queryClient.invalidateQueries({queryKey: ['userUrls']})
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    
    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <form onSubmit={handleSubmit} className="dashboard-url-form">
      <div className="dashboard-field">
        <label htmlFor="url" className="dashboard-label">
          Destination URL
        </label>
        <input
          type="url"
          id="url"
          value={url}
          onInput={(event) => setUrl(event.target.value)}
          placeholder="https://example.com"
          required
          className="dashboard-input"
        />
      </div>

      {isAuthenticated && (
        <div className="dashboard-field">
          <label htmlFor="customSlug" className="dashboard-label">
            Custom alias (optional)
          </label>
          <input
            type="text"
            id="customSlug"
            value={customSlug}
            onChange={(event) => setCustomSlug(event.target.value)}
            placeholder="your-brand-slug"
            className="dashboard-input"
          />
        </div>
      )}

      <div className="dashboard-form-actions">
        <button
          type="submit"
          disabled={loading}
          className="dashboard-submit"
        >
          {loading ? 'Creating...' : 'Shorten URL'}
        </button>
      </div>

      {error && (
        <div className="app-alert mt-3" role="alert">
          {error}
        </div>
      )}

      {shortUrl && (
        <div className="dashboard-short-result" aria-live="polite">
          <p className="dashboard-result-label">Shortened URL</p>
          <div className="dashboard-result-row">
            <input
              type="text"
              readOnly
              value={shortUrl}
              className="dashboard-result-input"
            />
            <div className="dashboard-result-actions">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="dashboard-open-btn"
              >
                Open
              </a>
              <button
                type="button"
                onClick={handleCopy}
                className={`dashboard-copy-btn ${copied ? 'is-success' : ''}`}
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  )
}

export default UrlForm