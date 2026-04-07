import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/recommendations
 * Get personalized internship recommendations based on user profile
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
            interests: true,
          },
        },
        applications: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const appliedInternshipIds = user.applications.map(a => a.internshipId)

    // Get published, non-expired internships that user hasn't applied to
    const internships = await prisma.internship.findMany({
      where: {
        status: 'PUBLISHED',
        applicationDeadline: { gt: new Date() },
        id: { notIn: appliedInternshipIds },
      },
      include: {
        employer: {
          include: {
            user: { select: { name: true, email: true } },
          },
        },
      },
      orderBy: { publishedAt: 'desc' },
    })

    // Calculate match scores based on skills and interests
    const studentSkills = user.studentProfile?.skills.map(s => s.name.toLowerCase()) || []
    const studentInterests = user.studentProfile?.interests.map(i => i.value.toLowerCase()) || []
    const studentMajor = user.studentProfile?.major?.toLowerCase() || ''
    const studentLocation = user.studentProfile?.currentLocation?.toLowerCase() || ''

    const scored = internships.map(internship => {
      let matchScore = 50 // Base score

      // Skill matching
      const internshipReqs = internship.requirements.map(r => r.toLowerCase())
      const skillMatches = studentSkills.filter(skill =>
        internshipReqs.some(req => req.includes(skill) || skill.includes(req))
      )
      matchScore += skillMatches.length * 8

      // Department matching with major
      if (studentMajor && internship.department) {
        const dept = internship.department.toLowerCase()
        if (dept.includes(studentMajor) || studentMajor.includes(dept)) {
          matchScore += 15
        }
      }

      // Interest matching
      const interestMatches = studentInterests.filter(interest =>
        internship.title.toLowerCase().includes(interest) ||
        internship.description.toLowerCase().includes(interest) ||
        internship.department?.toLowerCase().includes(interest)
      )
      matchScore += interestMatches.length * 10

      // Location bonus
      if (studentLocation && internship.location.toLowerCase().includes(studentLocation.split(',')[0])) {
        matchScore += 10
      }

      return {
        ...internship,
        match: Math.min(Math.round(matchScore), 99),
      }
    })

    // Sort by match score
    scored.sort((a, b) => b.match - a.match)

    return NextResponse.json({
      success: true,
      recommendations: scored,
    })
  } catch (error) {
    console.error('Recommendations error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
