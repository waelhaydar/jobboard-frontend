'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

interface Application {
  id: number
  status: string
  resumePath: string
  extractedName: string | null
  extractedEmail: string | null
  extractedPhone: string | null
  extractedLinkedIn: string | null
  extractedSkills: string | null
  score: number | null
  createdAt: string
  job: { 
    id: number; 
    title: string; 
    description: string; 
    location: string | null;
    status?: string;
  }
  candidate: { 
    name: string | null; 
    email: string; 
    mobileNumber: string | null; 
    address: string | null; 
    lastJobPosition: string | null; 
    lastJobLocation: string | null; 
  } | null
  yearsExperience: number | null
  careerLevel: string | null
  experienceRelatedToJob: number | null
  extractedText: string | null
  last3Positions: string | null
  educationLevel: string | null
  totalSkills: number | null
  hardSkills: string | null
  softSkills: string | null
  topKeywords: string | null
  textPreview: string | null
}

export default function ApplicationDetail() {
  const params = useParams()
  const id = params.id as string
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    fetchApplication()
  }, [id])

  const fetchApplication = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/employer/applications/${id}`, {
        credentials: 'include'
      })
      if (!res.ok) throw new Error('Failed to fetch application')
      const data = await res.json()
      setApplication(data.application)
      
      // Update application status to VIEWED if it's PENDING
      if (data.application?.status === 'PENDING') {
        await updateApplicationStatus('VIEWED')
      }
    } catch (err) {
      setError('Failed to load application details')
      console.error('Error fetching application:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateApplicationStatus = async (newStatus: 'PENDING' | 'VIEWED' | 'ACCEPTED' | 'REJECTED') => {
    try {
      setUpdatingStatus(true)
      const res = await fetch('/api/application/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: id, newStatus }),
        credentials: 'include'
      })
      
      if (!res.ok) throw new Error('Failed to update status')
      
      // Update local state
      setApplication(prev => prev ? { ...prev, status: newStatus } : null)
      
      // Dispatch event for other components
      window.dispatchEvent(new CustomEvent('applicationStatusUpdated', { 
        detail: { applicationId: id, newStatus } 
      }))
      
      return true
    } catch (err) {
      console.error('Failed to update application status:', err)
      return false
    } finally {
      setUpdatingStatus(false)
    }
  }

  const updateJobStatus = async (newStatus: string) => {
    try {
      if (!application?.job?.id) return
      
      const res = await fetch('/api/employer/jobs/update-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: application.job.id, newStatus }),
        credentials: 'include'
      })
      
      if (!res.ok) throw new Error('Failed to update job status')
      
      console.log('Job status updated successfully')
    } catch (error) {
      console.error('Error updating job status:', error)
    }
  }

  const handleDownload = async () => {
    if (application?.resumePath) {
      // Remove /public prefix if present
      const downloadPath = application.resumePath.startsWith('/public')
        ? application.resumePath.replace('/public', '')
        : application.resumePath
      window.open(downloadPath, '_blank')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleStatusUpdate = async (newStatus: 'ACCEPTED' | 'REJECTED') => {
    const success = await updateApplicationStatus(newStatus)
    if (success) {
      // Optionally update job status as well
      const jobStatus = newStatus === 'ACCEPTED' ? 'Candidate Selected' : 'Reviewing Applications'
      await updateJobStatus(jobStatus)
    }
  }

  // Helper function to parse JSON strings for array fields
  const parseField = (field: string | null): string => {
    if (!field) return 'N/A'
    try {
      const parsed = JSON.parse(field)
      if (Array.isArray(parsed)) {
        return parsed.join(', ')
      }
      return String(parsed)
    } catch {
      return field
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-background p-8 text-center text-foreground">
      <div className="animate-pulse">Loading application details...</div>
    </div>
  )
  
  if (error) return (
    <div className="min-h-screen bg-background p-8 text-center text-destructive">
      {error}
    </div>
  )
  
  if (!application) return (
    <div className="min-h-screen bg-background p-8 text-center text-foreground">
      Application not found
    </div>
  )

  return (
    <div className="min-h-screen bg-background p-8 rounded">
      <div className="max-w-6xl mx-auto bg-card p-6 rounded-lg shadow-md border glass-dark">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Application Details</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div>
                <strong>Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  application.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                  application.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                  application.status === 'VIEWED' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {application.status}
                </span>
              </div>
              <div><strong>Applied:</strong> {new Date(application.createdAt).toLocaleString()}</div>
            </div>
          </div>
          
          {/* Status Update Buttons */}
          {application.status !== 'ACCEPTED' && application.status !== 'REJECTED' && (
            <div className="flex gap-2">
              <button
                onClick={() => handleStatusUpdate('ACCEPTED')}
                disabled={updatingStatus}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition disabled:opacity-50"
              >
                {updatingStatus ? 'Updating...' : 'Accept'}
              </button>
              <button
                onClick={() => handleStatusUpdate('REJECTED')}
                disabled={updatingStatus}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition disabled:opacity-50"
              >
                {updatingStatus ? 'Updating...' : 'Reject'}
              </button>
            </div>
          )}
        </div>

        {/* Job Information */}
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <h2 className="text-xl font-semibold mb-2 text-foreground">Job Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <strong>Position:</strong> {application.job.title}
            </div>
            <div>
              <strong>Location:</strong> {application.job.location || 'N/A'}
            </div>
            {application.job.status && (
              <div>
                <strong>Job Status:</strong> {application.job.status}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Candidate Information */}
          <div className="space-y-6">
            {/* Extracted Details */}
            <div className="bg-muted p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Extracted Details</h2>
              <div className="space-y-3 text-foreground">
                <div><strong>Name:</strong> {application.extractedName || 'N/A'}</div>
                <div><strong>Email:</strong> {application.extractedEmail || 'N/A'}</div>
                <div><strong>Phone:</strong> {application.extractedPhone || 'N/A'}</div>
                <div><strong>LinkedIn:</strong> {application.extractedLinkedIn ? <a href={application.extractedLinkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{application.extractedLinkedIn}</a> : 'N/A'}</div>
                <div>
                  <strong>Skills:</strong> 
                  <div className="mt-1 text-sm">{parseField(application.extractedSkills)}</div>
                </div>
                <div>
                  <strong>Score:</strong> 
                  <span className={`ml-2 font-semibold ${
                    (application.score || 0) >= 8 ? 'text-green-600' :
                    (application.score || 0) >= 6 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {application.score !== null ? application.score : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Full Candidate Details */}
            <div className="bg-muted p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Full Candidate Details</h2>
              <div className="space-y-3 text-foreground">
                <div><strong>Name:</strong> {application.candidate?.name || 'N/A'}</div>
                <div><strong>Email:</strong> {application.candidate?.email || 'N/A'}</div>
                <div><strong>Mobile:</strong> {application.candidate?.mobileNumber || 'N/A'}</div>
                <div><strong>Address:</strong> {application.candidate?.address || 'N/A'}</div>
                <div><strong>Last Position:</strong> {application.candidate?.lastJobPosition || 'N/A'}</div>
                <div><strong>Last Location:</strong> {application.candidate?.lastJobLocation || 'N/A'}</div>
              </div>
            </div>
          </div>

          {/* Analysis Data */}
          <div className="bg-muted p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Analysis Data</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-foreground">
              <div><strong>Years Experience:</strong> {application.yearsExperience || 'N/A'}</div>
              <div><strong>Career Level:</strong> {application.careerLevel || 'N/A'}</div>
              <div><strong>Job Fit:</strong> {application.experienceRelatedToJob ? (application.experienceRelatedToJob * 100).toFixed(1) + '%' : 'N/A'}</div>
              <div><strong>Education Level:</strong> {application.educationLevel || 'N/A'}</div>
              <div><strong>Total Skills:</strong> {application.totalSkills || 'N/A'}</div>
              
              <div className="md:col-span-2">
                <strong>Last 3 Positions:</strong> 
                <div className="mt-1 text-sm">{parseField(application.last3Positions)}</div>
              </div>
              
              <div className="md:col-span-2">
                <strong>Hard Skills:</strong> 
                <div className="mt-1 text-sm">{parseField(application.hardSkills)}</div>
              </div>
              
              <div className="md:col-span-2">
                <strong>Soft Skills:</strong> 
                <div className="mt-1 text-sm">{parseField(application.softSkills)}</div>
              </div>
              
              <div className="md:col-span-2">
                <strong>Top Keywords:</strong> 
                <div className="mt-1 text-sm">{parseField(application.topKeywords)}</div>
              </div>
              
              <div className="md:col-span-2">
                <strong>Text Preview:</strong> 
                <div className="mt-1 text-sm bg-background p-2 rounded max-h-32 overflow-y-auto">
                  {application.textPreview || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-4 justify-between items-center">
          <div className="flex gap-4">
            <button
              onClick={handleDownload}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition"
            >
              Download CV
            </button>
            <button
              onClick={handlePrint}
              className="bg-secondary text-secondary-foreground px-6 py-2 rounded-lg hover:bg-secondary/90 transition"
            >
              Print Application
            </button>
          </div>
          
          {/* Quick Status Update */}
          <div className="flex gap-2">
            <span className="text-sm text-muted-foreground self-center">Quick Action:</span>
            {application.status !== 'ACCEPTED' && (
              <button
                onClick={() => handleStatusUpdate('ACCEPTED')}
                disabled={updatingStatus}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition disabled:opacity-50"
              >
                Accept Candidate
              </button>
            )}
            {application.status !== 'REJECTED' && (
              <button
                onClick={() => handleStatusUpdate('REJECTED')}
                disabled={updatingStatus}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition disabled:opacity-50"
              >
                Reject Candidate
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}