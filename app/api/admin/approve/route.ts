import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prismaClient'
import { authMiddleware } from '../../../../lib/authMiddleware'
export const dynamic = 'force-dynamic'
export async function POST(req: Request){
  try {
    const authResult = await authMiddleware(req as any)
    if ('status' in authResult && authResult.status === 401) return authResult
    if (authResult.type !== 'admin' || !('admin' in authResult)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const form = await req.formData()
    const id = Number(form.get('id')?.toString())
    if(!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    const emp = await prisma.employer.update({ where: { id }, data: { approved: true } })
    await prisma.notification.create({ data: { title: 'Approved', body: 'Your employer account was approved', employerId: emp.id, admin: false } })
    return NextResponse.redirect(new URL('/admin', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'))
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
