import { prisma } from '../../../lib/prismaClient'
import { getEntityFromToken } from '../../../lib/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminSidebar from '../../../components/AdminSidebar'

export default async function AdminJobsPage() {
  const token = cookies().get('token')?.value
  const entity = await getEntityFromToken(token)
  if (!entity || entity.type !== 'admin') {
    redirect('/auth/login')
  }

  const jobs = await prisma.job.findMany({ include: { employer: true } })

  return (
    <div className="flex min-h-screen w-full bg-gray-900">
      <AdminSidebar currentPath="/admin/jobs" />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-white mb-6">All Job Posts</h1>

        {jobs.length === 0 ? (
          <p className="text-gray-400 p-4 bg-gray-800 rounded-lg shadow-md mt-4">No job posts found.</p>
        ) : (
          <ul className="bg-gray-800 shadow-md rounded-lg divide-y divide-gray-600">
            {jobs.map(job => (
              <li key={job.id} className="p-4 flex items-center justify-between">
                <div>
                  <strong className="text-white">{job.title}</strong> by <span className="text-blue-400">{job.employer?.companyName}</span>
                  <div className="text-sm text-gray-300 mt-1">{job.description.split('\n\n')[0]}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}

// ...existing code ...
