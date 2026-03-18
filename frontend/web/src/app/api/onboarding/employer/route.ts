import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'

/**
 * POST /api/onboarding/employer
 * Complete employer profile onboarding
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
      companyName,
      companyWebsite,
      companySize,
      industry,
      companyDescription,
      companyLogoUrl,
      headquarters,
      foundedYear,
      emailDomain,
    } = body

    // Extract email domain from user email
    const userEmailDomain = user.email?.split('@')[1]

    // Create or update employer profile
    const employerProfile = await prisma.employerProfile.upsert({
      where: { userId: user.id },
      update: {
        companyName,
        companyWebsite,
        companySize,
        industry,
        companyDescription,
        companyLogoUrl,
        headquarters,
        foundedYear,
        emailDomain: emailDomain || userEmailDomain,
        isVerified: false, // Requires admin verification
      },
      create: {
        userId: user.id,
        companyName,
        companyWebsite,
        companySize,
        industry,
        companyDescription,
        companyLogoUrl,
        headquarters,
        foundedYear,
        emailDomain: emailDomain || userEmailDomain,
        isVerified: false,
      },
    })

    return NextResponse.json({
      success: true,
      profile: employerProfile,
    })
  } catch (error) {
    console.error('Error in employer onboarding:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * GET /api/onboarding/employer
 * Get current user's employer profile
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
        employerProfile: true,
      },
    })

    if (!user?.employerProfile) {
      return NextResponse.json({ profile: null })
    }

    return NextResponse.json({ profile: user.employerProfile })
  } catch (error) {
    console.error('Error fetching employer profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
