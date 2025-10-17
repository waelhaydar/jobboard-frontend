import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prismaClient'
export const dynamic = 'force-dynamic'
export async function GET(req: Request, { params }: { params: { slug: string } }) {
  try {
    const jobSlug = params.slug

    if (!jobSlug) {
      return NextResponse.json({ error: 'Invalid job ID' }, { status: 400 })
    }

    const job = await prisma.job.findUnique({
      where: { slug: jobSlug },
    })

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    return NextResponse.json(job)
  } catch (error) {
    console.error('Error fetching job:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}