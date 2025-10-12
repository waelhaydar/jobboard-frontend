'use client'

import Link from 'next/link'
import {
  CheckCircle,
  ArrowRight,
  Share2,
  User,
  FileText,
  Bell,
  Home,
  Sparkles,
  Heart,
  Star
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

// Define the proper types for params
interface ThankYouPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function ThankYouPage({ params }: ThankYouPageProps) {
  const searchParams = useSearchParams()
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [resolvedParams, setResolvedParams] = useState<{ slug: string } | null>(null)

  const score = searchParams.get('score')

  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolved = await params
        setResolvedParams(resolved)
        console.log('Resolved params:', resolved)
      } catch (err) {
        console.error('Error resolving params:', err)
        setError('Failed to load page parameters')
        setLoading(false)
      }
    }

    resolveParams()
  }, [params])

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!resolvedParams?.slug) return

      try {
        const response = await fetch(`/api/jobs/${resolvedParams.slug}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setJob(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (resolvedParams?.slug) {
      fetchJobDetails()
    }
  }, [resolvedParams])

  if (loading) return <div className="text-center py-12 text-job-text">Loading job details...</div>
  if (error) return <div className="text-center py-12 text-red-500">Error: {error}</div>
  if (!job) return <div className="text-center py-12 text-job-text">Job not found</div>

  return (
    <div className="min-h-screen ">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-job-primary/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-job-secondary/5 rounded-full blur-3xl animate-pulse-slow animation-delay-1s"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-job-accent/3 rounded-full blur-3xl animate-pulse-slow animation-delay-2s"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main success card */}
        <div className="glass-dark  p-8 md:p-12 text-center animate-fade-in ">
          {/* Success animation */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-job-success-background rounded-full animate-ping opacity-20"></div>
            </div>
            <div className="relative w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-bounce-gentle">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-job-accent rounded-full flex items-center justify-center animate-pulse">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Success message */}
          <div className="space-y-4 mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-job-primary to-job-secondary bg-clip-text text-transparent animate-slide-up">
              Application Submitted!
            </h1>
            <p className="text-xl md:text-2xl text-job-text font-medium animate-slide-up animation-delay-0_1s">
              Thank you for applying to <span className="text-job-primary font-semibold">{job.title}</span>
            </p>
            <p className="text-job-muted text-lg animate-slide-up animation-delay-0_2s">
              Your application has been successfully submitted and is now under review
            </p>
            
            {/* Show score if available */}
            {score && (
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4 inline-block animate-fade-in">
                <p className="text-lg font-semibold text-job-primary">
                  Application Score: {score}%
                </p>
              </div>
            )}
          </div>

          {/* Next steps */}
          <div className="bg-gradient-to-r from-job-primary/5 to-job-secondary/5 rounded-xl p-6 mb-8 animate-slide-up animation-delay-0_3s">
            <h2 className="text-xl font-semibold text-job-text mb-4 flex items-center justify-center gap-2">
              <Star className="w-5 h-5 text-job-primary" />
              What happens next?
            </h2>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="text-white flex items-start gap-3 p-3 bg-job-card-background rounded-lg">
                <div className="w-8 h-8 bg-job-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-job-primary" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-job-text">Profile Review</div>
                  <div className="text-job-muted">We'll review your profile and experience</div>
                </div>
              </div>
              <div className="text-white flex items-start gap-3 p-3 bg-job-card-background rounded-lg">
                <div className="w-8 h-8 bg-job-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-job-secondary" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-job-text">Application Review</div>
                  <div className="text-job-muted">Our team will carefully review your application</div>
                </div>
              </div>
              <div className="text-white flex items-start gap-3 p-3 bg-job-card-background rounded-lg">
                <div className="w-8 h-8 bg-job-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bell className="w-4 h-4 text-job-accent" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-job-text">Notification</div>
                  <div className="text-job-muted">We'll notify you of any updates</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up animation-delay-0_4s">
            <Link
              href="/candidate/profile"
              className="group btn-primary px-8 py-3 rounded-lg font-medium flex items-center gap-2 transition-all duration-300 hover:scale-105"
            >
              View My Applications
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="/jobs"
              className="group secondaryButton-dark"
            ><span>
              <Home className="w-4 h-4" />
              Browse More Jobs</span>
            </Link> 
          </div>

          {/* Social sharing */}
          <div className="mt-8 pt-6 border-t border-job-border animate-slide-up animation-delay-0_5s">
            <p className="text-job-muted text-sm mb-3">Share your achievement!</p>
            <div className="flex justify-center gap-3">
              <button className="secondaryButton-dark">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="secondaryButton-dark">
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Additional info card */}
        <div className="mt-8 bg-job-card border border-job-border rounded-xl p-6 animate-slide-up animation-delay-0_6s">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-job-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-job-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-job-text mb-2">Application Details</h3>
              <div className="text-sm text-job-muted space-y-1">
                <p><span className="font-medium">Job:</span> {job.title}</p>
                <p><span className="font-medium">Company:</span> {job.employer?.companyName}</p>
                <p><span className="font-medium">Submitted:</span> {new Date().toLocaleDateString()}</p>
                {score && (
                  <p><span className="font-medium">Score:</span> {score}% match</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}