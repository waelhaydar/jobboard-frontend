import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '../../../../lib/prismaClient'
import { signToken } from '../../../../lib/auth'

export async function POST(req: Request){
  try {
    const { companyName, email, password } = await req.json()
    if(!companyName || !email || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const hashed = await bcrypt.hash(password, 10)
    const emp = await prisma.employer.create({ data: { companyName, email, password: hashed } })
    await prisma.notification.create({ data: { title: 'New employer signup', body: `Employer ${companyName} awaiting approval`, admin: true } })
    const token = signToken({ type: 'employer', id: emp.id })
    return NextResponse.json({ message: 'Registration successful', token })
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
