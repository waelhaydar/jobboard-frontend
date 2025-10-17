import { NextRequest, NextResponse } from 'next/server'
import { prisma } from 'lib/prismaClient'
import { getEntityFromToken } from 'lib/auth'
export const dynamic = 'force-dynamic'
export async function GET() {
  try {
    const settings = await prisma.settings.findFirst()
    if (!settings) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 })
    }
    return NextResponse.json(settings)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    console.log('Token received:', token ? 'present' : 'missing')
    const entity = await getEntityFromToken(token)
    if (!entity || entity.type !== 'admin') {
      console.log('Unauthorized: entity type', entity?.type)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    console.log('Request body:', body)
    const { cryptoCurrenciesCount } = body
    if (typeof cryptoCurrenciesCount !== 'number' || cryptoCurrenciesCount < 1 || cryptoCurrenciesCount > 100) {
      console.log('Invalid cryptoCurrenciesCount:', cryptoCurrenciesCount)
      return NextResponse.json({ error: 'Invalid cryptoCurrenciesCount' }, { status: 400 })
    }

    console.log('Attempting upsert with cryptoCurrenciesCount:', cryptoCurrenciesCount)
    const settings = await prisma.settings.upsert({
      where: { id: 1 },
      update: { cryptoCurrenciesCount },
      create: { cryptoCurrenciesCount }
    })
    console.log('Upsert result:', settings)

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error in POST /api/admin/settings:', error)
    return NextResponse.json({ error: 'Failed to update settings', details: error.message }, { status: 500 })
  }
}
