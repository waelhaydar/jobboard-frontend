import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface ErrorBoundaryProps {
  error?: string
  title?: string
  description?: string
  showRetry?: boolean
  onRetry?: () => void
  showHome?: boolean
  onHome?: () => void
  className?: string
}

export default function ErrorBoundary({
  error,
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
  showRetry = true,
  onRetry,
  showHome = true,
  onHome,
  className = ''
}: ErrorBoundaryProps) {
  return (
    <div className={`flex items-center justify-center min-h-[400px] ${className}`}>
      <div className="glass-dark text-center max-w-md mx-auto p-8 rounded-2xl border border-white/10">
        <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-white" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        <p className="text-gray-300 mb-6">{description}</p>

        {error && (
          <details className="mt-4 text-left cursor-pointer">
            <summary className="text-sm text-gray-400 hover:text-gray-300 transition-colors">
              Technical Details
            </summary>
            <pre className="mt-2 p-3 bg-black/30 rounded-lg text-xs text-red-400 overflow-auto max-h-32">
              {error}
            </pre>
          </details>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          {showRetry && onRetry && (
            <button
              onClick={onRetry}
              className="secondaryButton-dark"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          )}

          {showHome && onHome && (
            <button
              onClick={onHome}
              className="secondaryButton-dark"
            >
              <Home className="w-4 h-4" />
              Go Home
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export function ErrorMessage({
  message,
  className = '',
  variant = 'default'
}: {
  message: string
  className?: string
  variant?: 'default' | 'inline' | 'card'
}) {
  const variants = {
    default: 'p-4 bg-red-500/10 border border-red-500/20 rounded-xl',
    inline: 'p-3 bg-red-500/10 border border-red-500/20 rounded-lg',
    card: 'p-6 bg-red-500/10 border border-red-500/20 rounded-2xl'
  }

  return (
    <div className={`${variants[variant]} ${className}`}>
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
        <p className="text-red-400 text-sm">{message}</p>
      </div>
    </div>
  )
}

export function SuccessMessage({
  message,
  className = '',
  variant = 'default'
}: {
  message: string
  className?: string
  variant?: 'default' | 'inline' | 'card'
}) {
  const variants = {
    default: 'p-4 bg-green-500/10 border border-green-500/20 rounded-xl',
    inline: 'p-3 bg-green-500/10 border border-green-500/20 rounded-lg',
    card: 'p-6 bg-green-500/10 border border-green-500/20 rounded-2xl'
  }

  return (
    <div className={`${variants[variant]} ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs">✓</span>
        </div>
        <p className="text-green-400 text-sm">{message}</p>
      </div>
    </div>
  )
}