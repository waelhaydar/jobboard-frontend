'use client'

import { usePreloader } from '../components/PreloaderContext'

/**
 * Custom hook for easy preloader management
 * Provides convenient methods to show/hide the global preloader
 */
export function useGlobalPreloader() {
  const { showPreloader, hidePreloader, isLoading } = usePreloader()

  return {
    isLoading,
    show: showPreloader,
    hide: hidePreloader,
    // Convenience methods for common loading scenarios
    showWithMessage: (message: string) => showPreloader(message),
    showLoadingData: () => showPreloader('Loading data...'),
    showSaving: () => showPreloader('Saving...'),
    showProcessing: () => showPreloader('Processing...'),
    showSubmitting: () => showPreloader('Submitting...'),
  }
}
