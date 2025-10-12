'use client'

import { useEffect, useState } from 'react'

interface Application {
  id: string
  candidateId: string | null
  employerId: string
  jobId: string
  status: string
  resumePath: string
  extractedName: string | null
  extractedEmail: string | null
  extractedPhone: string | null
  extractedSkills: string[]
  yearsExperience: number | null
  careerLevel: string | null
  experienceRelatedToJob: number | null
  score: number | null
  createdAt: string
}

export default function DataPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/admin/getApplications')
      if (response.ok) {
        const data = await response.json()
        setApplications(data)
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Data</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Applications ({applications.length})</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Applicant ID</th>
                <th className="border px-4 py-2">Employer ID</th>
                <th className="border px-4 py-2">Job ID</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Resume Path</th>
                <th className="border px-4 py-2">Extracted Name</th>
                <th className="border px-4 py-2">Extracted Email</th>
                <th className="border px-4 py-2">Extracted Phone</th>
                <th className="border px-4 py-2">Years Experience</th>
                <th className="border px-4 py-2">Career Level</th>
                <th className="border px-4 py-2">Job Fit (%)</th>
                <th className="border px-4 py-2">Score</th>
                <th className="border px-4 py-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id}>
                  <td className="border px-4 py-2">{app.id}</td>
                  <td className="border px-4 py-2">{app.candidateId || '-'}</td>
                  <td className="border px-4 py-2">{app.employerId}</td>
                  <td className="border px-4 py-2">{app.jobId}</td>
                  <td className="border px-4 py-2">{app.status}</td>
                  <td className="border px-4 py-2">{app.resumePath}</td>
                  <td className="border px-4 py-2">{app.extractedName || '-'}</td>
                  <td className="border px-4 py-2">{app.extractedEmail || '-'}</td>
                  <td className="border px-4 py-2">{app.extractedPhone || '-'}</td>
                  <td className="border px-4 py-2">{app.yearsExperience || '-'}</td>
                  <td className="border px-4 py-2">{app.careerLevel || '-'}</td>
                  <td className="border px-4 py-2">{app.experienceRelatedToJob ? (app.experienceRelatedToJob * 100).toFixed(1) + '%' : '-'}</td>
                  <td className="border px-4 py-2">{app.score ? app.score.toFixed(1) : '-'}</td>
                  <td className="border px-4 py-2">{new Date(app.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
