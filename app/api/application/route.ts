// pages/api/apply.js
import { NextResponse } from 'next/server';
import { authMiddleware } from '../../../lib/authMiddleware';
import { prisma } from '../../../lib/prismaClient';
import fs from 'fs/promises';
import path from 'path';
export const dynamic = 'force-dynamic'
// Function to parse CV using the cv_parser service
async function parseCV(fileBuffer, filename, jobDescription = null) {
  try {
    const formData = new FormData();
    formData.append('file', new Blob([fileBuffer]), filename);
    if (jobDescription) {
      formData.append('job_description', jobDescription);
    }

    const endpoint = jobDescription ? 'parse-cv-advanced' : 'parse-cv';

    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout

    const res = await fetch(`https://jobboard-backend-ht5v.onrender.com/${endpoint}`, {
      method: 'POST',
      body: formData,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`CV parsing failed with status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('CV parsing timed out after 30 seconds');
      throw new Error('CV parsing timed out');
    }
    console.error('Error calling CV parser:', error);
    throw error;
  }
}

export async function POST(req) {
  try {
    // Authentication check
    const authResult = await authMiddleware(req as any);
    if ('status' in authResult) return authResult;
    if (authResult.type !== 'candidate') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = authResult.user.id;
    const formData = await req.formData();

    // Extract form data
    const jobId = formData.get('jobId');
    const employerId = parseInt(formData.get('employerId'));
    const resumeFile = formData.get('resume');

    // Validate required fields
    if (!jobId || !employerId) {
      return NextResponse.json({ 
        success: false,
        error: 'Missing required fields: jobId and employerId are required' 
      }, { status: 400 });
    }

    // Check if job exists
    const job = await prisma.job.findUnique({ 
      where: { id: jobId },
      select: { id: true, description: true, employerId: true }
    });
    
    if (!job) {
      return NextResponse.json({ 
        success: false,
        error: 'Job not found' 
      }, { status: 404 });
    }

    // Verify job belongs to employer
    if (job.employerId !== employerId) {
      return NextResponse.json({ 
        success: false,
        error: 'Invalid employer for this job' 
      }, { status: 400 });
    }

    // Check for existing application
    const existingApplication = await prisma.application.findFirst({
      where: { candidateId: userId, jobId }
    });
    
    if (existingApplication) {
      return NextResponse.json({ 
        success: false,
        error: 'You have already applied to this job' 
      }, { status: 400 });
    }

    let resumePath = null;
    let score = 0;
    let extractedText = '';
    let extractedName = null;
    let extractedEmail = null;
    let extractedPhone = null;
    let extractedLinkedIn = null;
    let extractedSkills = null;
    let yearsExperience = null;
    let careerLevel = null;
    let experienceRelatedToJob = null;
    let last3Positions = null;
    let educationLevel = null;
    let totalSkills = null;
    let hardSkills = null;
    let softSkills = null;
    let topKeywords = null;
    let textPreview = null;

    let fileBuffer, filename;

    if (resumeFile) {
      // Validate file
      if (resumeFile.size > 5 * 1024 * 1024) {
        return NextResponse.json({
          success: false,
          error: 'File size must be less than 5MB'
        }, { status: 400 });
      }

      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (!allowedTypes.includes(resumeFile.type)) {
        return NextResponse.json({
          success: false,
          error: 'Only PDF and DOCX files are allowed'
        }, { status: 400 });
      }

      // Save file
      const uploadDir = path.join(process.cwd(), 'public/uploads');
      await fs.mkdir(uploadDir, { recursive: true });
      const uniqueFilename = `${Date.now()}-${resumeFile.name.replace(/\s+/g, '-')}`;
      const filePath = path.join(uploadDir, uniqueFilename);

      const arrayBuffer = await resumeFile.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
      await fs.writeFile(filePath, fileBuffer);

      resumePath = `/uploads/${uniqueFilename}`;
      filename = resumeFile.name;

      // Update candidate profile
      await prisma.candidate.update({
        where: { id: userId },
        data: { resumeUrl: resumePath }
      });
    } else {
      // Use existing resume
      const candidate = await prisma.candidate.findUnique({
        where: { id: userId },
        select: { resumeUrl: true }
      });

      if (!candidate?.resumeUrl) {
        return NextResponse.json({
          success: false,
          error: 'No resume found. Please upload a resume.'
        }, { status: 400 });
      }

      resumePath = candidate.resumeUrl;
      const filePath = path.join(process.cwd(), 'public', resumePath);
      fileBuffer = await fs.readFile(filePath);
      filename = path.basename(resumePath);
    }

    // Parse the CV
    let parsed = null;
    try {
      parsed = await parseCV(fileBuffer, filename, job.description);
      extractedName = parsed.basic_info.name || null;
      extractedEmail = parsed.basic_info.email || null;
      extractedPhone = parsed.basic_info.phone || null;
      extractedLinkedIn = parsed.basic_info.linkedin || null;
      extractedSkills = JSON.stringify(parsed.analysis.hard_skills.concat(parsed.analysis.soft_skills)) || null;
      extractedText = parsed.text_preview || '';
      yearsExperience = parsed.analysis.years_experience || null;
      careerLevel = parsed.analysis.career_level || null;
      experienceRelatedToJob = parsed.analysis.job_fit?.overall_score || null;
      last3Positions = JSON.stringify(parsed.analysis.last_3_positions) || null;
      educationLevel = parsed.analysis.education_level || null;
      totalSkills = parsed.analysis.total_skills || null;
      hardSkills = JSON.stringify(parsed.analysis.hard_skills) || null;
      softSkills = JSON.stringify(parsed.analysis.soft_skills) || null;
      topKeywords = JSON.stringify(parsed.analysis.top_keywords) || null;
      textPreview = parsed.text_preview || null;
    } catch (parseError) {
      console.error('CV parsing error:', parseError);
      // Continue without parsed data
    }

    // Calculate score if extractedText available
    if (extractedText && job.description) {
      const resumeText = extractedText.toLowerCase();
      const jobDescription = job.description.toLowerCase();

      const keywords = jobDescription.split(/\W+/)
        .filter(word => word.length > 2)
        .map(word => word.toLowerCase());

      if (keywords.length > 0) {
        const uniqueKeywords = [...new Set(keywords)];
        let matchedKeywords = 0;

        uniqueKeywords.forEach(keyword => {
          if (resumeText.includes(keyword)) {
            matchedKeywords++;
          }
        });

        score = (matchedKeywords / uniqueKeywords.length) * 100;
      }
    }

    // Create application record
    const application = await prisma.application.create({
      data: {
        jobId,
        employerId,
        candidateId: userId,
        resumePath,
        status: 'PENDING',
        score: Math.round(score),
        extractedText: extractedText ? extractedText.substring(0, 1000) : null,
        extractedName: extractedName,
        extractedEmail: extractedEmail,
        extractedPhone: extractedPhone,
        extractedLinkedIn: extractedLinkedIn,
        extractedSkills: extractedSkills,
        yearsExperience: yearsExperience,
        careerLevel: careerLevel,
        experienceRelatedToJob: experienceRelatedToJob,
        last3Positions: last3Positions,
        educationLevel: educationLevel,
        totalSkills: totalSkills,
        hardSkills: hardSkills,
        softSkills: softSkills,
        topKeywords: topKeywords,
        textPreview: textPreview,
      },
    });

    // Return success response
    return NextResponse.json({
      success: true,
      applicationId: application.id,
      score: Math.round(score),
      message: 'Application submitted successfully!',
      redirectUrl: '/thank-you',
      data: {
        id: application.id,
        score: Math.round(score),
        resumePath: resumePath,
        analysis: parsed ? parsed.analysis : null,
        basic_info: parsed ? parsed.basic_info : null,
        text_preview: parsed ? parsed.text_preview : null
      }
    });

  } catch (error) {
    console.error('Application submission error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error during application submission' 
      }, 
      { status: 500 }
    );
  }
}