import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // Create response with JSON content type
    const response = NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    )

    // Clear the token cookie
    response.cookies.set('token', '', {
      httpOnly: true,
      path: '/',
      maxAge: 0,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    )
  }
}
