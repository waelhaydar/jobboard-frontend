'use client'

import React, { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useApplicationForm } from './ApplicationFormContext'
import { ApplicationFormHeader } from './ApplicationFormHeader'
import { PendingRegistrationHeader } from './PendingRegistrationHeader'
import { NavigationItem } from './NavigationItem'
import { MENU_ITEMS, UserType } from '../app/constants/menuConfig'

const NotificationPoller = dynamic(() => import('./NotificationPoller'), { ssr: false })

interface TopMenuProps {
  isSignedIn: boolean
  userType: UserType
  employerApproved: boolean | null
  onOpenModal: (jobId?: string, initialUserType?: 'candidate' | 'employer') => void
  isFixed?: boolean
  isInApplicationForm?: boolean
  isPending?: boolean
}

const TopMenu: React.FC<TopMenuProps> = ({
  isSignedIn,
  userType,
  employerApproved,
  onOpenModal,
  isFixed = false,
  isInApplicationForm = false,
  isPending = false,
}) => {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { showAccessDenied } = useApplicationForm()

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout failed', error)
    } finally {
      setIsLoggingOut(false)
    }
  }, [router])

  const getNavigationItems = useCallback(() => {
    const items = [...MENU_ITEMS.COMMON]
    
    if (!isSignedIn) return items
    
    // Add profile link based on user type
    if (userType === 'employer') {
      items.push({ href: '/employer/profile', label: 'Profile' })
    } else if (userType === 'candidate') {
      items.push({ href: '/candidate/profile', label: 'Profile' })
    }
    
    // Add role-specific links
    if (userType === 'employer' && employerApproved !== false) {
      items.push(
        { href: '/employer', label: 'Dashboard' },
        { href: '/employer/applications', label: 'Applications' }
      )
    } else if (userType === 'admin') {
      items.push({ href: '/admin', label: 'Admin' })
    }
    
    return items
  }, [isSignedIn, userType, employerApproved])

  // Handle restricted states
  if (userType === 'candidate' && isInApplicationForm) {
    return <ApplicationFormHeader onLogout={handleLogout} isLoggingOut={isLoggingOut} />
  }

  if (userType === 'candidate' && isPending) {
    return <PendingRegistrationHeader onLogout={handleLogout} isLoggingOut={isLoggingOut} />
  }

  const navigationItems = getNavigationItems()

  return (
    <header className={`relative max-w-7xl mx-auto top-0 left-0 right-0 transition-all duration-500 p-4 md:p-6 flex justify-between items-center px-4 sm:px-6 lg:px-8 z-50 ${isFixed ? 'fixed bg-background/80 backdrop-blur-md' : ''}`}>
      <div className="flex items-center space-x-6">
        {navigationItems.map((item) => (
          <NavigationItem
            key={`${item.href}-${item.label}`}
            href={item.href}
            label={item.label}
            isLogo={item.isLogo}
            onAccessDenied={showAccessDenied}
          />
        ))}
      </div>
      
      <div className="flex items-center space-x-4">
        {isSignedIn ? (
          <>
            <NotificationPoller />
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-lg bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </>
        ) : (
          <button
            onClick={() => onOpenModal()}
            className="signInButton"
          >
            Sign In
              <div className="hoverEffect">
    <div></div>
  </div>
          </button>
        )}
      </div>
    </header>
  )
}

export default TopMenu
