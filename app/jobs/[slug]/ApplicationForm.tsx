'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useApplicationForm } from '../../../components/ApplicationFormContext'

// Types
interface Resume {
  path: string
  uploadedAt: string
  name: string
}

interface ParsedCVData {
  email?: string
  name?: string
  phone?: string
  skills?: string
  text?: string
}

interface ApplicationError {
  message: string
  code?: string
  details?: unknown
}

interface ApplicationFormProps {
  jobId: string
  employerId: number
  jobSlug: string
}

interface CandidateProfile {
  email?: string
  isPending?: boolean
  candidate?: {
    email?: string
  }
}

// Custom Hooks
const useNavigationProtection = (isDirty: boolean) => {
  const { confirmLeaveApplication } = useApplicationForm()

  useEffect(() => {
    if (!isDirty) return

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = 'You are currently filling out an application form. Are you sure you want to leave? Your progress will be lost.'
      return e.returnValue
    }

    const handlePopState = async (e: PopStateEvent) => {
      if (window.location.pathname === document.referrer) {
        return
      }

      e.preventDefault()
      const confirmed = await confirmLeaveApplication()
      if (confirmed) {
        window.history.back()
      } else {
        window.history.pushState(null, '', window.location.pathname)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [isDirty, confirmLeaveApplication])
}

const useFormValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateFile = (file: File): string | null => {
    if (file.size > 5 * 1024 * 1024) return 'File size must be less than 5MB'
    
    const allowedTypes = [
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    if (!allowedTypes.includes(file.type)) return 'Only PDF and DOCX files are allowed'
    
    return null
  }

  const clearError = (field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }

  const setError = (field: string, message: string) => {
    setErrors(prev => ({ ...prev, [field]: message }))
  }

  return { errors, validateEmail, validateFile, clearError, setError }
}

const useResumeManagement = () => {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(false)

  const fetchResumes = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/candidate/resumes')
      if (res.ok) {
        const data = await res.json()
        setResumes(data.resumes || [])
      } else {
        console.error('Failed to fetch existing resumes')
        setResumes([])
      }
    } catch (err) {
      console.error('Error fetching resumes:', err)
      setResumes([])
    } finally {
      setLoading(false)
    }
  }, [])

  return { resumes, loading, fetchResumes, setResumes }
}

