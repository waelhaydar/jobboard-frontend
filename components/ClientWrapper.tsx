'use client'

import React, { ReactNode } from 'react'
import { AuthModalProvider } from './AuthModalContext'

interface ClientWrapperProps {
  children: ReactNode
  isSignedIn: boolean
}

export default function ClientWrapper({ children, isSignedIn }: ClientWrapperProps) {
  return (
    <AuthModalProvider isSignedIn={isSignedIn}>
      {children}
    </AuthModalProvider>
  )
}
