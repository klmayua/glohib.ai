import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/dashboard/stats
 * Get real-time dashboard statistics for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get('user_id')?.value

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: {
          include: {
            skills: true,
            education: true,
            experience: true,
            interests: true,
            savedInternships: true,
            applications: true,
          },
        },
        employerProfile: {
          include: {
            internships: true,
          },
        },
        applications: {
          include: {
            internship: true,
          },
        },
        notifications: {
          where: { isRead: false },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get total published internships for recommendations
    const totalInternships = await prisma.internship.count({
      where: {
        status: 'PUBLISHED',
        applicationDeadline: { gt: new Date() },
      },
    })

    // Get recent activities
    const recentActivities = await prisma.application.findMany({
      where: { userId },
      include: {
        internship: {
          include: {
            employer: {
              include: {
                user: { select: { name: true } },
              },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    })

    // Get recommended internships (not yet applied to, published, not expired)
    const appliedInternshipIds = user.applications.map(a => a.internshipId)
    const savedInternshipIds = user.studentProfile?.savedInternships.map(s => s.internshipId) || []

    const recommendedInternships = await prisma.internship.findMany({
      where: {
        status: 'PUBLISHED',
        applicationDeadline: { gt: new Date() },
        id: { notIn: [...appliedInternshipIds, ...savedInternshipIds] },
      },
      include: {
        employer: {
          include: {
            user: { select: { name: true, email: true } },
          },
        },
      },
      orderBy: { publishedAt: 'desc' },
      take: 6,
    })

    // Calculate profile completeness
    const sp = user.studentProfile
    let profileCompleteness = 0
    if (sp) {
      profileCompleteness = sp.profileCompleteness
    }

    const stats = {
      applications: user.applications.length,
      savedRoles: savedInternshipIds.length,
      profileStrength: profileCompleteness,
      totalOpportunities: totalInternships,
      unreadNotifications: user.notifications.length,
      applicationsByStatus: user.applications.reduce((acc: Record<string, number>, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1
        return acc
      }, {}),
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        studentProfile: user.studentProfile,
        employerProfile: user.employerProfile,
      },
      stats,
      recommendedInternships,
      recentActivities,
      notifications: user.notifications,
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
