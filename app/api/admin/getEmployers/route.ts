import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prismaClient'
import { authMiddleware } from '../../../../lib/authMiddleware'
export const dynamic = 'force-dynamic'
export async function GET(req: Request) {
  try {
    const authResult = await authMiddleware(req as any)
    if ('status' in authResult && authResult.status === 401) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (authResult.type !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const employers = await prisma.employer.findMany()
    return NextResponse.json(employers)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
