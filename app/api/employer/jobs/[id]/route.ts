import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prismaClient'
import { getEntityFromToken } from '../../../../../lib/auth'


export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const entity = await getEntityFromToken(token)
    if (!entity || entity.type !== 'employer' || !entity.employer || !entity.employer.approved) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const jobId = params.id
    if (!jobId) {
      return NextResponse.json({ error: 'Invalid job ID' }, { status: 400 })
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { employerId: true }
    })

    if (!job || job.employerId !== entity.employer.id) {
      return NextResponse.json({ error: 'Job not found or unauthorized' }, { status: 404 })
    }

    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const location = formData.get('location') as string
    const jobType = formData.get('jobType') as string
    const category = formData.get('category') as string
    const hiringFrom = formData.get('hiringFrom') as string
    const basicMonthlySalaryUSD = formData.get('basicMonthlySalaryUSD') as string
    const transportation = formData.get('transportation') as string === 'true'
    const accommodation = formData.get('accommodation') as string === 'true'
    const freeMeals = formData.get('freeMeals') as string === 'true'
    const bonuses = formData.get('bonuses') as string === 'true'
    const companyCar = formData.get('companyCar') as string === 'true'

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 })
    }

    const status = formData.get('status') as string | null

    const updateData: any = {
      title,
      description,
      location,
      jobType: jobType as any,
      hiringFrom,
      basicMonthlySalaryUSD: basicMonthlySalaryUSD ? parseInt(basicMonthlySalaryUSD) : null,
      transportation,
      accommodation,
      freeMeals,
      bonuses,
      companyCar,
    }

    if (category) {
      updateData.category = category
    }

    if (status) {
      updateData.status = status as any
    }

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: updateData
    })

    return NextResponse.json({ message: 'Job updated successfully', job: updatedJob })
  } catch (error) {
    console.error('Error updating job:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const entity = await getEntityFromToken(token)
    if (!entity || entity.type !== 'employer' || !entity.employer || !entity.employer.approved) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const jobId = params.id
    if (!jobId) {
      return NextResponse.json({ error: 'Invalid job ID' }, { status: 400 })
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { employerId: true }
    })

    if (!job || job.employerId !== entity.employer.id) {
      return NextResponse.json({ error: 'Job not found or unauthorized' }, { status: 404 })
    }

    // Delete the job
    await prisma.job.delete({
      where: { id: jobId }
    })

    return NextResponse.json({ message: 'Job deleted successfully' })
  } catch (error) {
    console.error('Error deleting job:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
