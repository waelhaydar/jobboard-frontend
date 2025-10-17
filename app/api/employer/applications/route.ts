import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware } from 'lib/authMiddleware'
import { prisma } from 'lib/prismaClient'
export const dynamic = 'force-dynamic'
export async function GET(req: NextRequest) {
  try {
    const auth = await authMiddleware(req)
    if (auth instanceof NextResponse) return auth
    if (auth.type !== 'employer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const applications = await prisma.application.findMany({
      where: { employerId: auth.user.id },
      include: {
        job: { select: { title: true } },
        candidate: { select: { id: true, name: true, email: true, mobileNumber: true } },
      },
    })

    return NextResponse.json({ applications })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}