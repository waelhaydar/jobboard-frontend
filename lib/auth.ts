import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import { prisma } from './prismaClient'
import bcrypt from 'bcryptjs';

const SECRET = process.env.JWT_SECRET || 'devsecret'

export function signToken(payload: any){
  return jwt.sign(payload, SECRET, { expiresIn: '7d' })
}



export function verifyToken(token?: string){
  try {
    return token ? jwt.verify(token, SECRET) as any : null
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      console.error('TokenExpiredError:', error.message)
    } else if (error instanceof JsonWebTokenError) {
      console.error('JsonWebTokenError:', error.message)
    } else {
      console.error('Token verification error:', error)
    }
    return null
  }
}

export async function getEntityFromToken(token?: string) {
  const data = verifyToken(token);
  if (!data) return null;

  try {
    if (data.type === 'admin') {
      const admin = await prisma.admin.findUnique({ where: { id: Number(data.id) } });
      if (!admin) throw new Error('Admin not found');
      return { type: 'admin', admin };
    }
    if (data.type === 'candidate') {
      const candidate = await prisma.candidate.findUnique({ where: { id: Number(data.id) } });
      if (!candidate) throw new Error('Candidate not found');
      return { type: 'candidate', candidate };
    }
    if (data.type === 'candidate_pending') {
      // For pending candidates, return the type and email without looking up a record
      return { type: 'candidate_pending', email: data.email };
    }
    if (data.type === 'employer') {
      const employer = await prisma.employer.findUnique({ where: { id: Number(data.id) } });
      if (!employer) throw new Error('Employer not found');
      return { type: 'employer', employer };
    }
  } catch (error) {
    console.error('Error retrieving entity:', error.message);
    return null;
  }
}
