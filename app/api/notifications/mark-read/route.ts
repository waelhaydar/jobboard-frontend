import { NextResponse, NextRequest } from 'next/server'
import { prisma } from 'lib/prismaClient'
import { authMiddleware } from 'lib/authMiddleware'

export async function POST(req: NextRequest){
  const authResult = await authMiddleware(req)
  if ('status' in authResult && authResult.status === 401) return authResult
  const { type, user, employer } = authResult as any
  if(type === 'admin'){
    const ids = await prisma.notification.findMany({ where: { admin: true, read: false }, select: { id: true } })
    if(ids.length) await prisma.notification.updateMany({ where: { id: { in: ids.map(i=>i.id) } }, data: { read: true } })
  } else if(type === 'employer'){
    const ids = await prisma.notification.findMany({ where: { employerId: employer.id, read: false }, select: { id: true } })
    if(ids.length) await prisma.notification.updateMany({ where: { id: { in: ids.map(i=>i.id) } }, data: { read: true } })
  } else {
    const ids = await prisma.notification.findMany({ where: { admin: false, read: false }, select: { id: true } })
    if(ids.length) await prisma.notification.updateMany({ where: { id: { in: ids.map(i=>i.id) } }, data: { read: true } })
  }
  return NextResponse.json({ success: true })
}
