import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '../../../../lib/prismaClient'
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'devsecret'

export async function POST(req: Request){
  const { email, password } = await req.json()
  if(!email || !password) return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })

  const admin = await prisma.admin.findUnique({ where: { email } })
  if(admin){
    if(await bcrypt.compare(password, admin.password)){
      const token = jwt.sign({ id: admin.id, type: 'admin' }, SECRET, { expiresIn: '7d' })
      const res = NextResponse.json({ success: true, userType: 'admin' })
      res.cookies.set('token', token, { httpOnly: true, path: '/', maxAge: 60*60*24*7 })
      return res
    } else {
      return NextResponse.json({ error: 'Wrong password' }, { status: 401 })
    }
  }

  const candidate = await prisma.candidate.findUnique({ where: { email } })
  if(candidate){
    if(await bcrypt.compare(password, candidate.password)){
      const token = jwt.sign({ id: candidate.id, type: 'candidate' }, SECRET, { expiresIn: '7d' })
      const res = NextResponse.json({ success: true, userType: 'candidate' })
      res.cookies.set('token', token, { httpOnly: true, path: '/', maxAge: 60*60*24*7 })
      return res
    } else {
      return NextResponse.json({ error: 'Wrong password' }, { status: 401 })
    }
  }

  const emp = await prisma.employer.findUnique({ where: { email } })
  if(emp){
    if(await bcrypt.compare(password, emp.password)){
      const token = jwt.sign({ id: emp.id, type: 'employer' }, SECRET, { expiresIn: '7d' })
      const res = NextResponse.json({ success: true, userType: 'employer' })
      res.cookies.set('token', token, { httpOnly: true, path: '/', maxAge: 60*60*24*7 })
      return res
    } else {
      return NextResponse.json({ error: 'Wrong password' }, { status: 401 })
    }
  }

  return NextResponse.json({ error: 'User not found' }, { status: 401 })
}
