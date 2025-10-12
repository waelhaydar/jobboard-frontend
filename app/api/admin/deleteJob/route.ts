import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prismaClient'
import { authMiddleware } from '../../../../lib/authMiddleware'

export async function DELETE(req: Request) {
  try {
    const authResult = await authMiddleware(req as any)
    if ('status' in authResult && authResult.status === 401) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (authResult.type !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing job id' }, { status: 400 })
    }

    // Get job details before deletion for notification
    const job = await prisma.job.findUnique({
      where: { id },
      include: { employer: true }
    })

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    await prisma.job.delete({ where: { id } })

    // Create notification for employer when admin deletes their job
    await prisma.notification.create({
      data: {
        title: 'Job Deleted',
        body: `Your job "${job.title}" was deleted by an administrator`,
        employerId: job.employerId,
        admin: false
      }
    })

    return NextResponse.json({ message: 'Job deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
