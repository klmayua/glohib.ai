import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/settings
 * Get user's settings/preferences
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get('user_id')?.value
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: {
          select: { profileCompleteness: true },
        },
      },
    })

    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json({
      success: true,
      settings: {
        email: user.email,
        role: user.role,
        status: user.status,
        profileCompleteness: user.studentProfile?.profileCompleteness || 0,
      },
    })
  } catch (error) {
    console.error('Settings error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PUT /api/settings
 * Update user settings
 */
export async function PUT(request: NextRequest) {
  try {
    const userId = request.cookies.get('user_id')?.value
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()

    if (body.notifications) {
      // Store notification preferences in user metadata or handle individually
      // For now, we just acknowledge the update
    }

    if (body.privacy) {
      // Update privacy settings
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Settings update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
