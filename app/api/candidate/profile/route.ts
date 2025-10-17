import { NextResponse } from 'next/server'
import { prisma } from 'lib/prismaClient'
import { authMiddleware } from 'lib/authMiddleware'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
export const dynamic = 'force-dynamic'
const SECRET = process.env.JWT_SECRET || 'devsecret'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  try {
    const authResult = await authMiddleware(req as any)
    if ('status' in authResult) return authResult
    if (!['candidate', 'candidate_pending'].includes((authResult as any).type)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const candidateId = (authResult as any).user?.id
    const email = (authResult as any).email

    let candidate
    if (candidateId) {
      candidate = await prisma.candidate.findUnique({
        where: { id: candidateId },
        include: { applications: { include: { job: true } } },
      })
    } else if (email) {
      candidate = await prisma.candidate.findUnique({
        where: { email },
        include: { applications: { include: { job: true } } },
      })
    }

    // For pending candidates, return success with null candidate
    // This allows the frontend to show the registration form
    if (!candidate && (authResult as any).type === 'candidate_pending') {
      return NextResponse.json({
        candidate: null,
        isPending: true,
        email: email
      })
    }

    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 })
    }

    return NextResponse.json({ candidate })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const authResult = await authMiddleware(req as any)
    if ('status' in authResult) return authResult
    if (!['candidate', 'candidate_pending'].includes((authResult as any).type)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    if ((authResult as any).type === 'candidate_pending') {
      // Create candidate record on first save
      const existingCandidate = await prisma.candidate.findUnique({ where: { email: (authResult as any).email } })
      if (existingCandidate) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 })
      }
      if (!body.password) {
        return NextResponse.json({ error: 'Password is required for registration' }, { status: 400 })
      }
      const hashed = await bcrypt.hash(body.password, 10)
      const newCandidate = await prisma.candidate.create({
        data: {
          email: (authResult as any).email,
          password: hashed,
          name: body.name,
          dob: body.dob,
          address: body.address,
          lastJobPosition: body.lastJobPosition,
          lastJobLocation: body.lastJobLocation,
          mobileNumber: body.mobileNumber,
        },
      })
      // Issue new token with candidate id
      const token = jwt.sign({ id: newCandidate.id, type: 'candidate' }, SECRET, { expiresIn: '7d' })
      const res = NextResponse.json({ candidate: newCandidate })
      res.cookies.set('token', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 })
      return res
    } else {
      // Update existing candidate
      const candidateId = (authResult as any).user.id
      const updatedCandidate = await prisma.candidate.update({
        where: { id: candidateId },
        data: {
          name: body.name,
          dob: body.dob,
          address: body.address,
          lastJobPosition: body.lastJobPosition,
          lastJobLocation: body.lastJobLocation,
          mobileNumber: body.mobileNumber,
        },
      })
      return NextResponse.json({ candidate: updatedCandidate })
    }
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}
