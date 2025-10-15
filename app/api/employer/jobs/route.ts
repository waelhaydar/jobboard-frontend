import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prismaClient'
import { authMiddleware } from '../../../../lib/authMiddleware'
import { createSlug } from '../../../../lib/utils'
type JobType = 'FULL_TIME' | 'PART_TIME' | 'ONLINE' | 'REMOTE'

export async function POST(req: Request){
  try {
    const authResult = await authMiddleware(req as any)
    if ('status' in authResult && authResult.status === 401) return authResult
    if (authResult.type !== 'employer' || !('employer' in authResult && authResult.employer?.approved)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const form = await req.formData()
    const title = form.get('title')?.toString()
    const description = form.get('description')?.toString()
    const location = form.get('location')?.toString()
    const jobType = form.get('jobType')?.toString()
    const category = form.get('category')?.toString()
    const hiringFrom = form.get('hiringFrom')?.toString()
    const basicMonthlySalaryUSD = form.get('basicMonthlySalaryUSD')?.toString()
    const transportation = form.get('transportation')?.toString() === 'true'
    const accommodation = form.get('accommodation')?.toString() === 'true'
    const freeMeals = form.get('freeMeals')?.toString() === 'true'
    const bonuses = form.get('bonuses')?.toString() === 'true'
    const companyCar = form.get('companyCar')?.toString() === 'true'

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 })
    }

    const slug = createSlug(title)
    const job = await prisma.job.create({
      data: {
        title,
        slug: slug,
        description,
        location,
        jobType: jobType as JobType,
        category: category as any,
        salary: basicMonthlySalaryUSD ? parseInt(basicMonthlySalaryUSD) : 0,
        salaryType: 'MONTHLY',
        salaryRange: null,
        vacancies: 1,
        experience: 'ENTRY_LEVEL',
        employerId: authResult.employer.id,
        hiringFrom,
        basicMonthlySalaryUSD: basicMonthlySalaryUSD ? parseInt(basicMonthlySalaryUSD) : null,
        transportation,
        accommodation,
        freeMeals,
        bonuses,
        companyCar
      }
    })

    // Removed notification for admins when employer creates a job as approval is not required
    // await prisma.notification.create({
    //   data: {
    //     title: 'New Job Posted',
    //     body: `${authResult.employer.companyName} posted a new job: "${title}"`,
    //     admin: true
    //   }
    // })

      console.log('Title received:', title)
      console.log('Generated slug:', slug)
     return NextResponse.json({ job })
  } catch (error) {
    console.error('Error creating job:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
