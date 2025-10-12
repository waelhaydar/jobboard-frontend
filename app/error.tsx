'use client'

export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <div className="glass-dark max-w-md w-full mx-auto p-8 rounded-3xl shadow-2xl text-center border border-white/10">
        <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold mb-3 text-white">Something went wrong!</h2>
        <p className="text-gray-300 mb-6 bg-black/20 text-gray-300 p-3 rounded-lg">
          {error.message || 'An unexpected error occurred'}
        </p>

        <button
          onClick={reset}
          className="secondaryButton-dark w-full"
        >
          Try Again
        </button>

        <div className="mt-6">
          <a
            href="/"
            className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm"
          >
            ← Return to homepage
          </a>
        </div>
      </div>
    </div>
  )
}
