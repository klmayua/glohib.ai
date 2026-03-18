import { NextRequest, NextResponse } from 'next/server'

const IDENTITY_SERVICE_URL = process.env.IDENTITY_SERVICE_URL || 'http://localhost:8080'

/**
 * POST /api/auth/login
 * Login with email/password via Identity Service
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, callbackUrl } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Call identity service
    const response = await fetch(`${IDENTITY_SERVICE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { error: error.error || 'Invalid credentials' },
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
      message: 'Login successful',
      redirect: callbackUrl || '/dashboard',
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
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    )
  }
}
