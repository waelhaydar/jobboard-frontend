'use client'

import { useState, useEffect } from 'react'


interface User {
  id: number
  email: string
  name: string | null
  role: string
  createdAt: string
}

interface Employer {
  id: number
  companyName: string
  email: string
  approved: boolean
  createdAt: string
}

interface Job {
  id: number
  title: string
  slug: string
  description: string
  location: string | null
  approved: boolean
  createdAt: string
  employerId: number
}

interface Application {
  id: number
  applicantId: number | null
  employerId: number
  jobId: number
  resumePath: string
  createdAt: string
}

interface Notification {
  id: number
  title: string
  body: string
  read: boolean
  admin: boolean
  employerId: number | null
  createdAt: string
}

export default function DatabasePage() {
  const [users, setUsers] = useState<User[]>([])
  const [employers, setEmployers] = useState<Employer[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [usersRes, employersRes, jobsRes, appsRes, notifsRes] = await Promise.all([
          fetch('/api/admin/getUsers'),
          fetch('/api/admin/getEmployers'),
          fetch('/api/admin/getJobs'),
          fetch('/api/admin/getApplications'),
          fetch('/api/admin/getNotifications')
        ])
        if (usersRes.ok) setUsers(await usersRes.json())
        if (employersRes.ok) setEmployers(await employersRes.json())
        if (jobsRes.ok) setJobs(await jobsRes.json())
        if (appsRes.ok) setApplications(await appsRes.json())
        if (notifsRes.ok) setNotifications(await notifsRes.json())
      } catch (error) {
        console.error('Error fetching data:', error)
        setMessage({ type: 'error', text: 'Failed to fetch data. Please try again later.' })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

const handleDelete = async (type: string, id: number) => {
  if (!confirm(`Are you sure you want to delete this ${type}?`)) return
  try {
    const res = await fetch(`/api/admin/delete/${type.toLowerCase()}/${id}`, { method: 'DELETE' })
    if (res.ok) {
      window.location.reload()
    } else {
      alert('Failed to delete')
      console.error('Failed to delete:', await res.json())
    }
  } catch (error) {
    console.error('Error deleting:', error)
    alert('Error deleting')
  }
}


  return (
    <>
      <div className="max-w-7xl mx-auto p-6 bg-job-background-bg">
        <h1 className="text-3xl font-bold mb-6">Database Data Overview</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Users ({users.length})</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Role</th>
                  <th className="border px-4 py-2">Created At</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td className="border px-4 py-2">{user.id}</td>
                    <td className="border px-4 py-2">{user.email}</td>
                    <td className="border px-4 py-2">{user.name || '-'}</td>
                    <td className="border px-4 py-2">{user.role}</td>
                    <td className="border px-4 py-2">{new Date(user.createdAt).toLocaleString()}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleDelete('User', user.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Employers ({employers.length})</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Company Name</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Approved</th>
                  <th className="border px-4 py-2">Created At</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employers.map(employer => (
                  <tr key={employer.id}>
                    <td className="border px-4 py-2">{employer.id}</td>
                    <td className="border px-4 py-2">{employer.companyName}</td>
                    <td className="border px-4 py-2">{employer.email}</td>
                    <td className="border px-4 py-2">{employer.approved ? 'Yes' : 'No'}</td>
                    <td className="border px-4 py-2">{new Date(employer.createdAt).toLocaleString()}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleDelete('Employer', employer.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Jobs ({jobs.length})</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Title</th>
                  <th className="border px-4 py-2">Slug</th>
                  <th className="border px-4 py-2">Approved</th>
                  <th className="border px-4 py-2">Employer ID</th>
                  <th className="border px-4 py-2">Created At</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job.id}>
                    <td className="border px-4 py-2">{job.id}</td>
                    <td className="border px-4 py-2">{job.title}</td>
                    <td className="border px-4 py-2">{job.slug}</td>
                    <td className="border px-4 py-2">{job.approved ? 'Yes' : 'No'}</td>
                    <td className="border px-4 py-2">{job.employerId}</td>
                    <td className="border px-4 py-2">{new Date(job.createdAt).toLocaleString()}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleDelete('Job', job.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

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
                  <th className="border px-4 py-2">Resume Path</th>
                  <th className="border px-4 py-2">Created At</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.id}>
                    <td className="border px-4 py-2">{app.id}</td>
                    <td className="border px-4 py-2">{app.applicantId || '-'}</td>
                    <td className="border px-4 py-2">{app.employerId}</td>
                    <td className="border px-4 py-2">{app.jobId}</td>
                    <td className="border px-4 py-2">{app.resumePath}</td>
                    <td className="border px-4 py-2">{new Date(app.createdAt).toLocaleString()}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleDelete('Application', app.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Notifications ({notifications.length})</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Title</th>
                  <th className="border px-4 py-2">Body</th>
                  <th className="border px-4 py-2">Read</th>
                  <th className="border px-4 py-2">Admin</th>
                  <th className="border px-4 py-2">Employer ID</th>
                  <th className="border px-4 py-2">Created At</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map(notif => (
                  <tr key={notif.id}>
                    <td className="border px-4 py-2">{notif.id}</td>
                    <td className="border px-4 py-2">{notif.title}</td>
                    <td className="border px-4 py-2">{notif.body}</td>
                    <td className="border px-4 py-2">{notif.read ? 'Yes' : 'No'}</td>
                    <td className="border px-4 py-2">{notif.admin ? 'Yes' : 'No'}</td>
                    <td className="border px-4 py-2">{notif.employerId || '-'}</td>
                    <td className="border px-4 py-2">{new Date(notif.createdAt).toLocaleString()}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleDelete('Notification', notif.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  )
}
