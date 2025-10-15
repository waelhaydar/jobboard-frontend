'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Briefcase,
  MapPin,
  DollarSign,
  Gift,
  ChevronRight,
  ChevronLeft,
  Check,
  AlertCircle,
  Info
} from 'lucide-react'

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  jobType?: string;
  category?: string;
  hiringFrom?: string;
  basicMonthlySalaryUSD?: number;
  transportation?: boolean;
  accommodation?: boolean;
  freeMeals?: boolean;
  bonuses?: boolean;
  companyCar?: boolean;
}

interface JobPostFormProps {
  employerId: number;
  job?: Job;
  onSuccess?: () => void;
}

export default function JobPostForm({ employerId, job, onSuccess }: JobPostFormProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    title: job?.title || '',
    description: job?.description || '',
    location: job?.location || '',
    jobType: job?.jobType || 'FULL_TIME',
    category: job?.category || 'FOOD_RETAIL',
    hiringFrom: job?.hiringFrom || '',
    basicMonthlySalaryUSD: job?.basicMonthlySalaryUSD || '',
    transportation: job?.transportation || false,
    accommodation: job?.accommodation || false,
    freeMeals: job?.freeMeals || false,
    bonuses: job?.bonuses || false,
    companyCar: job?.companyCar || false
  })
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const steps = [
    { id: 1, title: 'Job Details', icon: Briefcase, description: 'Basic job information' },
    { id: 2, title: 'Location & Salary', icon: MapPin, description: 'Location and compensation' },
    { id: 3, title: 'Benefits', icon: Gift, description: 'Perks and benefits' },
    { id: 4, title: 'Review', icon: Check, description: 'Review and submit' }
  ]

  const totalSteps = steps.length

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        description: job.description,
        location: job.location || '',
        jobType: job.jobType || 'FULL_TIME',
        category: job.category || 'FOOD_RETAIL',
        hiringFrom: job.hiringFrom || '',
        basicMonthlySalaryUSD: job.basicMonthlySalaryUSD || '',
        transportation: job.transportation || false,
        accommodation: job.accommodation || false,
        freeMeals: job.freeMeals || false,
        bonuses: job.bonuses || false,
        companyCar: job.companyCar || false
      })
    }
  }, [job])

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.title.trim() && formData.description.trim()
      case 2:
        return formData.location.trim() && formData.jobType
      case 3:
        return true // Benefits are optional
      case 4:
        return true
      default:
        return false
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const submitData = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value.toString())
      })

      const url = job ? `/api/employer/jobs/${job.id}` : '/api/employer/jobs'
      const method = job ? 'PUT' : 'POST'
      const res = await fetch(url, { method, body: submitData })

      if (res.ok) {
        const data = await res.json()
        setMessage(job ? 'Job updated successfully!' : 'Job post created successfully!')

        if (!job && data.job) {
          router.push(`/jobs/${data.job.slug}`)
          return
        }

        if (!job) {
          setFormData({
            title: '',
            description: '',
            location: '',
            jobType: 'FULL_TIME',
            category: 'FOOD_RETAIL',
            hiringFrom: '',
            basicMonthlySalaryUSD: '',
            transportation: false,
            accommodation: false,
            freeMeals: false,
            bonuses: false,
            companyCar: false
          })
        } else {
          onSuccess?.()
        }
      } else {
        const data = await res.json()
        setMessage(data.error || `Failed to ${job ? 'update' : 'create'} job post.`)
      }
    } catch (error) {
      console.error(`Error ${job ? 'updating' : 'creating'} job post:`, error)
      setMessage('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-job-text mb-2">
                Job Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateFormData('title', e.target.value)}
                className="job-search-input w-full px-4 py-3 text-lg"
                placeholder="e.g. Senior Software Engineer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-job-text mb-2">
                Job Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                rows={8}
                className="job-search-input w-full px-4 py-3 resize-none"
                placeholder="Describe the role, responsibilities, requirements, and what makes this opportunity exciting..."
              />
              <p className="text-xs text-job-muted mt-2">
                {formData.description.length}/2000 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-job-text mb-2">
                Job Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => updateFormData('category', e.target.value)}
                className="job-search-input w-full px-4 py-3"
              >
                <option value="FOOD_RETAIL">Food Retail</option>
                <option value="FASHION_RETAIL">Fashion Retail</option>
                <option value="AUTOMOTIVE_RETAIL">Automotive Retail</option>
                <option value="RESTAURANTS">Restaurants</option>
                <option value="HOTELS">Hotels</option>
                <option value="ELECTRONICS">Electronics</option>
                <option value="HOME_DIY">Home & DIY</option>
                <option value="SCHOOLS">Schools</option>
              </select>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-job-text mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => updateFormData('location', e.target.value)}
                  className="job-search-input w-full px-4 py-3"
                  placeholder="City, Country"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-job-text mb-2">
                  Job Type *
                </label>
                <select
                  value={formData.jobType}
                  onChange={(e) => updateFormData('jobType', e.target.value)}
                  className="job-search-input w-full px-4 py-3"
                >
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="REMOTE">Remote</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-job-text mb-2">
                  Hiring From
                </label>
                <input
                  type="text"
                  value={formData.hiringFrom}
                  onChange={(e) => updateFormData('hiringFrom', e.target.value)}
                  className="job-search-input w-full px-4 py-3"
                  placeholder="Country or region"
                />
                {formData.hiringFrom && formData.hiringFrom.toLowerCase() !== 'lebanon' && (
                  <div className="flex items-center gap-2 mt-2 p-3 bg-job-alert-background border border-yellow-200 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm text-yellow-800">Visa sponsorship may be required</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-job-text mb-2">
                  Monthly Salary (USD)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-job-muted w-5 h-5" />
                  <input
                    type="number"
                    value={formData.basicMonthlySalaryUSD}
                    onChange={(e) => updateFormData('basicMonthlySalaryUSD', e.target.value)}
                    className="job-search-input w-full pl-12 pr-4 py-3"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-job-text mb-4">Benefits & Perks</h3>
              <p className="text-job-muted mb-6">Select all that apply to make your job posting more attractive</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'transportation', label: 'Transportation Allowance', icon: '🚗' },
                  { key: 'accommodation', label: 'Housing/Accommodation', icon: '🏠' },
                  { key: 'freeMeals', label: 'Free Meals', icon: '🍽️' },
                  { key: 'bonuses', label: 'Performance Bonuses', icon: '💰' },
                  { key: 'companyCar', label: 'Company Car', icon: '🚙' }
                ].map((benefit) => (
                  <label
                    key={benefit.key}
                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      formData[benefit.key as keyof typeof formData]
                        ? 'border-job-primary bg-job-primary/5'
                        : 'border-job-border hover:border-job-primary/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData[benefit.key as keyof typeof formData] as boolean}
                      onChange={(e) => updateFormData(benefit.key, e.target.checked)}
                      className="sr-only"
                    />
                    <span className="text-2xl mr-4">{benefit.icon}</span>
                    <span className="text-job-text font-medium">{benefit.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-job-text mb-2">Review Your Job Posting</h3>
              <p className="text-job-muted">Please review all information before submitting</p>
            </div>

            <div className="space-y-4">
              <div className="bg-job-card-background border border-job-border rounded-xl p-6">
                <h4 className="font-semibold text-job-text mb-3">Job Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-job-muted">Title:</span>
                    <span className="font-medium">{formData.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-job-muted">Type:</span>
                    <span className="font-medium">{formData.jobType.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-job-muted">Location:</span>
                    <span className="font-medium">{formData.location || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-job-muted">Salary:</span>
                    <span className="font-medium">
                      {formData.basicMonthlySalaryUSD ? `$${formData.basicMonthlySalaryUSD}/month` : 'Not specified'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-job-card-background-bg border border-job-border-color rounded-xl p-6">
                <h4 className="font-semibold text-job-text mb-3">Description</h4>
                <p className="text-job-text text-sm leading-relaxed">
                  {formData.description.length > 200
                    ? `${formData.description.substring(0, 200)}...`
                    : formData.description}
                </p>
              </div>

              <div className="bg-job-card-background-bg border border-job-border-color rounded-xl p-6">
                <h4 className="font-semibold text-job-text mb-3">Benefits</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(formData).map(([key, value]) => {
                    if (key.includes('transportation') || key.includes('accommodation') ||
                        key.includes('freeMeals') || key.includes('bonuses') || key.includes('companyCar')) {
                      if (value) {
                        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
                        return (
                          <span key={key} className="px-3 py-1 bg-job-primary/10 text-job-primary rounded-full text-sm">
                            {label}
                          </span>
                        )
                      }
                    }
                    return null
                  })}
                  {!Object.values(formData).some(v =>
                    typeof v === 'boolean' && v &&
                    (v.toString().includes('transportation') || v.toString().includes('accommodation') ||
                     v.toString().includes('freeMeals') || v.toString().includes('bonuses') || v.toString().includes('companyCar'))
                  ) && (
                    <span className="text-job-muted text-sm">No benefits selected</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 glass-dark">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 ">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full text-job-text border-2 transition-colors ${
                step.id < currentStep
                  ? 'bg-job-primary-bg border-job-primary text-job-text'
                  : step.id === currentStep
                  ? 'border-job-primary text-job-primary bg-job-primary-bg/10'
                  : 'border-job-border text-job-muted'
              }`}>
                {step.id < currentStep ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <step.icon className="w-6 h-6" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  step.id < currentStep ? 'bg-job-primary-bg' : 'bg-job-border-color'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-job-text mb-2">
            {steps[currentStep - 1].title}
          </h2>
          <p className="text-job-muted">{steps[currentStep - 1].description}</p>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-job-card-background-bg border border-job-border-color text-job-text rounded-xl p-8 mb-8">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`secondaryButton-dark flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-job-text transition-colors ${
            currentStep === 1
              ? 'text-job-muted cursor-not-allowed'
              : 'text-job-text hover:bg-job-background-bg border border-job-border-color'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <div className="flex items-center gap-4">
          {message && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              message.includes('success')
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.includes('success') ? (
                <Check className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span className="text-sm">{message}</span>
            </div>
          )}

          {currentStep < totalSteps ? (
            <button
              onClick={nextStep}
              disabled={!validateStep(currentStep)}
              className={`btn-primary px-8 py-3 rounded-lg flex items-center gap-2 font-medium ${
                !validateStep(currentStep) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !validateStep(currentStep)}
              className={`btn-primary px-8 py-3 rounded-lg font-medium ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Creating...' : job ? 'Update Job' : 'Create Job'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
