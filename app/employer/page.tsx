import { prisma } from '../../lib/prismaClient'
import { getEntityFromToken } from '../../lib/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import EmployerDashboard from './EmployerDashboard'

export default async function EmployerPage(){
  try {
    const token = cookies().get('token')?.value
    if (!token) {
      redirect('/auth/login')
    }

    const entity = await getEntityFromToken(token)
    if (!entity || entity.type !== 'employer' || !entity.employer) {
      redirect('/auth/login')
    }

const employer = await prisma.employer.findUnique({
  where: { id: entity.employer.id },
  include: {
    jobs: { select: { id: true, title: true, description: true, location: true, slug: true } }
  }
})

// Get applications only for this employer's jobs
const applications = await prisma.application.findMany({
  where: {
    job: {
      employerId: entity.employer.id
    }
  },
  select: {
    id: true,
    status: true,
    extractedName: true,
    extractedEmail: true,
    extractedPhone: true,
    extractedSkills: true,
    score: true,
    jobId: true,
    job: { select: { title: true } },
    candidate: {
      select: {
        id: true,
        name: true,
        email: true,
        mobileNumber: true
      }
    }
  },
  orderBy: {
    score: 'desc'
  }
})

    if (!employer) {
      console.error('Employer not found in database')
      redirect('/auth/login')
    }

    if (!employer.approved) {
      redirect('/')
    }

    const { jobs } = employer
    return <EmployerDashboard employer={employer} jobs={jobs} applications={applications} />
  } catch (error) {
    console.error('Error loading employer page:', error)
    redirect('/auth/login')
  }
}
