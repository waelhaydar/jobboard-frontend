'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect } from 'react'
import { useApplicationForm } from '../components/ApplicationFormContext'

export function useNavigationGuard() {
  const router = useRouter()
  const { isInApplicationForm } = useApplicationForm()

  const guardNavigation = useCallback((url: string) => {
    if (isInApplicationForm) {
      // Allow relative navigation (same page anchors, etc.)
      if (url.startsWith('#') || url.startsWith('/')) {
        return true
      }

      // Prevent external navigation
      alert('You are currently filling out an application form. Please complete or cancel your application before accessing other pages.')
      return false
    }
    return true
  }, [isInApplicationForm])

  const navigateSafely = useCallback((url: string) => {
    if (guardNavigation(url)) {
      router.push(url)
    }
  }, [guardNavigation, router])

  const replaceSafely = useCallback((url: string) => {
    if (guardNavigation(url)) {
      router.replace(url)
    }
  }, [guardNavigation, router])

  // Handle browser back/forward buttons
  useEffect(() => {
    if (!isInApplicationForm) return

    const handlePopState = (e: PopStateEvent) => {
      // Allow navigation within the same page
      if (window.location.pathname === document.referrer) {
        return
      }

      // Prevent navigation to other pages
      e.preventDefault()
      alert('You are currently filling out an application form. Please complete or cancel your application before navigating away.')
      // Restore the current URL
      window.history.pushState(null, '', window.location.pathname)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [isInApplicationForm])

  return {
    guardNavigation,
    navigateSafely,
    replaceSafely,
    isInApplicationForm
  }
}
