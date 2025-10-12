// app/page.tsx
import { prisma } from '../lib/prismaClient'
import dynamic from 'next/dynamic'
import { getEntityFromToken } from '../lib/auth'
import { cookies } from 'next/headers'
import { LoadingCard } from '../components/LoadingSpinner'

// Lazy load job cards for better performance
const JobCard = dynamic(() => import('../components/JobCard'), {
  loading: () => (
    <div className="h-48">
      <LoadingCard className="h-full" />
    </div>
  )
})

// Since we can't use theme context in server components, we'll create a client wrapper
import HomeClient from './HomeClient'

export default async function Home() {
  const token = cookies().get('token')?.value
  const entity = await getEntityFromToken(token)
  const isEmployer = entity && entity.type === 'employer' && entity.employer?.approved
  const isSignedIn = !!entity
  
  // Parallel data fetching
  const [jobs, totalJobs, totalEmployers, totalCandidates] = await Promise.all([
    prisma.job.findMany({ 
      take: 6, 
      orderBy: { createdAt: 'desc' }, 
      include: { employer: true } 
    }),
    prisma.job.count(),
    prisma.employer.count(),
    prisma.candidate.count()
  ])

  const cleanedJobs = jobs.map(job => ({
    ...job,
    employer: job.employer ? {
      ...job.employer,
      imageUrl: job.employer.imageUrl?.includes('loremflickr.com') ? '/default-company-logo.png' : job.employer.imageUrl
    } : null
  }))

  return (
    <HomeClient
      jobs={cleanedJobs}
      totalJobs={totalJobs}
      totalEmployers={totalEmployers}
      totalCandidates={totalCandidates}
      isEmployer={isEmployer}
      isSignedIn={isSignedIn}
    />
  )
}