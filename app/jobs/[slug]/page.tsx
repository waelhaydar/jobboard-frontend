import { prisma } from '../../../lib/prismaClient'
import { getEntityFromToken } from '../../../lib/auth'
import { cookies, headers } from 'next/headers'
import JobPageClient from './JobPageClient'

export default async function JobPage({ params }: any){
  console.log(`Fetching job for slug: ${params.slug}`);
  const rscHeader = headers().get('rsc');
  console.log(`RSC header for slug ${params.slug}: ${rscHeader || 'not present'}`);
  console.log('All headers:', Array.from(headers().entries()));
  const job = await prisma.job.findFirst({ where: { slug: params.slug }, include: { employer: true } })
  if(!job) {
    console.log(`Job not found for slug: ${params.slug}`);
    return <div>Job not found</div>
  }
  console.log(`Job found: ${job.title}`);
  const token = cookies().get('token')?.value
  const entity = await getEntityFromToken(token)
  const isLoggedIn = !!entity
  const isEmployer = entity && entity.type === 'employer' && entity.employer?.id === job.employerId
  const applications = isEmployer ? await prisma.application.findMany({ where: { jobId: job.id }, include: { candidate: true } }) : []

  return (
    <JobPageClient
      job={job}
      isLoggedIn={isLoggedIn}
      entity={entity}
      isEmployer={isEmployer}
      applications={applications}
    />
  )
}
