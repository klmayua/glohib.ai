import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/applications
 * Get user's applications using cookie-based auth
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get('user_id')?.value

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const applications = await prisma.application.findMany({
      where: { userId },
      include: {
        internship: {
          include: {
            employer: {
              include: {
                user: {
                  select: { name: true, email: true },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ applications })
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/applications
 * Submit an application for an internship
 */
export async function POST(request: NextRequest) {
  try {
    const userId = request.cookies.get('user_id')?.value

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { studentProfile: true },
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!dbUser.studentProfile) {
      return NextResponse.json({ error: 'Student profile required' }, { status: 403 })
    }

    const body = await request.json()
    const { internshipId, coverLetter, submissionData, screeningAnswers } = body

    if (!internshipId) {
      return NextResponse.json({ error: 'Internship ID is required' }, { status: 400 })
    }

    const internship = await prisma.internship.findUnique({
      where: { id: internshipId },
    })

    if (!internship) {
      return NextResponse.json({ error: 'Internship not found' }, { status: 404 })
    }

    const existingApplication = await prisma.application.findFirst({
      where: { internshipId, userId },
    })

    if (existingApplication) {
      return NextResponse.json({ error: 'Already applied' }, { status: 400 })
    }

    const application = await prisma.application.create({
      data: {
        internshipId,
        studentId: dbUser.studentProfile.id,
        userId: dbUser.id,
        status: 'SUBMITTED',
        coverLetter,
        submissionData,
        screeningAnswers,
        submittedAt: new Date(),
      },
      include: {
        internship: {
          include: {
            employer: true,
          },
        },
        student: true,
      },
    })

    await prisma.internship.update({
      where: { id: internshipId },
      data: { applicationsCount: internship.applicationsCount + 1 },
    })

    await prisma.notification.create({
      data: {
        userId: dbUser.id,
        type: 'APPLICATION_UPDATE',
        title: 'Application Submitted',
        message: `Your application for ${internship.title} has been submitted successfully.`,
        isRead: false,
      },
    })

    return NextResponse.json({ success: true, application })
  } catch (error) {
    console.error('Error submitting application:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
