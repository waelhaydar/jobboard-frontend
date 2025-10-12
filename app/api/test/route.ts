import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server';
import { authMiddleware } from 'lib/authMiddleware';

export async function POST(req: NextRequest) {
  console.log('Test POST request received for /api/test');
  const authResult = await authMiddleware(req);
  if (authResult instanceof NextResponse) {
    console.log('Auth middleware returned an error response in /api/test.');
    return authResult;
  }
  console.log('Auth middleware passed in /api/test.');
  return NextResponse.json({ message: 'Test POST successful - with authMiddleware' }, { status: 200 });
}