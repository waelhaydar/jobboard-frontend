'use client'

import React, { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import ApplicationForm from './ApplicationForm'
import JobPostForm from '../../../app/employer/JobPostForm'
import EmployerProfileCard from '../../../components/EmployerProfileCard'
import ThankYouPage from './ThankYouPage';

import { useAuthModal } from '../../../components/AuthModalContext'
import { ApplicationFormProvider } from '../../../components/ApplicationFormContext'
import {
  MapPin,
  Clock,
  DollarSign,
  Users,
  Briefcase,
  Calendar,
  Edit3,
  X,
  Share2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export default function JobPageClient({ job, isLoggedIn, entity, isEmployer, applications }: any) {
  const { openModal } = useAuthModal()
  const router = useRouter()
  const pathname = usePathname()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [views, setViews] = useState(0)

  const isThankYouPage = pathname.endsWith('/thank-you');

  if (isThankYouPage) {
    return <ThankYouPage />;
  }

  const jobDetails = [
    { icon: MapPin, label: 'Location', value: job.location || 'Remote' },
    { icon: Briefcase, label: 'Job Type', value: job.jobType?.replace('_', ' ') || 'Not specified' },
    { icon: Clock, label: 'Experience', value: job.experience || 'Not specified' },
    { icon: DollarSign, label: 'Salary', value: job.basicMonthlySalaryUSD ? `$${job.basicMonthlySalaryUSD.toLocaleString()}/month` : 'Not specified' },
    { icon: Users, label: 'Vacancies', value: job.vacancies || 'Not specified' },
    { icon: Calendar, label: 'Posted', value: job.createdAt ? formatDistanceToNow(new Date(job.createdAt), { addSuffix: true }) : 'Recently' }
  ]

  return (
    <div className={`min-h-screen`}>
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Employer Profile */}
        <div className="mb-8 animate-fade-in">
          <EmployerProfileCard employer={job.employer} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <div className="glass-dark text-white p-6 animate-slide-up">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold text-gradient mb-2">{job.title}</h1>
                  {isEmployer && !isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="secondaryButton-dark "><span>
                      <Edit3 className="w-4 h-4" />
                      Edit Job</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 text-job-muted">
                  <span className="font-medium">{job.employer.companyName}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Verified Employer
                  </span>
                </div>

                {/* Job Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-fadeInUp">
                  {jobDetails.map((detail, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-job-fill rounded-lg">
                      <detail.icon className="w-4 h-4 text-job-secondary flex-shrink-0" />
                      <div>
                        <div className="text-xs text-job-muted">{detail.label}</div>
                        <div className="text-sm font-medium text-job-text">{detail.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Edit Mode */}
            {isEmployer && isEditing && (
              <div className="text-white  p-6 animate-slide-up glass-dark">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-job-text">Edit Job</h3>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="p-2 rounded-lg text-job-muted hover:text-job-text hover:bg-job-background transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <JobPostForm
                  employerId={job.employerId}
                  job={job}
                  onSuccess={() => {
                    router.refresh()
                    setIsEditing(false)
                  }}
                />
              </div>
            )}

            {/* Job Description */}
            <div className="glass-dark text-white  p-6 animate-slide-up">
              <h2 className="text-xl font-semibold text-job-text mb-4">Job Description</h2>
              <div className="prose prose-job max-w-none">
                <div className="text-job-text whitespace-pre-wrap leading-relaxed">{job.description}</div>
              </div>
            </div>

            {/* Benefits */}
            {(job.transportation || job.accommodation || job.freeMeals || job.bonuses || job.companyCar) && (
              <div className="glass-dark text-white  p-6 animate-slide-up animate-fadeInUp">
                <h2 className="text-xl font-semibold text-job-text mb-4">Benefits & Perks</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {job.transportation && (
                    <div className="flex items-center gap-2 p-2 bg-job-fill rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-job-text">Transportation</span>
                    </div>
                  )}
                  {job.accommodation && (
                    <div className="flex items-center gap-2 p-2 bg-job-fill rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-job-text">Accommodation</span>
                    </div>
                  )}
                  {job.freeMeals && (
                    <div className="flex items-center gap-2 p-2 bg-job-fill rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-job-text">Free Meals</span>
                    </div>
                  )}
                  {job.bonuses && (
                    <div className="flex items-center gap-2 p-2 bg-job-fill rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-job-text">Performance Bonuses</span>
                    </div>
                  )}
                  {job.companyCar && (
                    <div className="flex items-center gap-2 p-2 bg-job-fill rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-job-text">Company Car</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Card */}
            <div>
              <div className="neon-border text-white rounded-xl p-6 top-2 animate-slide-up glass-dark ">
                <h3 className="text-lg font-semibold text-job-text mb-4">Apply for this job</h3>

                {isLoggedIn && entity.type === 'employer' ? (
                  <div className="space-y-4">
                 
                    <div className="p-4 rounded-lg">
                      <h4 className="font-semibold text-job-text mb-2">Job Applications</h4>
                      <p className="text-sm text-job-muted mb-3">
                        {applications.length} application{applications.length !== 1 ? 's' : ''} received
                      </p>
                      {applications.length > 0 && (
                        <div className="space-y-2">
                          {applications.slice(0, 3).map((app: any) => (
                            <div key={app.id} className="text-xs p-2 bg-job-fill rounded">
                              <p className="font-medium text-job-text">{app.candidate.name || app.candidate.email}</p>
                              <p className="text-job-muted">Status: {app.status}</p>
                            </div>
                          ))}
                          {applications.length > 3 && (
                            <p className="text-xs text-job-muted">+{applications.length - 3} more</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : isLoggedIn && entity.type === 'admin' ? (
                  <div className="p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-job-muted">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">Admins cannot apply for jobs</span>
                    </div>
                  </div>
                ) : isLoggedIn && entity.type === 'candidate' ? (
                  <ApplicationFormProvider>
                    <ApplicationForm jobId={job.id} employerId={job.employerId} jobSlug={job.slug} />
                  </ApplicationFormProvider>
                ) : (
                <div className="space-y-4">
                  <div className="p-6 rounded-lg">
                    <p className="text-sm text-job-text mb-4">
                      Sign in to apply for this job
                    </p>
                    <button
                      onClick={() => openModal(job.id)}
                      className="primaryButton w-full text-center"
                    >
                      <span>Sign In / Sign Up</span>
                    </button>
                  </div>
                </div>
                )}
              </div>
            </div>

            {/* Job Stats  */}
            <div className="glass-dark text-white  p-6">
             
              <h3 className="text-lg font-semibold text-job-text mb-4">Job Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-job-muted">Applications</span>
                  <span className="font-medium text-job-text">{applications.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-job-muted">Views</span>
                  <span suppressHydrationWarning className="font-medium text-job-text">{views}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-job-muted">Status</span>
                  <span className="px-2 py-1 bg-job-success-background text-green-800 text-xs rounded-full font-medium">
                    {job.status || 'Active'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
