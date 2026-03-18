import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import bcrypt from 'bcryptjs'

// Rate limiting store (in production, use Redis)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()

const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes

/**
 * POST /api/auth/login
 * Login with credentials
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
    }

    // Rate limiting check
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    const attempt = loginAttempts.get(ip)

    if (attempt) {
      // Check if lockout period has expired
      if (now - attempt.lastAttempt > LOCKOUT_DURATION) {
        loginAttempts.delete(ip)
      } else if (attempt.count >= MAX_ATTEMPTS) {
        const remainingTime = Math.ceil((LOCKOUT_DURATION - (now - attempt.lastAttempt)) / 60000)
        return NextResponse.json(
          { 
            error: 'Too many failed attempts. Please try again later.',
            retryAfter: remainingTime 
          },
          { status: 429 }
        )
      }
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        studentProfile: true,
        employerProfile: true,
        mentorProfile: true,
      },
    })

    if (!user) {
      // Increment failed attempt
      incrementFailedAttempt(ip)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if user is active
    if (user.status === 'SUSPENDED') {
      return NextResponse.json(
        { error: 'Account suspended. Please contact support.' },
        { status: 403 }
      )
    }

    if (user.status === 'DELETED') {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      )
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return NextResponse.json(
        { 
          error: 'Please verify your email before logging in',
          requiresVerification: true 
        },
        { status: 403 }
      )
    }

    // Verify password
    if (!user.password) {
      incrementFailedAttempt(ip)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
      incrementFailedAttempt(ip)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Clear failed attempts on success
    loginAttempts.delete(ip)

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    // Create session token (simplified - use NextAuth in production)
    const token = Buffer.from(JSON.stringify({
      id: user.id,
      email: user.email,
      role: user.role,
      exp: Date.now() + 60 * 60 * 1000, // 1 hour
    })).toString('base64')

    return NextResponse.json({
      success: true,
      tokens: {
        access_token: token,
        refresh_token: token, // Simplified
        user_id: user.id,
        email: user.email,
        role: user.role,
      },
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    )
  }
}

function incrementFailedAttempt(ip: string) {
  const now = Date.now()
  const attempt = loginAttempts.get(ip)

  if (attempt) {
    loginAttempts.set(ip, {
      count: attempt.count + 1,
      lastAttempt: now,
    })
  } else {
    loginAttempts.set(ip, {
      count: 1,
      lastAttempt: now,
    })
  }
}
