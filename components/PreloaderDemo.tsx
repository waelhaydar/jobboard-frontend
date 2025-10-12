'use client'

import React, { useState } from 'react'
import { useGlobalPreloader } from '../lib/usePreloader'

export default function PreloaderDemo() {
  const { showWithMessage, showLoadingData, showSaving, showProcessing, hide } = useGlobalPreloader()
  const [demoLoading, setDemoLoading] = useState(false)

  const handleDemoClick = async (type: string) => {
    setDemoLoading(true)
    try {
      switch (type) {
        case 'data':
          showLoadingData()
          break
        case 'save':
          showSaving()
          break
        case 'process':
          showProcessing()
          break
        case 'custom':
          showWithMessage('Custom loading message!')
          break
        default:
          showWithMessage('Loading...')
      }

      // Simulate some async operation
      await new Promise(resolve => setTimeout(resolve, 2000))
    } finally {
      hide()
      setDemoLoading(false)
    }
  }

  return (
    <div className="text-white bg-job-card-background p-6 rounded-lg shadow-job-card">
      <h3 className="text-lg font-semibold mb-4 text-job-text-primary">Preloader Demo</h3>
      <p className="text-job-text-muted mb-4">
        Click the buttons below to see the preloader in action:
      </p>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleDemoClick('data')}
          disabled={demoLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Load Data
        </button>

        <button
          onClick={() => handleDemoClick('save')}
          disabled={demoLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Changes
        </button>

        <button
          onClick={() => handleDemoClick('process')}
          disabled={demoLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Process
        </button>

        <button
          onClick={() => handleDemoClick('custom')}
          disabled={demoLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Custom Message
        </button>
      </div>
    </div>
  )
}
