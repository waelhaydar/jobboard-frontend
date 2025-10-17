import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';
import { getEntityFromToken } from '@/lib/auth';
import { cookies } from 'next/headers';
export const dynamic = 'force-dynamic'
export async function POST(req: NextRequest) {
  try {
    // Try to get token from Authorization header first, then from cookies
    let token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      token = cookies().get('token')?.value;
    }

    const entity = await getEntityFromToken(token);

    if (!entity || entity.type !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, content, priority, category, expiresAt, targetAudience, displayPosition, imageUrl, active } = body;

    if (!title || !content) {
      return NextResponse.json({ message: 'Title and content are required' }, { status: 400 });
    }

    const newsItem = await prisma.newsItem.create({
      data: {
        title,
        content,
        priority: (priority as 'HIGH' | 'MEDIUM' | 'LOW') || 'MEDIUM',
        category: category || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        targetAudience: (targetAudience as 'ALL' | 'CANDIDATES' | 'EMPLOYERS') || 'ALL',
        displayPosition: (displayPosition as 'BANNER' | 'SIDEBAR' | 'MODAL') || 'BANNER',
        imageUrl: imageUrl || null,
        active,
      },
    });

    return NextResponse.json({ message: 'News item created successfully' });
  } catch (error) {
    console.error('Error creating news item:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const token = cookies().get('token')?.value;
    const entity = await getEntityFromToken(token);

    if (!entity || entity.type !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const newsItems = await prisma.newsItem.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(newsItems);
  } catch (error) {
    console.error('Error fetching news items:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = cookies().get('token')?.value;
    const entity = await getEntityFromToken(token);

    if (!entity || entity.type !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const {
      id,
      title,
      content,
      priority,
      category,
      expiresAt,
      targetAudience,
      displayPosition,
      imageUrl,
      active
    } = await req.json();

    if (!id || !title || !content) {
      return NextResponse.json({ message: 'ID, title, and content are required' }, { status: 400 });
    }

    const updatedNewsItem = await prisma.newsItem.update({
      where: { id: parseInt(id) },
      data: {
        title,
        content,
        priority: (priority as 'HIGH' | 'MEDIUM' | 'LOW') || 'MEDIUM',
        category: category || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        targetAudience: (targetAudience as 'ALL' | 'CANDIDATES' | 'EMPLOYERS') || 'ALL',
        displayPosition: (displayPosition as 'BANNER' | 'SIDEBAR' | 'MODAL') || 'BANNER',
        imageUrl: imageUrl || null,
        active,
      },
    });
    return NextResponse.json({ message: 'News item updated successfully' });
  } catch (error) {
    console.error('Error updating news item:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = cookies().get('token')?.value;
    const entity = await getEntityFromToken(token);

    if (!entity || entity.type !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ message: 'ID is required' }, { status: 400 });
    }

    await prisma.newsItem.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: 'News item deleted successfully' });
  } catch (error) {
    console.error('Error deleting news item:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
