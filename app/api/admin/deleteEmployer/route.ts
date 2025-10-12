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
      return NextResponse.json({ error: 'Missing employer id' }, { status: 400 })
    }
    const id = Number(idParam)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid employer id' }, { status: 400 })
    }

    // Get employer details before deletion for notification
    const employer = await prisma.employer.findUnique({ where: { id } })

    if (!employer) {
      return NextResponse.json({ error: 'Employer not found' }, { status: 404 })
    }

    await prisma.employer.delete({ where: { id } })

    // Create notification for admins when an employer is deleted
    await prisma.notification.create({
      data: {
        title: 'Employer Deleted',
        body: `Employer "${employer.companyName}" was deleted by an administrator`,
        admin: true
      }
    })

    return NextResponse.json({ message: 'Employer deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
