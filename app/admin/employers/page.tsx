import { prisma } from '../../../lib/prismaClient'
import { getEntityFromToken } from '../../../lib/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminSidebar from '../../../components/AdminSidebar'

export default async function AdminEmployersPage() {
  const token = cookies().get('token')?.value
  const entity = await getEntityFromToken(token)
  if (!entity || entity.type !== 'admin') {
    redirect('/auth/login')
  }

  const employers = await prisma.employer.findMany()

  return (
    <div className="flex min-h-screen w-full bg-gray-900">
      <AdminSidebar currentPath="/admin/employers" />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-white mb-6">All Employers</h1>

        {employers.length === 0 ? (
          <p className="text-gray-400 p-4 bg-gray-800 rounded-lg shadow-md mt-4">No employers found.</p>
        ) : (
          <ul className="bg-gray-800 shadow-md rounded-lg divide-y divide-gray-600">
            {employers.map(employer => (
              <li key={employer.id} className="p-4 flex items-center justify-between">
                <div>
                  <strong className="text-white">{employer.companyName}</strong>
                  <div className="text-sm text-gray-300">{employer.email}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
