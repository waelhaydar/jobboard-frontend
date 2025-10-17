import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '../../../../lib/prismaClient'
import jwt from 'jsonwebtoken'
const SECRET = process.env.JWT_SECRET || 'devsecret'
export const dynamic = 'force-dynamic'
export async function POST(req: Request) {
  const { email, password } = await req.json()

  if (!email || !password) return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })

  const existingCandidate = await prisma.candidate.findUnique({ where: { email } })
  if (existingCandidate) return NextResponse.json({ error: 'User already exists' }, { status: 400 })
  // Do not create candidate record here
  // Instead, create a token with email only and type 'candidate_pending'
  const token = jwt.sign({ email, type: 'candidate_pending' }, SECRET, { expiresIn: '7d' })
  const res = NextResponse.json({ message: 'Registration successful' })
  res.cookies.set('token', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 })
  return res
}
