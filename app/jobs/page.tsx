// app/jobs/page.tsx
import { prisma } from '../../lib/prismaClient'
import JobsPageClient from './JobsPageClient'

export default async function JobsPage(){
  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: 'desc' },
    include: { employer: true }
  })

  const stats = [
    { icon: 'Briefcase', label: 'Active Jobs', value: jobs.length },
    { icon: 'Users', label: 'Companies', value: new Set(jobs.map(job => job.employerId)).size },
    { icon: 'TrendingUp', label: 'New This Week', value: jobs.filter(job => {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return new Date(job.createdAt) > weekAgo
    }).length },
    { icon: 'Shield', label: 'Verified Employers', value: '100%' }
  ]

  return (
    <JobsPageClient jobs={jobs} stats={stats} />
  )
}