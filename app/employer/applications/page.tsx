'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface Application {
  id: number
  candidateId: number | null
  employerId: number
  jobId: string
  status: string
  resumePath: string
  extractedText: string | null
  extractedName: string | null
  extractedEmail: string | null
  extractedPhone: string | null
  extractedSkills: string | null
  yearsExperience: number | null
  careerLevel: string | null
  experienceRelatedToJob: number | null
  createdAt: string
  score: number | null
  candidate: {
    id: number
    name: string | null
    email: string
    address: string | null
    mobileNumber: string | null
  } | null
  job: {
    id: string
    title: string
    description: string
    location: string | null
  }
}

type SortOption = 'score_desc' | 'createdAt_desc' | 'address_asc' | 'experience_desc' | 'jobFit_desc'
type StatusFilter = 'all' | 'pending' | 'viewed' | 'accepted' | 'rejected'

export default function ApplicationsPage() {
  const router = useRouter()
  const [sortBy, setSortBy] = useState<SortOption>('createdAt_desc')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchApplications()
  }, [sortBy, statusFilter])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams({
        sort: sortBy,
        status: statusFilter,
        search: searchTerm
      }).toString()

      const res = await fetch(`/api/applications?${queryParams}`)
      if (res.ok) {
        const data = await res.json()
        setJobs(data.jobs)
        
        // Auto-expand jobs with applications
        const jobIdsWithApplications = data.jobs
          .filter((job: any) => job.applications.length > 0)
          .map((job: any) => job.job.id)
        setExpandedJobs(new Set(jobIdsWithApplications))
      } else {
        console.error('Failed to fetch applications')
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleJobExpansion = (jobId: string) => {
    const newExpanded = new Set(expandedJobs)
    if (newExpanded.has(jobId)) {
      newExpanded.delete(jobId)
    } else {
      newExpanded.add(jobId)
    }
    setExpandedJobs(newExpanded)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200'
      case 'viewed': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-gray-500'
    if (score >= 8) return 'text-green-600'
    if (score >= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const parseSkills = (skills: string | null): string[] => {
    if (!skills) return []
    try {
      const parsed = JSON.parse(skills)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return skills.split(',').map(s => s.trim()).filter(Boolean)
    }
  }

  const ApplicationCard = ({ application }: { application: Application }) => (
    <div className="bg-card/50 p-4 rounded-lg border border-border hover:border-primary/20 transition-all duration-200 group">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {application.extractedName || application.candidate?.name || 'Unnamed Candidate'}
            </h4>
            <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(application.status)}`}>
              {application.status}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            Applied: {new Date(application.createdAt).toLocaleDateString()} • 
            Rating: <span className={`font-semibold ${getScoreColor(application.score)}`}>
              {application.score ? application.score.toFixed(1) : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        <div>
          <div className="text-xs text-muted-foreground mb-1">📧 Email</div>
          <div className="text-sm text-foreground truncate">{application.extractedEmail || application.candidate?.email || '-'}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">📞 Phone</div>
          <div className="text-sm text-foreground">{application.extractedPhone || application.candidate?.mobileNumber || '-'}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">📍 Location</div>
          <div className="text-sm text-foreground truncate">{application.candidate?.address || '-'}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">💼 Experience</div>
          <div className="text-sm text-foreground">{application.yearsExperience ? `${application.yearsExperience} years` : '-'}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div>
          <div className="text-xs text-muted-foreground mb-1">🎯 Career Level</div>
          <div className="text-sm text-foreground">{application.careerLevel || '-'}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">📊 Job Fit</div>
          <div className="text-sm text-foreground font-semibold">
            {application.experienceRelatedToJob ? (application.experienceRelatedToJob * 100).toFixed(1) + '%' : '-'}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">🛠️ Top Skills</div>
          <div className="text-sm text-foreground truncate">
            {parseSkills(application.extractedSkills).slice(0, 3).join(', ') || '-'}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-border">
        <div className="flex gap-3">
          <button
            onClick={() => window.open(application.resumePath, '_blank')}
            className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded hover:bg-primary/90 transition-colors"
            disabled={!application.resumePath}
          >
            📄 Download CV
          </button>
          <button
            onClick={() => router.push(`/employer/applications/${application.id}`)}
            className="text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded hover:bg-secondary/90 transition-colors"
          >
            👁️ View Details
          </button>
        </div>
        <div className="text-xs text-muted-foreground">
          ID: {application.id}
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-center">
            <div className="w-8 h-8 bg-primary rounded-full mx-auto mb-2"></div>
            <div className="text-foreground">Loading applications...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Candidate Applications</h1>
          <p className="text-muted-foreground">Manage and review all job applications in one place</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-card rounded-lg p-6 mb-6 border border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Search Candidates</label>
              <input
                type="text"
                placeholder="Search by name, skills, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchApplications()}
                className="w-full p-2 border border-border rounded bg-background text-foreground placeholder-muted-foreground"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Sort By</label>
              <select
                className="w-full p-2 border border-border rounded bg-background text-foreground"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
              >
                <option value="createdAt_desc">Date (Newest First)</option>
                <option value="score_desc">Rating (High to Low)</option>
                <option value="experience_desc">Experience (High to Low)</option>
                <option value="jobFit_desc">Job Fit (High to Low)</option>
                <option value="address_asc">Location (A-Z)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Status Filter</label>
              <select
                className="w-full p-2 border border-border rounded bg-background text-foreground"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="viewed">Viewed</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={fetchApplications}
              className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition-colors"
            >
              🔍 Apply Filters
            </button>
            <button
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
                setSortBy('createdAt_desc')
              }}
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary/90 transition-colors"
            >
              🗑️ Clear
            </button>
          </div>
        </div>

        {/* Applications List */}
        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No applications found</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your filters or search terms' 
                : 'Applications will appear here once candidates start applying'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {jobs.map(jobData => (
              <div key={jobData.job.id} className="bg-card rounded-lg border border-border overflow-hidden">
                {/* Job Header */}
                <div 
                  className="p-6 cursor-pointer hover:bg-card/80 transition-colors"
                  onClick={() => toggleJobExpansion(jobData.job.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {jobData.job.title}
                        <span className="ml-3 text-sm bg-primary/20 text-primary px-2 py-1 rounded">
                          {jobData.applications.length} application{jobData.applications.length !== 1 ? 's' : ''}
                        </span>
                      </h3>
                      <p className="text-muted-foreground mb-2">
                        {jobData.job.description.slice(0, 120)}
                        {jobData.job.description.length > 120 && '...'}
                      </p>
                      {jobData.job.location && (
                        <p className="text-sm text-muted-foreground">📍 {jobData.job.location}</p>
                      )}
                    </div>
                    <div className="text-2xl text-muted-foreground ml-4">
                      {expandedJobs.has(jobData.job.id) ? '▼' : '▶'}
                    </div>
                  </div>
                </div>

                {/* Applications for this job */}
                {expandedJobs.has(jobData.job.id) && (
                  <div className="border-t border-border">
                    <div className="p-6 space-y-4">
                      {jobData.applications.map((application: Application) => (
                        <ApplicationCard key={application.id} application={application} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {jobs.length > 0 && (
          <div className="mt-8 bg-card rounded-lg p-6 border border-border">
            <h4 className="font-semibold text-foreground mb-4">Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {jobs.reduce((total, job) => total + job.applications.length, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Applications</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {jobs.length}
                </div>
                <div className="text-sm text-muted-foreground">Active Jobs</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {jobs.flatMap(job => job.applications).filter((app: Application) => app.status === 'accepted').length}
                </div>
                <div className="text-sm text-muted-foreground">Accepted</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {Math.round(jobs.flatMap(job => job.applications).filter((app: Application) => app.score && app.score >= 7).length / 
                    jobs.reduce((total, job) => total + job.applications.length, 0) * 100) || 0}%
                </div>
                <div className="text-sm text-muted-foreground">High Ratings (7+)</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}