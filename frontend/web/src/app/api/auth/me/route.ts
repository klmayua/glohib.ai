import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Get session token from cookie
    const sessionToken = request.cookies.get('session_token')?.value
    const userId = request.cookies.get('user_id')?.value

    console.log('Auth me - sessionToken:', sessionToken ? 'present' : 'missing')
    console.log('Auth me - userId:', userId)

    if (!sessionToken || !userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Decode session token to get user ID and verify it's recent
    try {
      const decoded = Buffer.from(sessionToken, 'base64').toString('utf-8')
      const [tokenUserId, timestamp] = decoded.split(':')
      
      console.log('Decoded token - userId:', tokenUserId, 'timestamp:', timestamp)
      
      // Verify user ID matches
      if (tokenUserId !== userId) {
        console.log('User ID mismatch:', tokenUserId, '!=', userId)
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      // Check if session is not too old (7 days max)
      const sessionAge = Date.now() - parseInt(timestamp)
      const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 days
      console.log('Session age:', sessionAge, 'max:', maxAge)
      if (sessionAge > maxAge) {
        return NextResponse.json({ error: 'Session expired' }, { status: 401 })
      }
    } catch (decodeError) {
      console.error('Token decode error:', decodeError)
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: true,
        employerProfile: true,
        mentorProfile: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Remove sensitive fields
    const { password, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      data: userWithoutPassword,
    })
  } catch (error) {
    console.error('Auth me error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
