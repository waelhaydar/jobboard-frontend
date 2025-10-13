import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './auth';
import { prisma } from './prismaClient';
import { logger } from './logger';
import { Admin, Candidate, Employer, AuthResult } from './types'; // Import the types

export async function authMiddleware(req: NextRequest | Request) {
  console.log('authMiddleware: Starting execution.');
  const token = (req as NextRequest).cookies.get('token')?.value;
  console.log('authMiddleware: Token retrieved:', token ? 'present' : 'absent');
  console.log('authMiddleware: Before verifyToken.');
  const data = await verifyToken(token); // Ensure verifyToken is awaited if it's async
  console.log('authMiddleware: After verifyToken. Result:', data);

  if (!data) {
    console.log('authMiddleware: Unauthorized - no data from token verification.');
    return NextResponse.json({ error: 'Unauthorized or invalid token' }, { status: 401 });
  }

  let entity: Admin | Candidate | Employer | null = null; // Use specific types
  let type = data.type;
  console.log('authMiddleware: Data type from token:', type);

  try {
    console.log('authMiddleware: Attempting to find entity in database.');
    if (data.type === 'admin') {
      console.log('authMiddleware: Looking for admin with ID:', data.id);
      entity = await prisma.admin.findUnique({ where: { id: Number(data.id) } });
      if (!entity) throw new Error('Admin not found');
      type = 'admin';
      console.log('authMiddleware: Admin found.');
    } else if (data.type === 'candidate') {
      console.log('authMiddleware: Looking for candidate with ID:', data.id);
      entity = await prisma.candidate.findUnique({ where: { id: Number(data.id) } });
      if (!entity) throw new Error('Candidate not found');
      type = 'candidate';
      console.log('authMiddleware: Candidate found.');
    } else if (data.type === 'candidate_pending') {
      console.log('authMiddleware: Handling pending candidate.');
      // For pending candidates, we don't need to find an entity record
      // The email is already available in the token data
      type = 'candidate_pending';
    } else if (data.type === 'employer') {
      console.log('authMiddleware: Looking for employer with ID:', data.id);
      entity = await prisma.employer.findUnique({ where: { id: Number(data.id) } });
      if (!entity) throw new Error('Employer not found');
      console.log('authMiddleware: Employer found.');
    }
    console.log('authMiddleware: Entity search complete.');
  } catch (error: any) {
    logger.error('Error retrieving entity:', error.message); // Use the logger
    console.log('authMiddleware: Error in entity retrieval:', error.message);
    return NextResponse.json({ error: 'Entity not found' }, { status: 401 });
  }

  console.log('authMiddleware: Returning AuthResult.');
  return { type, user: type === 'candidate' ? entity as Candidate : null, admin: type === 'admin' ? entity as Admin : null, employer: type === 'employer' ? entity as Employer : null, email: data.email } as AuthResult;
}
