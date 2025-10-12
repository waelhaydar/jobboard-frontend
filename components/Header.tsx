'use client'

import React from 'react'
import TopMenu from './TopMenu'
import { useAuthModal } from '../components/AuthModalContext'
import CryptoMarketWidget from './CryptoMarketWidget'
import Breadcrumbs from './Breadcrumbs'
import { usePathname } from 'next/navigation'

interface HeaderProps {
  isSignedIn: boolean
  userType: string | null
  employerApproved: boolean | null
  isPending?: boolean
}

export default function Header({ isSignedIn, userType, employerApproved, isPending = false }: HeaderProps) {
  const { openModal } = useAuthModal()
  const pathname = usePathname()

  // Use context with optional chaining to handle cases where provider is not available
  let isInApplicationForm = false
  let jobSlug: string | null = null
  try {
    const ApplicationFormContext = require('./ApplicationFormContext')
    const context = ApplicationFormContext.useApplicationForm()
    isInApplicationForm = context?.isInApplicationForm || false
    jobSlug = context?.jobSlug || null
  } catch (error) {
    // Context not available, use default value
    isInApplicationForm = false
    jobSlug = null
  }

  return (
    <div className="glass-dark">
      <CryptoMarketWidget />


      <TopMenu
        isSignedIn={isSignedIn}
        userType={userType}
        employerApproved={employerApproved}
        onOpenModal={openModal}
        isFixed={false}
        isInApplicationForm={isInApplicationForm}
        isPending={isPending}
       
      />
      {pathname !== '/' && <Breadcrumbs pathname={pathname} jobSlug={jobSlug} />}
    </div>
  )
}
