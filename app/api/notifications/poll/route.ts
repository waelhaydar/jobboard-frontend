import { NextResponse, NextRequest } from 'next/server'
import { prisma } from 'lib/prismaClient'
import { authMiddleware } from 'lib/authMiddleware'
import { NotificationWithJob, NotificationWithJobPayload } from 'lib/types'

export async function GET(req: NextRequest){
  const authResult = await authMiddleware(req)
  // If not authenticated, return public (non-admin) unread notifications instead of 401
  if ('status' in authResult && authResult.status === 401) {
    const notes: NotificationWithJobPayload[] = await prisma.notification.findMany({
      where: { admin: false, read: false },
      include: { Job: true } // Include Job relation
    })
    const formattedNotes: NotificationWithJob[] = notes.map(note => ({
      ...note,
      body: note.Job ? `Job: ${note.Job.title} - ${note.body}` : note.body // Prepend job title to body if job exists
    }))
    return NextResponse.json({ notifications: formattedNotes })
  }

  const { type, employer } = authResult as any
  if(type === 'admin'){
    const notes: NotificationWithJobPayload[] = await prisma.notification.findMany({
      where: { admin: true, read: false },
      include: { Job: true } // Include Job relation
    })
    const formattedNotes: NotificationWithJob[] = notes.map(note => ({
      ...note,
      body: note.Job ? `Job: ${note.Job.title} - ${note.body}` : note.body // Prepend job title to body if job exists
    }))
    return NextResponse.json({ notifications: formattedNotes })
  } else if(type === 'employer'){
    const notes: NotificationWithJobPayload[] = await prisma.notification.findMany({
      where: { employerId: employer.id, read: false },
      include: { Job: true } // Include Job relation
    })
    const formattedNotes: NotificationWithJob[] = notes.map(note => ({
      ...note,
      body: note.Job ? `Job: ${note.Job.title} - ${note.body}` : note.body // Prepend job title to body if job exists
    }))
    return NextResponse.json({ notifications: formattedNotes })
  } else if (type === 'candidate_pending') {
    const candidateId = (authResult as any).candidate?.id;
    if (!candidateId) {
      return NextResponse.json({ notifications: [] });
    }
    const notes: NotificationWithJobPayload[] = await prisma.notification.findMany({
      where: { candidateId: candidateId, read: false },
      include: { Job: true } // Include Job relation
    })
    const formattedNotes: NotificationWithJob[] = notes.map(note => ({
      ...note,
      body: note.Job ? `Job: ${note.Job.title} - ${note.body}` : note.body // Prepend job title to body if job exists
    }))
    return NextResponse.json({ notifications: formattedNotes })
  }else {
    const candidateId = (authResult as any).candidate?.id;
    if (!candidateId) {
      return NextResponse.json({ notifications: [] });
    }
    const notes: NotificationWithJobPayload[] = await prisma.notification.findMany({
      where: { candidateId: candidateId, read: false },
      include: { Job: true } // Include Job relation
    })
    const formattedNotes: NotificationWithJob[] = notes.map(note => ({
      ...note,
      body: note.Job ? `Job: ${note.Job.title} - ${note.body}` : note.body // Prepend job title to body if job exists
    }))
    return NextResponse.json({ notifications: formattedNotes })
  }
}
