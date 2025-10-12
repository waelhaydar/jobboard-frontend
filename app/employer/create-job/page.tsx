import { prisma } from '../../../lib/prismaClient'
import { getEntityFromToken } from '../../../lib/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import JobPostForm from '../JobPostForm'

export default async function CreateJobPage() {
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
      where: { id: entity.employer.id }
    })

    if (!employer) {
      console.error('Employer not found in database')
      redirect('/auth/login')
    }

    if (!employer.approved) {
      redirect('/')
    }

    return (
      <div className="min-h-screen bg-job-background-bg dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Create New Job Post</h1>
            <p className="text-gray-600 dark:text-white">Fill out the form below to create a new job posting.</p>
          </div>

          <JobPostForm employerId={employer.id} />
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading create job page:', error)
    redirect('/auth/login')
  }
}
