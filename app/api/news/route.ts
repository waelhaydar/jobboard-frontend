import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';

export async function GET() {
  try {
    // Fetch only active news items, ordered by creation date (newest first)
    const newsItems = await prisma.newsItem.findMany({
      where: {
        active: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true
      }
    });

    // Return all news items without authentication requirement
    return NextResponse.json(newsItems);
  } catch (error) {
    console.error('Error fetching news items:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
