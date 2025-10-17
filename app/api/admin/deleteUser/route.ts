import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prismaClient'
import { authMiddleware } from '../../../../lib/authMiddleware'
export const dynamic = 'force-dynamic'
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
    const idParam = url.searchParams.get('id')
    if (!idParam) {
      return NextResponse.json({ error: 'Missing admin id' }, { status: 400 })
    }
    const id = Number(idParam)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid admin id' }, { status: 400 })
    }

    await prisma.admin.delete({ where: { id } })

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
