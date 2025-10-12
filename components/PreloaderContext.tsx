'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface PreloaderContextType {
  isLoading: boolean
  showPreloader: (text?: string) => void
  hidePreloader: () => void
  loadingText: string
}

const PreloaderContext = createContext<PreloaderContextType | undefined>(undefined)

interface PreloaderProviderProps {
  children: ReactNode
}

export function PreloaderProvider({ children }: PreloaderProviderProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('Loading...')

  const showPreloader = (text: string = 'Loading...') => {
    setLoadingText(text)
    setIsLoading(true)
  }

  const hidePreloader = () => {
    setIsLoading(false)
    setLoadingText('Loading...')
  }

  return (
    <PreloaderContext.Provider
      value={{
        isLoading,
        showPreloader,
        hidePreloader,
        loadingText
      }}
    >
      {children}
    </PreloaderContext.Provider>
  )
}

export function usePreloader() {
  const context = useContext(PreloaderContext)
  if (context === undefined) {
    throw new Error('usePreloader must be used within a PreloaderProvider')
  }
  return context
}
