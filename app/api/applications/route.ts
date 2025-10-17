import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prismaClient'
import { getEntityFromToken } from '../../../lib/auth'
import { cookies } from 'next/headers'
export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest) {
  try {
    const token = cookies().get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const entity = await getEntityFromToken(token)
    if (!entity || entity.type !== 'employer' || !entity.employer) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const sortBy = searchParams.get('sort') || 'createdAt_desc'

    const apps = await prisma.application.findMany({
      where: {
        job: {
          employerId: entity.employer.id
        }
      },
      include: { job: true, employer: true, candidate: true }
    })

    // Group by job
    const jobsMap: { [key: string]: { job: any, applications: any[] } } = {}
    apps.forEach(app => {
      if (!jobsMap[app.jobId]) {
        jobsMap[app.jobId] = { job: app.job, applications: [] }
      }
      jobsMap[app.jobId].applications.push(app)
    })

    const jobs = Object.values(jobsMap)

    // Sort applications within each job
    jobs.forEach(jobData => {
      jobData.applications.sort((a, b) => {
        switch (sortBy) {
          case 'score_desc':
            return (b.score || 0) - (a.score || 0)
          case 'createdAt_desc':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          case 'address_asc':
            const addrA = a.candidate?.address || ''
            const addrB = b.candidate?.address || ''
            return addrA.localeCompare(addrB)
          default:
            return 0
        }
      })
    })

    return NextResponse.json({ jobs })
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
