import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/profile
 * Get current user's complete profile
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get('user_id')?.value
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: {
          include: {
            skills: true,
            education: true,
            experience: true,
            interests: true,
            savedInternships: {
              include: {
                internship: {
                  include: {
                    employer: {
                      include: {
                        user: { select: { name: true, email: true } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        employerProfile: {
          include: {
            internships: true,
          },
        },
        mentorProfile: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { password, ...userSafe } = user
    return NextResponse.json({ success: true, user: userSafe })
  } catch (error) {
    console.error('Profile error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PUT /api/profile
 * Update current user's profile
 */
export async function PUT(request: NextRequest) {
  try {
    const userId = request.cookies.get('user_id')?.value
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { basicInfo, skills, education, experience } = body

    // Update user basic info
    if (basicInfo) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          name: basicInfo.name,
        },
      })
    }

    // Update or create student profile
    const studentProfile = await prisma.studentProfile.upsert({
      where: { userId },
      update: {
        ...(basicInfo?.phone && { phone: basicInfo.phone }),
        ...(basicInfo?.location && { currentLocation: basicInfo.location }),
        ...(basicInfo?.bio && { bio: basicInfo.bio }),
        ...(basicInfo?.linkedInUrl && { linkedinUrl: basicInfo.linkedInUrl }),
        ...(basicInfo?.portfolioUrl && { portfolioUrl: basicInfo.portfolioUrl }),
      },
      create: {
        userId,
        firstName: basicInfo?.name?.split(' ')[0] || '',
        lastName: basicInfo?.name?.split(' ').slice(1).join(' ') || '',
        phone: basicInfo?.phone || '',
        currentLocation: basicInfo?.location || '',
        bio: basicInfo?.bio || '',
        linkedinUrl: basicInfo?.linkedInUrl || '',
        portfolioUrl: basicInfo?.portfolioUrl || '',
      },
    })

    // Update skills
    if (skills && Array.isArray(skills)) {
      await prisma.skill.deleteMany({ where: { studentId: studentProfile.id } })
      if (skills.length > 0) {
        await prisma.skill.createMany({
          data: skills.map((s: any) => ({
            studentId: studentProfile.id,
            name: s.name,
            level: s.level || 'Intermediate',
          })),
        })
      }
    }

    // Update education
    if (education && Array.isArray(education)) {
      await prisma.education.deleteMany({ where: { studentId: studentProfile.id } })
      const eduData = education
        .filter((e: any) => e.institution)
        .map((e: any) => ({
          studentId: studentProfile.id,
          institution: e.institution,
          degree: e.degree,
          fieldOfStudy: e.field,
          startDate: new Date(e.startYear || new Date()),
          endDate: e.endYear ? new Date(e.endYear) : null,
        }))
      if (eduData.length > 0) {
        await prisma.education.createMany({ data: eduData })
      }
    }

    // Update experience
    if (experience && Array.isArray(experience)) {
      await prisma.experience.deleteMany({ where: { studentId: studentProfile.id } })
      const expData = experience
        .filter((e: any) => e.company)
        .map((e: any) => ({
          studentId: studentProfile.id,
          company: e.company,
          position: e.title,
          startDate: new Date(e.startDate || new Date()),
          endDate: e.endDate ? new Date(e.endDate) : null,
          description: e.description,
          location: e.location,
          isCurrent: e.isCurrent || false,
        }))
      if (expData.length > 0) {
        await prisma.experience.createMany({ data: expData })
      }
    }

    // Recalculate profile completeness
    const updatedProfile = await prisma.studentProfile.findUnique({
      where: { id: studentProfile.id },
      include: { skills: true, education: true, experience: true },
    })

    if (updatedProfile) {
      let completeness = 0
      if (updatedProfile.firstName) completeness += 5
      if (updatedProfile.lastName) completeness += 5
      if (updatedProfile.university) completeness += 5
      if (updatedProfile.major) completeness += 5
      if (updatedProfile.graduationYear) completeness += 5
      if (updatedProfile.bio && updatedProfile.bio.length > 50) completeness += 5
      if (updatedProfile.skills.length > 0) completeness += Math.min(updatedProfile.skills.length * 4, 20)
      if (updatedProfile.education.length > 0) completeness += Math.min(updatedProfile.education.length * 10, 20)
      if (updatedProfile.experience.length > 0) completeness += Math.min(updatedProfile.experience.length * 10, 20)
      if (updatedProfile.currentLocation) completeness += 10
      completeness = Math.min(completeness, 100)

      await prisma.studentProfile.update({
        where: { id: studentProfile.id },
        data: { profileCompleteness: completeness },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
