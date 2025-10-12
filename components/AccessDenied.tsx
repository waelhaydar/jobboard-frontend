'use client'

import { useRouter } from 'next/navigation'

interface AccessDeniedProps {
  requiredRole?: string
  message?: string
}

export default function AccessDenied({
  requiredRole = 'admin',
  message = 'You do not have permission to access this page.'
}: AccessDeniedProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="glass-dark max-w-md w-full mx-auto p-8 rounded-3xl shadow-2xl text-center border border-white/10">
        {/* Icon */}
        <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>

        {/* Content */}
        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-4">
          Access Denied
        </h1>

        <p className="text-gray-300 mb-6 leading-relaxed">
          {message}
        </p>

        {requiredRole && (
          <div className="bg-black/30 rounded-xl p-3 mb-6">
            <p className="text-sm text-gray-400">
              This page requires <span className="font-semibold text-red-400">{requiredRole}</span> privileges
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => router.back()}
            className="secondaryButton-dark"
          >
            Go Back
          </button>

          <button
            onClick={() => router.push('/')}
            className="secondaryButton-dark"
          >
            Go to Homepage
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-xs text-gray-500">
            If you believe this is an error, please contact your administrator
          </p>
        </div>
      </div>
    </div>
  )
}
