import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { emailService } from '@/lib/email/service'
import crypto from 'crypto'

/**
 * POST /api/auth/verify/request
 * Send verification email to user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { studentProfile: true, employerProfile: true, mentorProfile: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: 'Email already verified' }, { status: 400 })
    }

    // Generate verification token
    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Delete any existing tokens for this email
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    })

    // Create new verification token
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    })

    // Get user name
    const userName = user.name || 
                     user.studentProfile?.firstName || 
                     user.employerProfile?.companyName ||
                     user.mentorProfile?.firstName ||
                     undefined

    // Send verification email
    const verifyUrl = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`
    const result = await emailService.sendVerificationEmail(email, verifyUrl, userName)

    if (!result.success) {
      console.error('Failed to send verification email:', result.error)
      return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Verification email sent. Please check your inbox.' 
    })
  } catch (error) {
    console.error('Error requesting verification email:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * GET /api/auth/verify
 * Verify email with token
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    // Find verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    })

    if (!verificationToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
    }

    // Check if token is expired
    if (verificationToken.expires < new Date()) {
      await prisma.verificationToken.delete({
        where: { token },
      })
      return NextResponse.json({ error: 'Token has expired' }, { status: 400 })
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update user email verification status
    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: {
        emailVerified: new Date(),
        status: 'ACTIVE',
      },
    })

    // Delete the token
    await prisma.verificationToken.delete({
      where: { token },
    })

    // Send welcome email
    const userName = user.name || undefined
    await emailService.sendWelcomeEmail(user.email!, userName)

    return NextResponse.json({ 
      success: true, 
      message: 'Email verified successfully. Welcome to Glohib.ai!' 
    })
  } catch (error) {
    console.error('Error verifying email:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
