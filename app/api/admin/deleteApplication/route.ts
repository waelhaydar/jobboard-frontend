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
    const idParam = url.searchParams.get('id')
    if (!idParam) {
      return NextResponse.json({ error: 'Missing application id' }, { status: 400 })
    }
    const id = Number(idParam)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid application id' }, { status: 400 })
    }

    await prisma.application.delete({ where: { id } })

    return NextResponse.json({ message: 'Application deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
