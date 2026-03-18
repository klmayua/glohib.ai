import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/applications
 * Get user's applications
 */
export async function GET(request: NextRequest) {
  try {
    // Get user from cookie-based auth
    const authCookie = request.cookies.get('access_token')?.value
    
    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user info from identity service
    const userResponse = await fetch('http://localhost:8080/api/v1/auth/me', {
      headers: {
        'Authorization': `Bearer ${authCookie}`,
      },
    })
    
    if (!userResponse.ok) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const user = await userResponse.json()

    if (!user?.email) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Find user in database by email
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      include: { studentProfile: true },
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get applications
    const applications = await prisma.application.findMany({
      where: { userId: dbUser.id },
      include: {
        internship: {
          include: {
            employer: true,
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
    // Get user from cookie-based auth
    const authCookie = request.cookies.get('access_token')?.value
    
    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user info from identity service
    const userResponse = await fetch('http://localhost:8080/api/v1/auth/me', {
      headers: {
        'Authorization': `Bearer ${authCookie}`,
      },
    })
    
    if (!userResponse.ok) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const user = await userResponse.json()

    if (!user?.email) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      include: { studentProfile: true },
    })

    if (!dbUser?.studentProfile) {
      return NextResponse.json({ error: 'Student profile required' }, { status: 403 })
    }

    const body = await request.json()
    const { internshipId, coverLetter, submissionData, screeningAnswers } = body

    if (!internshipId) {
      return NextResponse.json({ error: 'Internship ID is required' }, { status: 400 })
    }

    // Check if internship exists
    const internship = await prisma.internship.findUnique({
      where: { id: internshipId },
    })

    if (!internship) {
      return NextResponse.json({ error: 'Internship not found' }, { status: 404 })
    }

    // Check if already applied
    const existingApplication = await prisma.application.findFirst({
      where: {
        internshipId,
        userId: dbUser.id,
      },
    })

    if (existingApplication) {
      return NextResponse.json({ error: 'You have already applied to this internship' }, { status: 400 })
    }

    // Create application
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

    // Update internship applications count
    await prisma.internship.update({
      where: { id: internshipId },
      data: { applicationsCount: internship.applicationsCount + 1 },
    })

    // Create notification for student
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
