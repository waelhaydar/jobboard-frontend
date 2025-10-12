import { NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prismaClient'
import { authMiddleware } from '../../../../../lib/authMiddleware'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const authResult = await authMiddleware(req as any)
    if (authResult instanceof NextResponse) return authResult
    const authData = authResult
    if (authData.type !== 'employer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const applicationId = parseInt(params.id)
    if (isNaN(applicationId)) {
      return NextResponse.json({ error: 'Invalid application ID' }, { status: 400 })
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      select: {
        id: true,
        status: true,
        resumePath: true,
        extractedName: true,
        extractedEmail: true,
        extractedPhone: true,
        extractedLinkedIn: true,
        extractedSkills: true,
        yearsExperience: true,
        careerLevel: true,
        experienceRelatedToJob: true,
        extractedText: true,
        score: true,
        createdAt: true,
        employerId: true,
        last3Positions: true,
        educationLevel: true,
        totalSkills: true,
        hardSkills: true,
        softSkills: true,
        topKeywords: true,
        textPreview: true,
        job: { select: { id: true, title: true, description: true, location: true } },
        candidate: { select: { name: true, email: true, mobileNumber: true, address: true, lastJobPosition: true, lastJobLocation: true } }
      }
    })

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    // Fix: application.employerId may be undefined, check with optional chaining
    if (application.employerId !== authData.employer?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ application })
  } catch (error) {
    console.error('Error fetching application:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
