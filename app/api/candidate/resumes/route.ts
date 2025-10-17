// pages/api/resumes.js
import { NextResponse } from 'next/server';
import { authMiddleware } from '../../../../lib/authMiddleware';
import { prisma } from '../../../../lib/prismaClient';
export const dynamic = 'force-dynamic'
export async function GET(req) {
  try {
    const authResult = await authMiddleware(req);
    if ('status' in authResult) return authResult;
    if (authResult.type !== 'candidate') {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized access' 
      }, { status: 401 });
    }

    const candidateId = authResult.user.id;

    // Get candidate's profile resume
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
      select: { 
        resumeUrl: true,
        updatedAt: true 
      },
    });

    const resumes = [];

    // Add candidate's resumeUrl if it exists
    if (candidate?.resumeUrl) {
      const fullFileName = candidate.resumeUrl.split('/').pop() || '';
      const nameWithoutTimestamp = fullFileName.replace(/^\d+-/, '');

      resumes.push({
        path: candidate.resumeUrl,
        uploadedAt: candidate.updatedAt.toISOString(),
        name: nameWithoutTimestamp,
        type: 'profile',
        isProfile: true
      });
    }

    return NextResponse.json({
      success: true,
      resumes: resumes,
      count: resumes.length
    });

  } catch (error) {
    console.error('Get resumes error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error while fetching resumes' 
      }, 
      { status: 500 }
    );
  }
}