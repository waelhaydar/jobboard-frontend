import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prismaClient'
import { authMiddleware } from '../../../../lib/authMiddleware'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'



export async function PUT(req: Request){
  try {
    const authResult = await authMiddleware(req as any)
    if ('status' in authResult) return authResult
    if (authResult.type !== 'employer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const companyName = formData.get('companyName') as string
    const email = formData.get('email') as string
    const about = formData.get('about') as string | null
    const image = formData.get('image') as File | null

    if (!companyName || !email) {
      return NextResponse.json({ error: 'Company name and email are required' }, { status: 400 })
    }

    let imageUrl: string | undefined
    if (image) {
      const bytes = await image.arrayBuffer()
      const buffer = new Uint8Array(bytes)

      // Ensure uploads directory exists
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
      await mkdir(uploadsDir, { recursive: true })

      // Generate unique filename
      const filename = `${Date.now()}-${image.name}`
      const filepath = path.join(uploadsDir, filename)
      await writeFile(filepath, buffer)
      imageUrl = `/uploads/${filename}`
    }

    const updatedEmployer = await prisma.employer.update({
      where: { id: authResult.employer.id },
      data: { companyName, email, about, ...(imageUrl && { imageUrl }) }
    })

    return NextResponse.json({ employer: updatedEmployer })
  } catch (error) {
    console.error('Error updating employer profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
