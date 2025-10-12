import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware } from 'lib/authMiddleware'
import { prisma } from 'lib/prismaClient'

export async function GET(req: NextRequest) {
  try {
    const auth = await authMiddleware(req)
    if (auth instanceof NextResponse) return auth
    if (auth.type !== 'candidate') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const jobId = searchParams.get('jobId')

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
    }

    const application = await prisma.application.findFirst({
      where: {
        candidateId: auth.user.id,
        jobId: jobId,
      },
      select: {
        createdAt: true,
      },
    })

    if (application) {
      return NextResponse.json({ hasApplied: true, applicationDate: application.createdAt.toISOString() })
    } else {
      return NextResponse.json({ hasApplied: false })
    }
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}