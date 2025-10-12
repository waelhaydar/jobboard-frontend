'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NotFound() {
  const pathname = usePathname()

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-dark text-center max-w-md w-full mx-auto p-8 border-white/10">
        <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl font-black text-white">404</span>
        </div>

        <h1 className="text-3xl font-bold mb-3 text-white">Page Not Found</h1>

        <div className="bg-black/30 p-4 rounded-lg mb-6">
          <p className="text-gray-300 text-sm mb-2">You tried to access:</p>
          <code className="font-mono text-sm break-all text-cyan-300">
            {pathname}
          </code>
        </div>

        <p className="text-gray-400 text-sm mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 w-full bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/30 justify-center"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Go Home
        </Link>

        <div className="mt-4 flex gap-4 justify-center">
          <Link href="/jobs" className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm">
            Browse Jobs
          </Link>
          <Link href="/candidate/profile" className="text-purple-400 hover:text-purple-300 transition-colors text-sm">
            Create Profile
          </Link>
        </div>
      </div>
    </div>
  )
}
