'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import AccessDenied from 'components/AccessDenied'
import { User, Calendar, MapPin, Briefcase, Phone, Mail, CheckCircle, XCircle, Clock, Eye, UserCheck, UserX, FileText } from 'lucide-react'

interface Application {
  id: number
  status: string
  createdAt: string
  job: { title: string }
}

interface Candidate {
  id: number
  email: string
  name: string | null
  dob: string | null
  address: string | null
  lastJobPosition: string | null
  lastJobLocation: string | null
  mobileNumber: string | null
  resumeUrl: string | null
  createdAt: string
  applications: Application[]
}

interface AuthResult {
  type: string
  user: Candidate | null
  email: string | null
}

export default function CandidateProfile() {
  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    address: '',
    lastJobPosition: '',
    lastJobLocation: '',
    mobileNumber: '',
    password: '', // Added for registration completion
  })
  const router = useRouter()
  const searchParams = useSearchParams()
  const jobId = searchParams?.get('jobId')

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  const formatDateInput = (value: string) => {
    // Auto format date input like 1/4/25 to 01-04-2025
    const parts = value.replace(/\D/g, '/').split('/').filter(p => p)
    if (parts.length >= 3) {
      const day = parts[0].padStart(2, '0')
      const month = parts[1].padStart(2, '0')
      let year = parts[2]
      if (year.length === 2) {
        year = '20' + year
      }
      return `${day}-${month}-${year}`
    }
    return value
  }

  useEffect(() => {
    if (searchParams?.get('edit') === 'true') {
      setIsEditing(true)
    }
  }, [searchParams])

  // Validate jobId parameter to prevent object serialization issues
  const validJobId = typeof jobId === 'string' && jobId.trim() ? jobId.trim() : null

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/candidate/profile')
        const data = await res.json()

        // Handle authentication errors
        if (res.status === 401) {
          setError('unauthorized')
          setLoading(false)
          return
        }

        if (data.error) {
          setError(data.error)
        } else {
          // Handle both existing candidates and pending candidates
          if (data.isPending) {
            setIsPending(true)
            setIsEditing(true)
            setFormData(prev => ({
              ...prev,
              password: '',
              email: data.email || ''
            }))
          } else if (data.candidate) {
            setCandidate(data.candidate)
            setFormData({
              name: data.candidate.name || '',
              dob: data.candidate.dob ? new Date(data.candidate.dob).toISOString().substring(0, 10) : '',
              address: data.candidate.address || '',
              lastJobPosition: data.candidate.lastJobPosition || '',
              lastJobLocation: data.candidate.lastJobLocation || '',
              mobileNumber: data.candidate.mobileNumber || '',
              password: '', // Password not needed for existing candidates
            })
          }
        }
      } catch (err) {
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleCancelClick = () => {
    if (candidate) {
      setFormData({
        name: candidate.name || '',
        dob: candidate.dob ? new Date(candidate.dob).toISOString().substring(0, 10) : '',
        address: candidate.address || '',
        lastJobPosition: candidate.lastJobPosition || '',
        lastJobLocation: candidate.lastJobLocation || '',
        mobileNumber: candidate.mobileNumber || '',
        password: '',
      })
    }
    setIsEditing(false)
  }

  const validateForm = () => {
    const requiredFields = ['name', 'dob', 'address', 'lastJobPosition', 'lastJobLocation', 'mobileNumber']
    if (isPending) {
      requiredFields.push('password')
    }

    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]?.trim()) {
        return `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`
      }
    }

    return null
  }

  const handleSaveClick = async () => {
    try {
      // Validate all required fields
      const validationError = validateForm()
      if (validationError) {
        setError(validationError)
        return
      }

      // Prepare the data with proper date formatting
      const submitData = {
        ...formData,
        // Convert date string to ISO format for Prisma
        dob: formData.dob ? new Date(formData.dob).toISOString() : null,
      }

      const response = await fetch('/api/candidate/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })
      const data = await response.json()
      if (response.ok) {
        setCandidate(data.candidate)
        setIsEditing(false)
        setIsPending(false)
        setError('')
        setShowSuccessMessage(true)

        // Show success message and redirect
        setTimeout(async () => {
          if (validJobId) {
            const jobRes = await fetch(`/api/jobs/${validJobId}/slug`)
            const jobData = await jobRes.json()
            if (jobRes.ok && jobData.slug) {
              router.push(`/jobs/${jobData.slug}`)
            } else {
              router.push('/jobs')
            }
          } else {
            router.push('/jobs')
          }
        }, 2000) // Redirect after 2 seconds to show the success message
      } else {
        setError(data.error || 'Failed to update profile')
      }
    } catch (error) {
      setError('Failed to update profile')
    }
  }

  // Show AccessDenied component for unauthorized users
  if (error === 'unauthorized') {
    return <AccessDenied message="Please sign in to access your candidate profile." />
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
  if (error && !isPending) return <div className="flex items-center justify-center min-h-screen text-red-600 text-lg">{error}</div>
  if (!candidate && !isPending) return <div className="flex items-center justify-center min-h-screen text-gray-600 text-lg">No profile found</div>

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-xl border border-gray-200">
        <div className="flex items-center mb-8">
          <User className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-4xl font-bold text-gray-800">
            {isPending ? 'Complete Your Profile' : 'Candidate Profile'}
          </h1>
        </div>

        {isPending && (
          <div className="mb-8 p-4 bg-job-blue-50-bg border border-blue-200 rounded-lg">
            <p className="text-blue-800">
              Welcome! Please complete your profile to finish registration.
            </p>
          </div>
        )}

        {!isEditing && !isPending && (
          <button
            onClick={handleEditClick}
            className="mb-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center"
          >
            <User className="h-4 w-4 mr-2" />
            Edit Profile
          </button>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <label className="flex items-center text-lg font-medium text-gray-700 mb-2">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Name <span className="text-red-500 ml-1">*</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                  required
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{candidate?.name || 'Not provided'}</p>
              )}
            </div>

            {!candidate && (
              <div>
                <label className="flex items-center text-lg font-medium text-gray-700 mb-2">
                  <Mail className="h-5 w-5 mr-2 text-blue-600" />
                  Email
                </label>
                <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">Will be set after registration completion</p>
              </div>
            )}

            {candidate && (
              <div>
                <label className="flex items-center text-lg font-medium text-gray-700 mb-2">
                  <Mail className="h-5 w-5 mr-2 text-blue-600" />
                  Email
                </label>
                <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{candidate.email}</p>
              </div>
            )}

            <div>
              <label className="flex items-center text-lg font-medium text-gray-700 mb-2">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                Date of Birth <span className="text-red-500 ml-1">*</span>
              </label>
              {isEditing ? (
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{candidate?.dob ? new Date(candidate.dob).toLocaleDateString() : 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="flex items-center text-lg font-medium text-gray-700 mb-2">
                <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                Address <span className="text-red-500 ml-1">*</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{candidate?.address || 'Not provided'}</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="flex items-center text-lg font-medium text-gray-700 mb-2">
                <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                Last Job Position <span className="text-red-500 ml-1">*</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="lastJobPosition"
                  value={formData.lastJobPosition}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{candidate?.lastJobPosition || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="flex items-center text-lg font-medium text-gray-700 mb-2">
                <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                Last Job Location <span className="text-red-500 ml-1">*</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="lastJobLocation"
                  value={formData.lastJobLocation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{candidate?.lastJobLocation || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="flex items-center text-lg font-medium text-gray-700 mb-2">
                <Phone className="h-5 w-5 mr-2 text-blue-600" />
                Mobile Number <span className="text-red-500 ml-1">*</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{candidate?.mobileNumber || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="flex items-center text-lg font-medium text-gray-700 mb-2">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Resume
              </label>
              {candidate?.resumeUrl ? (
                <a href={candidate.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline px-4 py-3 bg-gray-50 rounded-lg block">
                  View Resume
                </a>
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">Not uploaded</p>
              )}
            </div>

            {/* Password field for new candidates */}
            {isPending && (
              <div>
                <label className="flex items-center text-lg font-medium text-gray-700 mb-2">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Password <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                  placeholder="Enter your password to complete registration"
                  required
                />
              </div>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="mt-8 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <button
              onClick={handleSaveClick}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 flex items-center justify-center"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {isPending ? 'Complete Registration' : 'Save'}
            </button>
            {!isPending && (
              <button
                onClick={handleCancelClick}
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-200 flex items-center justify-center"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancel
              </button>
            )}
          </div>
        )}

        {/* Success message after registration */}
        {showSuccessMessage && (
          <div className="mt-8 p-4 bg-job-green-50-bg border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  Your profile is ready now you can continue your job application
                </p>
                <p className="text-sm text-green-700 mt-1">
                  Redirecting to jobs page in 2 seconds...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Only show applications section for registered candidates */}
        {candidate && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <Briefcase className="h-6 w-6 mr-3 text-blue-600" />
              My Applications
            </h2>
            {(candidate.applications && candidate.applications.length > 0) ? (
              <ul className="space-y-4">
                {candidate.applications.map(app => (
                  <li key={app.id} className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition duration-200">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                      <div className="mb-2 sm:mb-0">
                        <div className="font-semibold text-lg text-gray-800">{app.job.title}</div>
                        <div className="text-sm text-job-gray-500-color flex items-center mt-1">
                          <Clock className="h-4 w-4 mr-1" />
                          Applied: {new Date(app.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${app.status === 'PENDING' ? 'bg-job-yellow-200-bg text-yellow-800' : app.status === 'VIEWED' ? 'bg-job-blue-200-bg text-blue-800' : app.status === 'ACCEPTED' ? 'bg-job-green-200-bg text-green-800' : app.status === 'REJECTED' ? 'bg-job-red-200-bg text-red-800' : 'bg-job-gray-200-bg text-gray-800'} flex items-center`}>
                        {app.status === 'PENDING' && <Clock className="h-4 w-4 mr-1" />}
                        {app.status === 'VIEWED' && <Eye className="h-4 w-4 mr-1" />}
                        {app.status === 'ACCEPTED' && <UserCheck className="h-4 w-4 mr-1" />}
                        {app.status === 'REJECTED' && <UserX className="h-4 w-4 mr-1" />}
                        {app.status}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 text-lg">No applications yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
