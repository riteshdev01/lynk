import React from 'react'
import { Outlet, useRouterState } from '@tanstack/react-router'
import Navbar from './components/NavBar'

const RootLayout = () => {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  const showNavbar = pathname !== '/auth' && pathname !== '/dashboard'

  return (
    <>
      {showNavbar ? <Navbar /> : null}
      <Outlet/>
    </>
  )
}

export default RootLayout