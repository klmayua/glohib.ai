import { NextRequest, NextResponse } from 'next/server'

const IDENTITY_SERVICE_URL = process.env.IDENTITY_SERVICE_URL || 'http://localhost:8080'

/**
 * POST /api/auth/register
 * Register a new user with email/password via Identity Service
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, role = 'student' } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Call identity service to register user
    const response = await fetch(`${IDENTITY_SERVICE_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role: role.toLowerCase() }),
    })

    if (!response.ok) {
      const error = await response.json()
      if (error.error?.includes('user exists') || error.error?.includes('already')) {
        return NextResponse.json(
          { error: 'An account with this email already exists' },
          { status: 409 }
        )
      }
      return NextResponse.json(
        { error: error.error || 'Registration failed' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Fetch user data from identity service
    const meResponse = await fetch(`${IDENTITY_SERVICE_URL}/api/v1/auth/me`, {
      headers: {
        'Authorization': `Bearer ${data.tokens.access_token}`,
      },
    })
    
    const userData = await meResponse.json()
    
    // Set cookies with tokens
    const nextResponse = NextResponse.json({
      success: true,
      message: 'Registration successful. Please log in.',
      user: userData,
      tokens: data.tokens
    })

    // Set access token cookie
    nextResponse.cookies.set('access_token', data.tokens.access_token, {
      httpOnly: true,
      secure: false,  // Disabled for HTTP - enable for HTTPS
      sameSite: 'lax',
      maxAge: 60 * 15, // 15 minutes
      path: '/',
    })

    // Set refresh token cookie
    nextResponse.cookies.set('refresh_token', data.tokens.refresh_token, {
      httpOnly: true,
      secure: false,  // Disabled for HTTP - enable for HTTPS
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return nextResponse
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
