import { prisma } from '../../../../lib/prismaClient'
import { getEntityFromToken } from '../../../../lib/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import JobPostForm from '../../JobPostForm'

export const dynamic = 'force-dynamic'

interface EditJobPageProps {
  params: {
    id: string
  }
}

export default async function EditJobPage({ params }: EditJobPageProps) {
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

    // Get the specific job to edit
    const job = await prisma.job.findFirst({
      where: {
        id: params.id,
        employerId: employer.id
      }
    })

    if (!job) {
      redirect('/employer')
    }

    // Convert job to match the JobPostForm interface
    const jobForForm = {
      id: job.id,
      title: job.title,
      description: job.description,
      location: job.location || '',
      jobType: job.jobType || 'FULL_TIME',
      hiringFrom: job.hiringFrom || '',
      basicMonthlySalaryUSD: job.basicMonthlySalaryUSD || 0,
      transportation: job.transportation || false,
      accommodation: job.accommodation || false,
      freeMeals: job.freeMeals || false,
      bonuses: job.bonuses || false,
      companyCar: job.companyCar || false
    }

    return (
      <div className="min-h-screen bg-job-background-bg">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Edit Job Post</h1>
            <p className="text-gray-600 dark:text-white">Modify the details of your job posting below.</p>
          </div>

          <JobPostForm employerId={employer.id} job={jobForForm} />
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading edit job page:', error)
    redirect('/auth/login')
  }
}
