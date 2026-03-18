import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'

/**
 * POST /api/onboarding/mentor
 * Complete mentor profile onboarding
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const {
      firstName,
      lastName,
      currentRole,
      currentCompany,
      bio,
      expertiseAreas,
      industries,
      mentoringExperience,
      availabilityStatus,
      availabilityHours,
      sessionFormat,
      timezone,
      profileImageUrl,
    } = body

    // Create or update mentor profile
    const mentorProfile = await prisma.mentorProfile.upsert({
      where: { userId: user.id },
      update: {
        firstName,
        lastName,
        currentRole,
        currentCompany,
        bio,
        expertiseAreas,
        industries,
        mentoringExperience,
        availabilityStatus,
        availabilityHours,
        sessionFormat,
        timezone,
        profileImageUrl,
      },
      create: {
        userId: user.id,
        firstName,
        lastName,
        currentRole,
        currentCompany,
        bio,
        expertiseAreas,
        industries,
        mentoringExperience,
        availabilityStatus,
        availabilityHours,
        sessionFormat,
        timezone,
        profileImageUrl,
      },
    })

    return NextResponse.json({
      success: true,
      profile: mentorProfile,
    })
  } catch (error) {
    console.error('Error in mentor onboarding:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * GET /api/onboarding/mentor
 * Get current user's mentor profile
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        mentorProfile: true,
      },
    })

    if (!user?.mentorProfile) {
      return NextResponse.json({ profile: null })
    }

    return NextResponse.json({ profile: user.mentorProfile })
  } catch (error) {
    console.error('Error fetching mentor profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
