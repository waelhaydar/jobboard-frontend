import { prisma } from '../../lib/prismaClient'
import { getEntityFromToken } from '../../lib/auth'
import { cookies } from 'next/headers'
import AccessDenied from '../../components/AccessDenied'
import AdminSidebar from '../../components/AdminSidebar'

export default async function AdminPage(){
  const token = cookies().get('token')?.value
  const entity = await getEntityFromToken(token)
  if (!entity || entity.type !== 'admin') {
    return <AccessDenied requiredRole="admin" />
  }

  const pendingEmployers = await prisma.employer.findMany({ where: { approved: false } })

  const totalCandidates = await prisma.candidate.count()
  const totalEmployers = await prisma.employer.count()
  const totalJobs = await prisma.job.count()

  return (
    <div className="flex min-h-screen w-full bg-gray-900">
      <AdminSidebar currentPath="/admin" />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-white mb-6">Admin Dashboard</h1>

        {/* Overview Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-300">Total Users</h3>
            <p className="text-4xl font-bold text-blue-200 mt-2">{totalCandidates + totalEmployers}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-300">Total Job Posts</h3>
            <p className="text-4xl font-bold text-green-200 mt-2">{totalJobs}</p>
          </div>
        </section>

        <section className="mt-4">
          <h3 className="font-semibold text-xl text-white mb-4">Pending Employers</h3>
          <ul className="bg-gray-800 shadow-md rounded-lg divide-y divide-gray-600">
            {pendingEmployers.map(e=> (
              <li key={e.id} className="p-4 flex items-center justify-between">
                <div>
                  <strong className="text-white">{e.companyName}</strong>
                  <div className="text-sm text-gray-400">{e.email}</div>
                </div>
                <div className="flex space-x-2">
                  <form action="/api/admin/approve" method="post">
                    <input type="hidden" name="id" value={String(e.id)} />
                    <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">Approve</button>
                  </form>
                  <form action="/api/admin/reject" method="post">
                    <input type="hidden" name="id" value={String(e.id)} />
                    <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">Reject</button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
          {pendingEmployers.length === 0 && (
            <p className="text-gray-400 p-4 bg-gray-800 rounded-lg shadow-md mt-4">No pending employers.</p>
          )}
        </section>
      </main>
    </div>
  )
}
