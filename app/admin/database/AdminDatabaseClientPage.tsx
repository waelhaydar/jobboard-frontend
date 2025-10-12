"use client"
import { useState } from 'react'
import AdminSidebar from '../../../components/AdminSidebar'

export default function AdminDatabaseClientPage({
  initialCandidates,
  initialEmployers,
  initialJobs,
  initialAdmins,
  initialApplications,
  initialNotifications,
}) {
  const [candidates, setCandidates] = useState(initialCandidates)
  const [employers, setEmployers] = useState(initialEmployers)
  const [jobs, setJobs] = useState(initialJobs)
  const [admins, setAdmins] = useState(initialAdmins)
  const [applications, setApplications] = useState(initialApplications)
  const [notifications, setNotifications] = useState(initialNotifications)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleDelete = async (entityType, id, displayName) => {
    if (!confirm(`Are you sure you want to delete this ${entityType}: ${displayName}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/delete/${entityType}/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Update the state to reflect the deletion
        switch (entityType) {
          case 'candidate':
            setCandidates(candidates.filter(item => item.id !== id))
            break
          case 'employer':
            setEmployers(employers.filter(item => item.id !== id))
            break
          case 'job':
            setJobs(jobs.filter(item => item.id !== id))
            break
          case 'admin':
            setAdmins(admins.filter(item => item.id !== id))
            break
          case 'application':
            setApplications(applications.filter(item => item.id !== id))
            break
          case 'notification':
            setNotifications(notifications.filter(item => item.id !== id))
            break
          default:
            break
        }
        setSuccessMessage(`${entityType} deleted successfully!`)
      } else {
        const errorData = await response.json()
        setErrorMessage(`Failed to delete ${entityType}: ${errorData.error}`)
      }
    } catch (error) {
      console.error(`Error deleting ${entityType}:`, error)
      setErrorMessage(`An error occurred while deleting ${entityType}.`)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-900">
      <AdminSidebar currentPath="/admin/database" />

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-white mb-6">Database Management</h1>

        {successMessage && (
          <div className="bg-green-900 border border-green-400 text-green-300 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline"> {successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-900 border border-red-400 text-red-300 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {errorMessage}</span>
          </div>
        )}

        {/* Candidates Section */}
        <section className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Candidates</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {candidates.map(candidate => (
                  <tr key={candidate.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{candidate.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{candidate.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{candidate.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete('candidate', candidate.id, candidate.name)}
                        className="text-red-600 hover:text-red-900"
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

        {/* Employers Section */}
        <section className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Employers</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {employers.map(employer => (
                  <tr key={employer.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{employer.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{employer.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{employer.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete('employer', employer.id, employer.name)}
                        className="text-red-600 hover:text-red-900"
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

        {/* Jobs Section */}
        <section className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Jobs</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Employer</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {jobs.map(job => (
                  <tr key={job.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{job.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{job.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{job.employer.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete('job', job.id, job.title)}
                        className="text-red-600 hover:text-red-900"
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

        {/* Admins Section */}
        <section className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Admins</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {admins.map(admin => (
                  <tr key={admin.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{admin.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{admin.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{admin.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete('admin', admin.id, admin.name)}
                        className="text-red-600 hover:text-red-900"
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

        {/* Applications Section */}
        <section className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Applications</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Job ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Candidate ID</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {applications.map(application => (
                  <tr key={application.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{application.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{application.jobId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{application.candidateId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete('application', application.id, `Application ${application.id}`)}
                        className="text-red-600 hover:text-red-900"
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

        {/* Notifications Section */}
        <section className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Notifications</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Message</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {notifications.map(notification => (
                  <tr key={notification.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{notification.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{notification.userId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{notification.message}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete('notification', notification.id, `Notification ${notification.id}`)}
                        className="text-red-600 hover:text-red-900"
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
      </main>
    </div>
  )
}