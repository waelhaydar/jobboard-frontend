// pages/api/upload-resume.js
import { NextResponse } from 'next/server';
import { authMiddleware } from '../../../../lib/authMiddleware';
import { prisma } from '../../../../lib/prismaClient';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req) {
  try {
    // Authentication check
    const authResult = await authMiddleware(req);
    if ('status' in authResult) return authResult;
    if (authResult.type !== 'candidate') {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized access' 
      }, { status: 401 });
    }

    const candidateId = authResult.user.id;
    const formData = await req.formData();
    const file = formData.get('resume');

    // Validate file exists
    if (!file) {
      return NextResponse.json({ 
        success: false,
        error: 'No file provided' 
      }, { status: 400 });
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ 
        success: false,
        error: 'File size must be less than 5MB' 
      }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        success: false,
        error: 'Only PDF and DOCX files are allowed' 
      }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    
    // Generate unique filename
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const filePath = path.join(uploadDir, filename);

    // Save file
    const arrayBuffer = await file.arrayBuffer();
    await fs.writeFile(filePath, new Uint8Array(arrayBuffer));

    const resumePath = `/uploads/${filename}`;

    // Save resume path to candidate profile in database
    await prisma.candidate.update({
      where: { id: candidateId },
      data: { 
        resumeUrl: resumePath,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ 
      success: true, 
      resumePath,
      message: 'Resume successfully uploaded and saved to your profile',
      data: {
        path: resumePath,
        filename: filename,
        uploadedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Resume upload error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error during resume upload' 
      }, 
      { status: 500 }
    );
  }
}