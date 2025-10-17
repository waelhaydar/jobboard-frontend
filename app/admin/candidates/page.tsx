import { prisma } from '../../../lib/prismaClient'
import { getEntityFromToken } from '../../../lib/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminSidebar from '../../../components/AdminSidebar'

export const dynamic = 'force-dynamic'

export default async function AdminCandidatesPage() {
  const token = cookies().get('token')?.value
  const entity = await getEntityFromToken(token)
  if (!entity || entity.type !== 'admin') {
    redirect('/auth/login')
  }

  const candidates = await prisma.candidate.findMany()

  return (
    <div className="flex min-h-screen w-full bg-gray-900">
      <AdminSidebar currentPath="/admin/candidates" />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-white mb-6">Candidates Management</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">All Candidates</h2>
          <div className="bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-600">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Resume</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-600">
                {candidates.map((candidate) => (
                  <tr key={candidate.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{candidate.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{candidate.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{candidate.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-400 hover:underline"><a href={candidate.resumeUrl || '#'} target="_blank" rel="noopener noreferrer">View Resume</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {candidates.length === 0 && (
              <p className="text-gray-400 p-4">No candidates found.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
