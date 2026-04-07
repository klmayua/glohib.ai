import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

/**
 * POST /api/auth/login
 * Login with email/password using direct database authentication
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

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        studentProfile: true,
        employerProfile: true,
        mentorProfile: true,
      },
    })

    console.log('Login attempt for:', email, 'User found:', !!user, 'Has password:', !!user?.password)

    if (!user || !user.password) {
      console.log('No user or no password found')
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password!)
    console.log('Password valid:', isValidPassword)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check if user is active
    if (user.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Account is inactive. Please contact support.' },
        { status: 403 }
      )
    }

    // Prepare user data (exclude sensitive fields)
    const { password: _, ...userWithoutPassword } = user
    
    // Create a simple session token (in production, use JWT)
    const sessionToken = Buffer.from(`${user.id}:${Date.now()}`).toString('base64')

    // Set session cookie
    const nextResponse = NextResponse.json({
      success: true,
      message: 'Login successful',
      redirect: callbackUrl || '/dashboard',
      user: userWithoutPassword,
    })

    // Set session cookie
    nextResponse.cookies.set('session_token', sessionToken, {
      httpOnly: true,
      secure: false,  // Disabled for testing
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    // Set user ID cookie for client-side access
    nextResponse.cookies.set('user_id', user.id, {
      httpOnly: false,
      secure: false,  // Disabled for testing
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return nextResponse
  } catch (error) {
    console.error('Login error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Login failed: ' + errorMessage },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
