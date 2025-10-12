'use client'

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react'

interface ApplicationFormContextType {
  isInApplicationForm: boolean
  setIsInApplicationForm: (value: boolean) => void
  showAccessDenied: () => void
  confirmLeaveApplication: () => Promise<boolean>
  jobSlug: string | null;
  setJobSlug: (slug: string | null) => void;
}

const ApplicationFormContext = createContext<ApplicationFormContextType | undefined>(undefined)

interface ApplicationFormProviderProps {
  children: ReactNode
}

export function ApplicationFormProvider({ children }: ApplicationFormProviderProps) {
  const [isInApplicationForm, setIsInApplicationForm] = useState(false)
  const [jobSlug, setJobSlug] = useState<string | null>(null)

  const showAccessDenied = useCallback(() => {
    // Create a custom modal-like alert
    const modal = document.createElement('div')
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'
    const textClass = 'text-gray-300'
    modal.innerHTML = `
      <div class="glass-dark max-w-sm mx-4 p-6 rounded-2xl border border-white/10 text-center">
        <div class="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-2xl">⚠️</span>
        </div>
        <h3 class="text-lg font-semibold text-white mb-2">Application in Progress</h3>
        <p class="${textClass} text-sm mb-4">Please complete or cancel your application before accessing other pages.</p>
        <button onclick="this.closest('.fixed').remove()" class="secondaryButton-dark">
          OK
        </button>
      </div>
    `
    document.body.appendChild(modal)

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (document.body.contains(modal)) {
        document.body.removeChild(modal)
      }
    }, 5000)
  }, [])

  const confirmLeaveApplication = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      const modal = document.createElement('div')
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'
      const textClass = 'text-gray-300'
      modal.innerHTML = `
        <div class="glass-dark max-w-sm mx-4 p-6 rounded-2xl border border-white/10 text-center">
          <div class="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">🚫</span>
          </div>
          <h3 class="text-lg font-semibold text-white mb-2">Leave Application?</h3>
          <p class="${textClass} text-sm mb-4">Your progress will be lost if you leave this page.</p>
          <div class="flex gap-3 justify-center">
            <button id="confirm-leave" class="secondaryButton-dark">
              Leave
            </button>
            <button id="cancel-leave" class="secondaryButton-dark">
              Stay
            </button>
          </div>
        </div>
      `

      const handleConfirm = () => {
        document.body.removeChild(modal)
        resolve(true)
      }

      const handleCancel = () => {
        document.body.removeChild(modal)
        resolve(false)
      }

      modal.querySelector('#confirm-leave')?.addEventListener('click', handleConfirm)
      modal.querySelector('#cancel-leave')?.addEventListener('click', handleCancel)

      document.body.appendChild(modal)
    })
  }, [])

  return (
    <ApplicationFormContext.Provider value={{
      isInApplicationForm,
      setIsInApplicationForm,
      showAccessDenied,
      confirmLeaveApplication,
      jobSlug,
      setJobSlug
    }}>
      {children}
    </ApplicationFormContext.Provider>
  )
}

export function useApplicationForm() {
  const context = useContext(ApplicationFormContext)
  if (context === undefined) {
    throw new Error('useApplicationForm must be used within an ApplicationFormProvider')
  }
  return context
}