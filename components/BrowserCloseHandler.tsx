'use client'

import { useEffect } from 'react'

interface BrowserCloseHandlerProps {
  isSignedIn: boolean
}

export default function BrowserCloseHandler({ isSignedIn }: BrowserCloseHandlerProps) {
  useEffect(() => {
    if (!isSignedIn) return

    // Set sessionStorage flag on page load
    sessionStorage.setItem('isPageActive', 'true')

    const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
      const isPageActive = sessionStorage.getItem('isPageActive')
      if (isPageActive) {
        sessionStorage.removeItem('isPageActive')
      } else {
        // Browser/tab close - call logout
        try {
          await fetch('/api/auth/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
          })
        } catch (error) {
          console.error('Logout on browser close failed:', error)
        }
      }
    }

    const handleUnload = () => {
      sessionStorage.removeItem('isPageActive')
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('unload', handleUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('unload', handleUnload)
    }
  }, [isSignedIn])

  return null
}