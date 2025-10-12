'use client'

import React, { useCallback, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useApplicationForm } from './ApplicationFormContext'
import { useGlobalPreloader } from '../lib/usePreloader'

interface LinkGuardProps {
  href: string
  children: React.ReactNode
  className?: string
  onAccessDenied?: () => void
  disabledClassName?: string
}

export default function LinkGuard({
  href,
  children,
  className = '',
  onAccessDenied,
  disabledClassName = 'opacity-50 cursor-not-allowed pointer-events-none'
}: LinkGuardProps) {
  const { isInApplicationForm } = useApplicationForm()
  const { show, hide } = useGlobalPreloader()
  const pathname = usePathname()

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (isInApplicationForm) {
      e.preventDefault()
      e.stopPropagation()

      if (onAccessDenied) {
        onAccessDenied()
      } else {
        alert('You are currently filling out an application form. Please complete or cancel your application before accessing other pages.')
      }
      return false
    }
    show('Loading page...')
    // Hide preloader after a short delay, as there isn't a direct way to know when the new page content is fully rendered in a client component.
    // The useEffect below will also hide it when the pathname changes.
    setTimeout(() => hide(), 1000)
    return true
  }, [isInApplicationForm, onAccessDenied, show, hide])

  useEffect(() => {
    // Hide preloader when the pathname changes, indicating a new page has loaded.
    hide()
  }, [pathname, hide])

  // Check if this is a relative link (internal navigation)
  const isRelativeLink = href.startsWith('/') || href.startsWith('#')

  // If in application form and it's not a relative link, disable it
  if (isInApplicationForm && !isRelativeLink) {
    return (
      <span className={`${className} ${disabledClassName}`}>
        {children}
      </span>
    )
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  )
}
