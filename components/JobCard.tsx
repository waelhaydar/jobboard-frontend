'use client'
import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { MapPin, Clock, DollarSign, Building2, Briefcase, Users } from 'lucide-react'
import { useState } from 'react'

interface Job {
  id: string
  slug: string
  title: string
  location?: string
  jobType?: string
  experience?: string
  category?: string
  basicMonthlySalaryUSD?: number
  employer?: {
    companyName: string
    imageUrl?: string
  }
  createdAt?: Date | string
}

interface JobCardProps {
  job: Job
  isLoading?: boolean
  onError?: (error: string) => void
}

export default function JobCard({ job, isLoading = false, onError }: JobCardProps) {
  const [imageError, setImageError] = useState(false)

  const iconColorClass = {
    cyan: 'text-cyan-400',
    purple: 'text-purple-400',
    pink: 'text-pink-400'
  }

  // 🌈 Dynamic gradient class based on category
  const getCategoryGradient = (category: string) => {
    return category ? `category-${category}` : ''
  }

  const formatSalary = (salary: number | undefined) => {
    if (!salary || isNaN(salary)) return 'Salary not specified'
    return `$${salary.toLocaleString()}/month`
  }

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'Recently posted'
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true })
    } catch {
      return 'Recently posted'
    }
  }

  if (isLoading) {
    return (
      <div className="glass-dark p-6 animate-pulse">
        <div className="space-y-4">
          <div className="h-6 bg-white/10 rounded-lg w-3/4"></div>
          <div className="h-4 bg-white/10 rounded-lg w-1/2"></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-4 bg-white/10 rounded-lg"></div>
            <div className="h-4 bg-white/10 rounded-lg"></div>
            <div className="h-4 bg-white/10 rounded-lg"></div>
            <div className="h-4 bg-white/10 rounded-lg"></div>
          </div>
          <div className="flex justify-between items-center pt-2">
            <div className="h-3 bg-white/10 rounded-lg w-1/3"></div>
            <div className="h-4 bg-white/10 rounded-lg w-1/4"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Link href={`/jobs/${job.slug}`} className="group block">
      <article className="glass-dark cursor-pointer transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-cyan-500/20 relative overflow-hidden flex">

        {/* 🌈 Category vertical label with gradient background */}
        {job.category && (
          <div className={`w-8 flex-shrink-0 flex items-center justify-center ${getCategoryGradient(job.category)}`}>
            <span className="transform -rotate-90 whitespace-nowrap tracking-wide">
              {job.category.replace('_', ' ')}
            </span>
          </div>
        )}

        <div className="p-6 flex flex-col flex-1">
          <div className="mb-3">
            <h3 className="text-xl font-bold text-white line-clamp-2 group-hover:text-cyan-400 transition-colors duration-300">
              {job.title}
            </h3>
          </div>
          <div className="flex items-start justify-between flex-1">
            <div className="flex-1 space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-200">
                <MapPin className={`w-4 h-4 mr-2 ${iconColorClass.cyan} flex-shrink-0`} />
                <span className="font-medium">{job.location || 'Remote'}</span>
              </div>

              <div className="flex items-center text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-200">
                <Briefcase className={`w-4 h-4 mr-2 ${iconColorClass.purple} flex-shrink-0`} />
                <span className="font-medium">Job Type: {job.jobType?.replace('_', ' ') || 'Not specified'}</span>
              </div>

              <div className="flex items-center text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-200">
                <Clock className={`w-4 h-4 mr-2 ${iconColorClass.pink} flex-shrink-0`} />
                <span className="font-medium">Experience: {job.experience || 'Not specified'}</span>
              </div>

              <div className="flex items-center text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-200">
                <Building2 className={`w-4 h-4 mr-2 ${iconColorClass.cyan} flex-shrink-0`} />
                <span className="font-semibold">{job.employer?.companyName}</span>
              </div>
            </div>

            <div className="flex flex-col items-end ml-4">
              {job.employer?.imageUrl && !imageError && (
                <div className="relative mb-3">
                  <Image
                    src={job.employer.imageUrl.includes('loremflickr.com') ? '/default-company-logo.png' : job.employer.imageUrl}
                    alt={job.employer.companyName}
                    width={56}
                    height={56}
                    className="object-cover rounded-xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl"
                    onError={() => setImageError(true)}
                  />
                </div>
              )}

              {job.basicMonthlySalaryUSD !== undefined && job.basicMonthlySalaryUSD !== null && (
                <div className="flex items-center text-sm font-bold text-cyan-400 mb-2 px-3 py-1 bg-cyan-500/10 rounded-full">
                  <DollarSign className="w-4 h-4 mr-1" />
                  <span>${job.basicMonthlySalaryUSD.toLocaleString()}</span>
                </div>
              )}

              {job.createdAt && (
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-black/30 px-2 py-1 rounded-full">
                  <Users className="w-3 h-3" />
                  <span>{formatDate(job.createdAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hover overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Error State */}
        {onError && (
          <div className="absolute inset-0 bg-red-500/10 backdrop-blur-sm border border-red-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="text-center p-4">
              <div className="text-red-400 mb-2 text-2xl">⚠️</div>
              <p className="text-sm text-red-400 font-medium">Failed to load job details</p>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onError('Job loading failed')
                }}
                className="text-xs text-red-400 hover:text-red-300 hover:underline mt-2 font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </article>
    </Link>
  )
}
