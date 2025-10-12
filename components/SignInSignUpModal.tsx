'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Portal from './Portal'

interface SignInSignUpModalProps {
  isSignedIn: boolean;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  jobId?: string;
}

const SignInSignUpModal: React.FC<SignInSignUpModalProps> = ({ isSignedIn, isModalOpen, setIsModalOpen, jobId }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSignIn, setIsSignIn] = useState(true)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const modalRef = useRef<HTMLDivElement>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isModalOpen) {
      firstInputRef.current?.focus()
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isModalOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal()
      }
    }

    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isModalOpen])

  const closeModal = () => {
    setIsModalOpen(false)
    setError('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!isSignIn && password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      const payload = { email, password }
      let url = ''

      if (isSignIn) {
        url = '/api/auth/login'
      } else {
        url = '/api/auth/register'
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()

      if (res.ok) {
        if (isSignIn) {
          closeModal()
          router.refresh()
        } else {
          const validJobId = typeof jobId === 'string' && jobId.trim() ? jobId.trim() : null
          const redirectPath = validJobId
            ? `/candidate/profile?edit=true&jobId=${encodeURIComponent(validJobId)}`
            : '/candidate/profile?edit=true'
          router.push(redirectPath)
          closeModal()
        }
      } else {
        setError(data.error || 'An error occurred')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isModalOpen) return null

  return (
    <Portal>
      <div className="fixed inset-0 backdrop-blur-sm z-[9998] bg-black/50" onClick={closeModal}></div>
      <div
        ref={modalRef}
        className="fixed glass-dark left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-md p-8 animate-fadeInUp max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeModal}
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">{isSignIn ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-gray-400 mt-2">
            {isSignIn ? 'Sign in to your account' : 'Join our community today'}
          </p>
        </div>



        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
            <input
              ref={firstInputRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input"
              placeholder="Enter your password"
            />
          </div>

          {!isSignIn && (
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="input"
                placeholder="Confirm your password"
              />
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="thirdButton"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                {isSignIn ? 'Signing In...' : 'Creating Account...'}
              </div>
            ) : (
              isSignIn ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <button
          className="w-full mt-4 text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium py-2 rounded-lg hover:bg-cyan-500/10"
          onClick={() => setIsSignIn(!isSignIn)}
        >
          {isSignIn ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
        </button>
      </div>
    </Portal>
  )
}

export default SignInSignUpModal