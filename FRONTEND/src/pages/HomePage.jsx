
import React from 'react'
import UrlForm from '../components/UrlForm'

const HomePage = () => {
  return (
    <main className="app-shell page-enter home-page">
      <section className="app-card home-card max-w-xl p-6 sm:p-8">
        <p className="home-kicker mb-2 text-xs font-semibold uppercase tracking-[0.2em]">
          Fast Link Management
        </p>
        <h1 className="home-title mb-2 text-3xl font-bold sm:text-4xl">Shorten links with confidence</h1>
        <p className="home-copy mb-6 text-sm sm:text-base">
          Create compact links instantly, keep sharing clean, and move from raw URLs to a polished workflow.
        </p>
        <UrlForm/>
      </section>
    </main>
  )
}

export default HomePage