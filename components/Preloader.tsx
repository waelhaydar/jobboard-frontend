'use client'

import React from 'react'

interface PreloaderProps {
  isLoading?: boolean
  size?: 'sm' | 'md' | 'lg'
  text?: string
  overlay?: boolean
}

export default function Preloader({
  isLoading = true,
  size = 'md',
  text = 'Loading...',
  overlay = false
}: PreloaderProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const containerClasses = overlay
    ? 'fixed inset-0 bg-job-overlay-bg flex items-center justify-center z-50'
    : 'flex flex-col items-center justify-center py-8'

  if (!isLoading) return null

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center space-y-4">
        {/* Spinner */}
        <div className="relative">
          <div className={`${sizeClasses[size]} border-4 border-job-primary-border-border border-t-job-primary-border-border rounded-full animate-spin`}></div>
        </div>

        {/* Loading text */}
        {text && (
          <p className="text-job-text-muted text-sm font-medium animate-pulse">
            {text}
          </p>
        )}
      </div>
    </div>
  )
}
