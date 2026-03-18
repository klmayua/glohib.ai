import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { emailService } from '@/lib/email/service'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'

/**
 * POST /api/auth/reset-password/request
 * Request password reset - sends reset email
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

    // Always return success to prevent email enumeration
    if (!user || !user.password) {
      return NextResponse.json({ 
        success: true, 
        message: 'If an account exists with this email, a password reset link has been sent.' 
      })
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Delete any existing tokens for this email
    await prisma.passwordResetToken.deleteMany({
      where: { email },
    })

    // Create new reset token
    await prisma.passwordResetToken.create({
      data: {
        email,
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

    // Send reset email
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}&email=${email}`
    const result = await emailService.sendPasswordResetEmail(email, resetUrl, userName)

    if (!result.success) {
      console.error('Failed to send password reset email:', result.error)
    }

    return NextResponse.json({ 
      success: true, 
      message: 'If an account exists with this email, a password reset link has been sent.' 
    })
  } catch (error) {
    console.error('Error requesting password reset:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PUT /api/auth/reset-password/confirm
 * Confirm password reset with token
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, email, password } = body

    if (!token || !email || !password) {
      return NextResponse.json({ error: 'Token, email, and password are required' }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 })
    }

    // Find reset token
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: { token, email },
    })

    if (!resetToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
    }

    // Check if token is expired
    if (resetToken.expires < new Date()) {
      await prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      })
      return NextResponse.json({ error: 'Token has expired' }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update user password
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    })

    // Delete the token
    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id },
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Password reset successfully. You can now log in with your new password.' 
    })
  } catch (error) {
    console.error('Error resetting password:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
