import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prismaClient'
import { getEntityFromToken } from '../../../../../lib/auth'
export const dynamic = 'force-dynamic'
export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const entity = await getEntityFromToken(token)
    if (!entity || entity.type !== 'employer' || !entity.employer) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { jobId, newStatus } = await request.json()
    if (!jobId || !newStatus) {
      return NextResponse.json({ error: 'Missing jobId or newStatus' }, { status: 400 })
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId }
    })

    if (!job || job.employerId !== entity.employer.id) {
      return NextResponse.json({ error: 'Job not found or unauthorized' }, { status: 404 })
    }

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: { status: newStatus }
    })

    return NextResponse.json({ message: 'Job status updated successfully', job: updatedJob })
  } catch (error) {
    console.error('Error updating job status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
