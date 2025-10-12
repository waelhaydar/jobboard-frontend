'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import SignInSignUpModal from './SignInSignUpModal'

interface AuthModalContextType {
  isModalOpen: boolean;
  openModal: (jobId?: string, initialUserType?: 'candidate' | 'employer') => void; // Update openModal signature
  closeModal: () => void;
  jobId: string | undefined;
  initialUserType: 'candidate' | 'employer'; // Add initialUserType to context type
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined)

export const AuthModalProvider = ({ children, isSignedIn }: { children: ReactNode; isSignedIn?: boolean }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [jobId, setJobId] = useState<string | undefined>(undefined)
  const [initialUserType, setInitialUserType] = useState<'candidate' | 'employer'>('candidate') // State for initial user type

  const openModal = (id?: string, userType?: 'candidate' | 'employer') => {
    setIsModalOpen(true)
    setJobId(id)
    if (userType) {
      setInitialUserType(userType)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setJobId(undefined)
    setInitialUserType('candidate') // Reset to default on close
  }

  return (
    <AuthModalContext.Provider value={{ isModalOpen, openModal, closeModal, jobId, initialUserType }}>
      {children}
      <SignInSignUpModal
        isSignedIn={false} // Assuming this is always false for the modal itself
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        jobId={jobId}
        initialUserType={initialUserType} // Pass initialUserType to the modal
      />
    </AuthModalContext.Provider>
  )
}

export const useAuthModal = () => {
  const context = useContext(AuthModalContext)
  if (context === undefined) {
    throw new Error('useAuthModal must be used within an AuthModalProvider')
  }
  return context
}