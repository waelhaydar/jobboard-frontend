'use client'

import React from 'react'
import Preloader from './Preloader'
import { usePreloader } from './PreloaderContext'

export default function GlobalPreloader() {
  const { isLoading, loadingText } = usePreloader()

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="glass-dark p-8 rounded-2xl border border-white/10 text-center">
        <Preloader
          isLoading={isLoading}
          text={loadingText}
          size="lg"
        />
      </div>
    </div>
  )
}