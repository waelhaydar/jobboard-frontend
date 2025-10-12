'use client'
import { useState, useEffect } from 'react'
import EmployerProfileClient from './profile/EmployerProfileClient'


interface EmployerDashboardProps {
  employer: {
    id: number
    companyName: string
    email: string
    imageUrl?: string | null
    approved: boolean
  }
  jobs: { id: string; title: string; description: string; location: string | null; slug: string }[]
  applications: {
    id: number;
    status: string;
    extractedName: string | null;
    extractedEmail: string | null;
    extractedPhone: string | null;
    extractedSkills: string | null;
    jobId: string;
    job: { title: string };
    candidate: {
      id: number;
      name: string | null;
      email: string;
      mobileNumber: string | null;
    } | null;
  }[]
}

export default function EmployerDashboard({ employer, jobs = [], applications = [] }: EmployerDashboardProps) {
  const [apps, setApps] = useState(applications)
  const totalJobs = jobs.length

  useEffect(() => {
    const handleStatusUpdate = (event: CustomEvent) => {
      const { applicationId, newStatus } = event.detail
      setApps(prevApps =>
        prevApps.map(app =>
          app.id === parseInt(applicationId) ? { ...app, status: newStatus } : app
        )
      )
    }
    window.addEventListener('applicationStatusUpdated', handleStatusUpdate as EventListener)
    return () => {
      window.removeEventListener('applicationStatusUpdated', handleStatusUpdate as EventListener)
    }
  }, [])

  return (
    <div className={`min-h-screen p-8`}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Employer Dashboard</h1>
        <a
          href="/employer/create-job"
          className="primaryButton transition inline-block"
        >
          <span>Post a New Job</span>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="p-6 mb-6 glass-dark">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Job Posts Overview</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className={`bg-secondary p-4 rounded-lg`}>
                <p className="text-lg font-medium text-muted-foreground">Total Jobs</p>
                <p className="text-3xl font-bold text-foreground">{totalJobs}</p>
              </div>
            </div>
            {jobs.length === 0 ? (
              <p className="text-muted-foreground mt-4">You haven't posted any jobs yet.</p>
            ) : (
          <ul className="mt-4 space-y-2">
            {jobs.map(job => (
              <li key={job.id} className="bg-card p-3 rounded shadow-sm border">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-lg text-foreground">{job.title}</p>
                  </div>
                  {/* Add actions like Edit/View Job */}
                  <div className="flex gap-2">
                    <a
                      href={`/jobs/${job.slug}`}
                      className="bg-primary text-primary-foreground px-3 py-1 rounded hover:bg-primary/90 transition text-sm"
                    >
                      View Job
                    </a>
                    <a
                      href={`/employer/edit-job/${job.id}`}
                      className="bg-primary text-primary-foreground px-3 py-1 rounded hover:bg-primary/90 transition text-sm"
                    >
                      Edit Job
                    </a>
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="font-semibold text-md mb-2 text-foreground">Applications</h3>
                  <ul className="space-y-2">
                    {apps.filter(app => app.jobId === job.id).map(app => (
                      <li key={app.id} className="bg-card p-2 rounded border">
                        <div className="text-foreground"><strong>Name:</strong> {app.extractedName || app.candidate?.name || 'N/A'}</div>
                        <div className="text-foreground"><strong>Email:</strong> {app.extractedEmail || app.candidate?.email || 'N/A'}</div>
                        <div className="text-foreground"><strong>Phone:</strong> {app.extractedPhone || app.candidate?.mobileNumber || 'N/A'}</div>
                        <div className="text-foreground"><strong>Skills:</strong> {app.extractedSkills || 'N/A'}</div>
                        <div className="text-foreground"><strong>Status:</strong> {app.status}</div>
                      </li>
                    ))}
                    {apps.filter(app => app.jobId === job.id).length === 0 && (
                      <li className="text-muted-foreground">No applications yet.</li>
                    )}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
          )}
        </div>
      </div>

        <div className="md:col-span-1">
          <EmployerProfileClient employer={employer} className=" top-8" showEdit={false} />
        </div>
      </div>
    </div>
  )
}
