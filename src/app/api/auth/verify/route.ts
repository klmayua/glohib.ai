import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import crypto from 'crypto'

/**
 * POST /api/auth/verify/send
 * Send verification email
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: 'Email already verified' }, { status: 400 })
    }

    // Create verification token
    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Delete any existing tokens for this email
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    })

    // Create new token
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    })

    // Send email (will be implemented with email service)
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const verificationUrl = `${baseUrl}/auth/verify?token=${token}`

    // For now, just log the URL (email service will be integrated)
    console.log('Verification URL:', verificationUrl)

    // TODO: Integrate with email service
    // await emailService.sendVerification(email, token, baseUrl)

    return NextResponse.json({ 
      success: true, 
      message: 'Verification email sent' 
    })
  } catch (error) {
    console.error('Verification send error:', error)
    return NextResponse.json({ 
      error: 'Failed to send verification email' 
    }, { status: 500 })
  }
}

/**
 * GET /api/auth/verify
 * Verify email with token
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Token required' }, { status: 400 })
  }

  try {
    // Find token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    })

    if (!verificationToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
    }

    // Check expiration
    if (verificationToken.expires < new Date()) {
      return NextResponse.json({ error: 'Token expired' }, { status: 400 })
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        status: 'ACTIVE',
      },
    })

    // Delete token
    await prisma.verificationToken.delete({
      where: { id: verificationToken.id },
    })

    // Send welcome email
    // await emailService.sendWelcome(user.email, user.name || 'User', user.role)

    return NextResponse.json({ 
      success: true, 
      message: 'Email verified successfully' 
    })
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json({ 
      error: 'Verification failed' 
    }, { status: 500 })
  }
}
