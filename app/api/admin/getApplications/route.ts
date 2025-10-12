import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prismaClient'
import { authMiddleware } from '../../../../lib/authMiddleware'

export async function GET(req: Request) {
  try {
    const authResult = await authMiddleware(req as any)
    if ('status' in authResult && authResult.status === 401) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (authResult.type !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const applications = await prisma.application.findMany()
    return NextResponse.json(applications)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
