import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prismaClient'
import { authMiddleware } from '../../../../lib/authMiddleware'

export async function PATCH(req: Request) {
  try {
    const authResult = await authMiddleware(req as any)
    if (authResult instanceof NextResponse) return authResult
    const authData = authResult
    if (authData.type !== 'employer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { applicationId, newStatus } = body

    if (!applicationId || !newStatus) {
      return NextResponse.json({ error: 'Missing applicationId or newStatus' }, { status: 400 })
    }

    // Validate newStatus against the ApplicationStatus enum
    const validStatuses = ['PENDING', 'VIEWED', 'ACCEPTED', 'REJECTED']
    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json({ error: 'Invalid newStatus value' }, { status: 400 })
    }

    // Verify the application belongs to the employer
    const application = await prisma.application.findUnique({
      where: { id: parseInt(applicationId) },
      include: { employer: true }
    })

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    if (application.employerId !== authData.employer.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updatedApplication = await prisma.application.update({
      where: { id: parseInt(applicationId) },
      data: { status: newStatus },
      include: { job: true, candidate: true }
    })

    // Send notification to candidate if status is VIEWED
    if (newStatus === 'VIEWED' && updatedApplication.candidateId) {
      await prisma.notification.create({
        data: {
          title: 'Application Viewed',
          body: `Your application for ${updatedApplication.job.title} has been viewed by the employer.`,
          candidateId: updatedApplication.candidateId,
          jobId: updatedApplication.jobId,
        },
      })
    }

    return NextResponse.json({ application: updatedApplication })
  } catch (error) {
    console.error('Error updating application status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
