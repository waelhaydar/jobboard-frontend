import { prisma } from '../../lib/prismaClient'

export default async function DataPage() {
  const admins = await prisma.admin.findMany()
  const candidates = await prisma.candidate.findMany()
  const employers = await prisma.employer.findMany()
  const jobs = await prisma.job.findMany()
  const applications = await prisma.application.findMany()
  const notifications = await prisma.notification.findMany()

  return (
    <div className="max-w-7xl mx-auto p-6 bg-job-background-bg">
      <h1 className="text-3xl font-bold mb-6">Database Data Overview</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Admins ({admins.length})</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(admin => (
                <tr key={admin.id}>
                  <td className="border px-4 py-2">{admin.id}</td>
                  <td className="border px-4 py-2">{admin.email}</td>
                  <td className="border px-4 py-2">{admin.name || '-'}</td>
                  <td className="border px-4 py-2">{new Date(admin.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Candidates ({candidates.length})</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map(candidate => (
                <tr key={candidate.id}>
                  <td className="border px-4 py-2">{candidate.id}</td>
                  <td className="border px-4 py-2">{candidate.email}</td>
                  <td className="border px-4 py-2">{candidate.name || '-'}</td>
                  <td className="border px-4 py-2">{new Date(candidate.createdAt).toLocaleString()}</td>
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
                <th className="border px-4 py-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {employers.map((employer) => (
                <tr key={employer.id}>
                  <td className="border px-4 py-2">{employer.id}</td>
                  <td className="border px-4 py-2">{employer.companyName}</td>
                  <td className="border px-4 py-2">{employer.email}</td>
                  <td className="border px-4 py-2">{new Date(employer.createdAt).toLocaleString()}</td>
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
                <th className="border px-4 py-2">Employer ID</th>
                <th className="border px-4 py-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td className="border px-4 py-2">{job.id}</td>
                  <td className="border px-4 py-2">{job.title}</td>
                  <td className="border px-4 py-2">{job.slug}</td>
                  <td className="border px-4 py-2">{job.employerId}</td>
                  <td className="border px-4 py-2">{new Date(job.createdAt).toLocaleString()}</td>
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
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id}>
                  <td className="border px-4 py-2">{app.id}</td>
                  <td className="border px-4 py-2">{app.candidateId || '-'}</td>
                  <td className="border px-4 py-2">{app.employerId}</td>
                  <td className="border px-4 py-2">{app.jobId}</td>
                  <td className="border px-4 py-2">{app.resumePath}</td>
                  <td className="border px-4 py-2">{new Date(app.createdAt).toLocaleString()}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
