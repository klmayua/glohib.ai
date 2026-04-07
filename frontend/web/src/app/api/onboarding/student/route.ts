import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'

/**
 * POST /api/onboarding/student
 * Complete student profile onboarding
 */
export async function POST(request: NextRequest) {
  try {
    // Try cookie-based auth first, fall back to next-auth
    let userId = request.cookies.get('user_id')?.value
    let userEmail = ''

    if (!userId) {
      const session = await getServerSession(authOptions)
      userEmail = session?.user?.email || ''
      if (!userEmail) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      const dbUser = await prisma.user.findUnique({ where: { email: userEmail } })
      if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })
      userId = dbUser.id
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const {
      firstName,
      lastName,
      phone,
      dateOfBirth,
      nationality,
      currentLocation,
      university,
      major,
      graduationYear,
      degreeLevel,
      gpa,
      bio,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      skills,
      education,
      experience,
      interests,
    } = body

    // Create or update student profile
    const studentProfile = await prisma.studentProfile.upsert({
      where: { userId: user.id },
      update: {
        firstName,
        lastName,
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        nationality,
        currentLocation,
        university,
        major,
        graduationYear,
        degreeLevel,
        gpa,
        bio,
        linkedinUrl,
        githubUrl,
        portfolioUrl,
      },
      create: {
        userId: user.id,
        firstName,
        lastName,
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        nationality,
        currentLocation,
        university,
        major,
        graduationYear,
        degreeLevel,
        gpa,
        bio,
        linkedinUrl,
        githubUrl,
        portfolioUrl,
      },
    })

    // Create skills if provided
    if (skills && Array.isArray(skills)) {
      await prisma.skill.createMany({
        data: skills.map((skill: any) => ({
          studentId: studentProfile.id,
          name: skill.name,
          level: skill.level,
          yearsOfExperience: skill.yearsOfExperience,
          category: skill.category,
        })),
        skipDuplicates: true,
      })
    }

    // Create education records if provided
    if (education && Array.isArray(education)) {
      await prisma.education.createMany({
        data: education.map((edu: any) => ({
          studentId: studentProfile.id,
          institution: edu.institution,
          degree: edu.degree,
          fieldOfStudy: edu.fieldOfStudy,
          startDate: new Date(edu.startDate),
          endDate: edu.endDate ? new Date(edu.endDate) : null,
          description: edu.description,
          gpa: edu.gpa,
        })),
      })
    }

    // Create experience records if provided
    if (experience && Array.isArray(experience)) {
      await prisma.experience.createMany({
        data: experience.map((exp: any) => ({
          studentId: studentProfile.id,
          company: exp.company,
          position: exp.position,
          startDate: new Date(exp.startDate),
          endDate: exp.endDate ? new Date(exp.endDate) : null,
          description: exp.description,
          location: exp.location,
          isCurrent: exp.isCurrent || false,
        })),
      })
    }

    // Create interests if provided
    if (interests && Array.isArray(interests)) {
      await prisma.interest.createMany({
        data: interests.map((interest: any) => ({
          studentId: studentProfile.id,
          category: interest.category,
          value: interest.value,
          priority: interest.priority || 1,
        })),
        skipDuplicates: true,
      })
    }

    // Calculate profile completeness
    const completeness = calculateProfileCompleteness({
      firstName,
      lastName,
      university,
      major,
      graduationYear,
      skills: skills?.length || 0,
      education: education?.length || 0,
      experience: experience?.length || 0,
      bio,
    })

    await prisma.studentProfile.update({
      where: { id: studentProfile.id },
      data: { profileCompleteness: completeness },
    })

    return NextResponse.json({
      success: true,
      profile: studentProfile,
      completeness,
    })
  } catch (error) {
    console.error('Error in student onboarding:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * GET /api/onboarding/student
 * Get current user's student profile
 */
export async function GET(request: NextRequest) {
  try {
    let userId = request.cookies.get('user_id')?.value

    if (!userId) {
      const session = await getServerSession(authOptions)
      if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } })
      if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })
      userId = dbUser.id
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
          },
        },
      },
    })

    if (!user?.studentProfile) {
      return NextResponse.json({ profile: null })
    }

    return NextResponse.json({ profile: user.studentProfile })
  } catch (error) {
    console.error('Error fetching student profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function calculateProfileCompleteness(data: any): number {
  let score = 0
  const maxScore = 100

  // Basic info (30 points)
  if (data.firstName) score += 5
  if (data.lastName) score += 5
  if (data.university) score += 5
  if (data.major) score += 5
  if (data.graduationYear) score += 5
  if (data.bio && data.bio.length > 50) score += 5

  // Skills (20 points)
  if (data.skills > 0) score += Math.min(data.skills * 4, 20)

  // Education (20 points)
  if (data.education > 0) score += Math.min(data.education * 10, 20)

  // Experience (20 points)
  if (data.experience > 0) score += Math.min(data.experience * 10, 20)

  // Location (10 points)
  if (data.currentLocation) score += 10

  return Math.min(score, maxScore)
}
