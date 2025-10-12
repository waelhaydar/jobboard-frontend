import { prisma } from '../../../lib/prismaClient'
import { getEntityFromToken } from '../../../lib/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminDatabaseClientPage from './AdminDatabaseClientPage'

export default async function AdminDatabasePage() {
  const token = cookies().get('token')?.value
  const entity = await getEntityFromToken(token)
  if (!entity || entity.type !== 'admin') {
    redirect('/auth/login')
  }

  const candidates = await prisma.candidate.findMany()
  const employers = await prisma.employer.findMany()
  const jobs = await prisma.job.findMany({ include: { employer: true } })
  const admins = await prisma.admin.findMany()
  const applications = await prisma.application.findMany({ include: { candidate: true, job: true } })
  const notifications = await prisma.notification.findMany()

  return (
    <AdminDatabaseClientPage
      initialCandidates={candidates}
      initialEmployers={employers}
      initialJobs={jobs}
      initialAdmins={admins}
      initialApplications={applications}
      initialNotifications={notifications}
    />
  )
}