const useCandidateProfile = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const fetchCandidateProfile = useCallback(async (jobId: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/candidate/profile')
      if (!res.ok) {
        router.push(`/candidate/profile?jobId=${jobId}`)
        return null
      }

      const data: CandidateProfile = await res.json()
      if (data.isPending || !data.candidate) {
        router.push(`/candidate/profile?jobId=${jobId}`)
        return null
      }

      const candidateEmail = data.candidate?.email || data.email
      if (candidateEmail) {
        setEmail(candidateEmail)
      }

      return data
    } catch (err) {
      console.error('Error fetching candidate profile:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [router])

  return { email, setEmail, loading, fetchCandidateProfile }
}

const useApplicationStatus = (jobId: string) => {
  const [hasApplied, setHasApplied] = useState(false)
  const [applicationDate, setApplicationDate] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchApplicationStatus = useCallback(async () => {
    if (!jobId) return

    setLoading(true)
    try {
      const res = await fetch(`/api/candidate/application-status?jobId=${jobId}`)
      if (res.ok) {
        const data = await res.json()
        if (data.hasApplied) {
          setHasApplied(true)
          setApplicationDate(data.applicationDate)
        }
      }
    } catch (err) {
      console.error('Error fetching application status:', err)
    } finally {
      setLoading(false)
    }
  }, [jobId])

  return { hasApplied, applicationDate, loading, fetchApplicationStatus }
}

// Sub-Components
const ResumeSelector = ({
  resumes,
  selectedResumePath,
  resumeFile,
  onResumeSelect,
  onFileUpload,
  loading = false,
  uploadingResume = false,
  uploadSuccess = false
}: {
  resumes: Resume[]
  selectedResumePath: string | null
  resumeFile: File | null
  onResumeSelect: (path: string) => void
  onFileUpload: (file: File) => void
  loading?: boolean
  uploadingResume?: boolean
  uploadSuccess?: boolean
}) => {
  if (loading) {
    return <div className="text-sm text-gray-500">Loading resumes...</div>
  }

    return (
      <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Resume:</label>
            {(selectedResumePath && resumes.find(r => r.path === selectedResumePath)) && (
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Current CV: {resumes.find(r => r.path === selectedResumePath)?.name}
              </div>
            )}
            {resumeFile && (
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Current CV: {resumeFile.name}
              </div>
            )}

      {resumes.length > 0 ? (
        <div className="space-y-3">
          {resumes.map((resume) => (
            <div key={resume.path} className="flex items-start">
              <input
                id={resume.path}
                name="resumeOption"
                type="radio"
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 mt-1"
                checked={selectedResumePath === resume.path}
                onChange={() => onResumeSelect(resume.path)}
                disabled={loading}
              />
              <label htmlFor={resume.path} className="ml-3 block text-sm text-gray-900 dark:text-white">
                <span className="font-medium">{resume.name}</span>
                <span className="text-gray-500 dark:text-gray-400 block">
                  Uploaded: {new Date(resume.uploadedAt).toLocaleDateString()}
                </span>
              </label>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">No existing resumes found. Please upload a new one.</p>
      )}

      <div className="mt-3 border-t pt-3">
          <input
            name="resume"
            type="file"
            accept=".pdf,.docx"
            className="block w-full text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 focus:outline-none p-2"
            onChange={(e) => {
              const file = e.target.files?.[0] || null
              if (file) {
                onFileUpload(file)
              }
            }}
            disabled={loading || uploadingResume}
          />
          {uploadingResume && (
            <div className="mt-2 flex items-center text-sm text-blue-600">
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading resume...
            </div>
          )}
          {uploadSuccess && (
            <div className="mt-2 flex items-center text-sm text-green-600">
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Resume uploaded successfully!
            </div>
          )}
        </div>
    
    </div>
  )
}

const AlreadyAppliedMessage = ({ applicationDate }: { applicationDate: string | null }) => (
  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
    <p className="font-semibold text-green-800">✓ You have already applied for this job.</p>
    {applicationDate && (
      <p className="text-sm text-green-600 mt-1">
        Applied on: {new Date(applicationDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </p>
    )}
  </div>
)

// Main Component
export default function ApplicationForm({ jobId, employerId, jobSlug }: ApplicationFormProps) {
  // State
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [selectedResumePath, setSelectedResumePath] = useState<string | null>(null)
  const [uploadedResumePath, setUploadedResumePath] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFormDirty, setIsFormDirty] = useState(false)
  const [uploadingResume, setUploadingResume] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const [extractedName, setExtractedName] = useState<string>('')
  const [extractedPhone, setExtractedPhone] = useState<string>('')
  const [extractedSkills, setExtractedSkills] = useState<string>('')

  // Hooks
  const router = useRouter()
  const { setIsInApplicationForm, confirmLeaveApplication, setJobSlug } = useApplicationForm()
  const { errors, validateEmail, validateFile, clearError, setError: setValidationError } = useFormValidation()
  const { resumes, loading: resumesLoading, fetchResumes } = useResumeManagement()
  const { email, setEmail, loading: profileLoading, fetchCandidateProfile } = useCandidateProfile()
  const { hasApplied, applicationDate, fetchApplicationStatus } = useApplicationStatus(jobId)

  // Navigation protection
  useNavigationProtection(isFormDirty)

  // Debug jobSlug on component mount
  useEffect(() => {
    console.log('ApplicationForm mounted with jobSlug:', jobSlug)
  }, [jobSlug])

  // Memoized values
  const processedResumes = useMemo(() => {
    return resumes.map(resume => ({
      ...resume,
      uploadedAt: new Date(resume.uploadedAt).toLocaleDateString()
    }))
  }, [resumes])

  // Effects
  useEffect(() => {
    setIsInApplicationForm(true)
    setJobSlug(jobSlug)

    const initializeForm = async () => {
      await Promise.all([
        fetchCandidateProfile(jobId),
        fetchResumes(),
        fetchApplicationStatus()
      ])
    }

    initializeForm()

    return () => {
      setIsInApplicationForm(false)
    }
  }, [setIsInApplicationForm, setJobSlug, jobSlug, jobId, fetchCandidateProfile, fetchResumes, fetchApplicationStatus])

  // Pre-select first resume if available
  useEffect(() => {
    if (resumes.length > 0 && !selectedResumePath && !uploadedResumePath && !resumesLoading) {
      setSelectedResumePath(resumes[0].path)
    }
  }, [resumes, selectedResumePath, uploadedResumePath, resumesLoading])

  // Event Handlers
  const handleResumeSelect = useCallback((path: string) => {
    setSelectedResumePath(path)
    setResumeFile(null)
    setIsFormDirty(true)
    clearError('resume')
  }, [clearError])

  const handleFileUpload = useCallback(async (file: File) => {
    console.log('handleFileUpload called with file:', file.name, file.size, file.type)

    const fileError = validateFile(file)
    if (fileError) {
      console.log('File validation error:', fileError)
      setValidationError('resume', fileError)
      return
    }

    // Upload resume immediately upon selection
    setUploadingResume(true)
    try {
      console.log('Uploading resume to database...')
      const formData = new FormData()
      formData.append('resume', file)

      const uploadRes = await fetch('/api/candidate/upload-resume', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (!uploadRes.ok) {
        const contentType = uploadRes.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          const data = await uploadRes.json()
          throw new Error(data.error || 'Failed to upload resume.')
        } else {
          const text = await uploadRes.text()
          throw new Error(`Server error: ${text.substring(0, 100)}`)
        }
      }

      const uploadData = await uploadRes.json()
      const uploadedPath = uploadData.resumePath
      console.log('Resume uploaded successfully:', uploadedPath)

      // Store the uploaded path and file for parsing during submission
      setUploadedResumePath(uploadedPath)
      setResumeFile(file) // Keep file for parsing
      setSelectedResumePath(null)
      setUploadSuccess(true)
      // Refresh the resumes list to include the new upload
      await fetchResumes()
      // Hide success message after 3 seconds
      setTimeout(() => setUploadSuccess(false), 3000)
      setIsFormDirty(true)
      clearError('resume')
    } catch (uploadError) {
      console.error('Resume upload error:', uploadError)
      setValidationError('resume', uploadError instanceof Error ? uploadError.message : 'Failed to upload resume.')
    } finally {
      setUploadingResume(false)
    }
  }, [validateFile, setValidationError, clearError, fetchResumes])

  const handleEmailChange = useCallback((newEmail: string) => {
    setEmail(newEmail)
    setIsFormDirty(true)
    
    if (newEmail && !validateEmail(newEmail)) {
      setValidationError('email', 'Please enter a valid email address')
    } else {
      clearError('email')
    }
  }, [setEmail, validateEmail, setValidationError, clearError])

  const parseCv = async (file: File): Promise<ParsedCVData | null> => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('https://jobboard-backend-ht5v.onrender.com/parse-cv', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        throw new Error(`CV parsing failed with status: ${res.status}`)
      }

      return await res.json()
    } catch (err) {
      console.error('Error parsing CV:', err)
      throw new Error('Failed to parse CV. Please try again.')
    }
  }

  const validateForm = (): boolean => {
    if (!email) {
      setError('Email is required')
      return false
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return false
    }

    if (!uploadedResumePath && !selectedResumePath) {
      setError('Please select a resume or upload a new one.')
      return false
    }

    if (!jobId) {
      setError('Job ID is missing.')
      return false
    }

    if (!employerId) {
      setError('Employer ID is missing.')
      return false
    }

    setError(null)
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    // Additional validation for required props
    if (!jobId || !employerId) {
      setError('Job information is missing. Please refresh the page and try again.')
      return
    }

    // Enhanced jobSlug validation with multiple fallbacks
    console.log('Before submission - jobSlug:', jobSlug, 'jobId:', jobId)

    let finalJobSlug = jobSlug

    // If jobSlug is undefined, try to get it from current URL or use jobId as fallback
    if (!finalJobSlug) {
      // Try to extract from current URL path
      const currentPath = window.location.pathname
      const pathSegments = currentPath.split('/')
      const slugFromUrl = pathSegments[2] // /jobs/[slug]/...
      
      if (slugFromUrl && slugFromUrl !== 'undefined') {
        finalJobSlug = slugFromUrl
        console.log('Using slug from URL:', finalJobSlug)
      } else {
        // Use jobId as last resort fallback
        finalJobSlug = jobId
        console.log('Using jobId as fallback slug:', finalJobSlug)
      }
    }

      // Final validation
      if (!finalJobSlug || finalJobSlug === 'undefined') {
        console.error('Cannot determine jobSlug for redirect. Using generic thank-you page.')
        // Redirect to generic thank-you page without slug
        router.push(`/thank-you?jobId=${jobId}`)
        return
      }
      
      // Fix for app router dynamic href issue: use replace instead of Link with dynamic href
      // So we do not use <Link href={`/jobs/${finalJobSlug}`}> anywhere in this file or related components

    setIsSubmitting(true)
    setLoading(true)

    try {
      let resumePath: string | null = null
      let isNewResume = false

      if (uploadedResumePath) {
        resumePath = uploadedResumePath
        isNewResume = true
      } else if (selectedResumePath) {
        resumePath = selectedResumePath
        isNewResume = false
      }

      if (!resumePath) {
        setError('Please select a resume or upload a new one.')
        return
      }

      // Parse CV if it's a new file
      let parsedData: ParsedCVData | null = null
      if (isNewResume && resumeFile) {
        try {
          parsedData = await parseCv(resumeFile)
          if (parsedData) {
            if (parsedData.email) {
              setEmail(parsedData.email)
            }
            if (parsedData.name) setExtractedName(parsedData.name)
            if (parsedData.phone) setExtractedPhone(parsedData.phone)
            if (parsedData.skills) setExtractedSkills(parsedData.skills)
          }
        } catch (parseError) {
          console.error('CV parsing error:', parseError)
          // Continue with application even if parsing fails
        }
      }

      // Prepare form data
      const formData = new FormData()
      formData.append('jobId', jobId || '')
      formData.append('employerId', String(employerId || ''))
      formData.append('email', email || '')

      if (parsedData) {
        if (parsedData.email) formData.append('extractedEmail', parsedData.email)
        if (parsedData.name) formData.append('extractedName', parsedData.name)
        if (parsedData.phone) formData.append('extractedPhone', parsedData.phone)
        if (parsedData.skills) formData.append('extractedSkills', parsedData.skills)
        if (parsedData.text) formData.append('extractedText', parsedData.text)
      }

      formData.append('resumePath', resumePath)

      // Submit application
      const res = await fetch('/api/application', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (!res.ok) {
        const contentType = res.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json()
          throw new Error(data.error || 'Failed to submit application.')
        } else {
          const text = await res.text()
          throw new Error(`Server error: ${text.substring(0, 100)}`)
        }
      }

      const data = await res.json()
      
      // Safe navigation with multiple fallbacks
      const redirectUrl = `/jobs/${encodeURIComponent(finalJobSlug)}/thank-you?score=${data.score || 0}`
      console.log('Redirecting to:', redirectUrl)
      router.push(redirectUrl)
      
    } catch (err) {
      console.error('Application submission error:', err)
      setError(err instanceof Error ? err.message : 'Network error: Please check your connection and try again.')
    } finally {
      setLoading(false)
      setIsSubmitting(false)
    }
  }

  // Loading state
  if (profileLoading || resumesLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-lg">Loading application form...</div>
      </div>
    )
  }

  return (
    <div className="application-form">
      {hasApplied ? (
        <AlreadyAppliedMessage applicationDate={applicationDate} />
      ) : (
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
          <ResumeSelector
            resumes={processedResumes}
            selectedResumePath={selectedResumePath}
            resumeFile={resumeFile}
            onResumeSelect={handleResumeSelect}
            onFileUpload={handleFileUpload}
            loading={resumesLoading}
            uploadingResume={uploadingResume}
            uploadSuccess={uploadSuccess}
          />

          <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            placeholder="your.email@example.com"
            className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${
              errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-500'
            } text-gray-900 dark:text-white`}
            required
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

          {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
            <p className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</p>
          </div>
        )}

          <button
            type="submit"
            disabled={isSubmitting || (!uploadedResumePath && !selectedResumePath) || !email || !!errors.email}
            className="w-full secondaryButton-dark disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-200"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              'Submit Application'
            )}
          </button>

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            By submitting this application, you agree to our privacy policy and terms of service.
          </p>
        </form>
      )}
    </div>
  )
}
