import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/internships
 * Get all published internships with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const locationType = searchParams.get('locationType') || ''
    const department = searchParams.get('department') || ''

    const skip = (page - 1) * limit

    const where: any = {
      status: 'PUBLISHED',
      applicationDeadline: { gt: new Date() },
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { department: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (locationType) {
      where.locationType = locationType
    }

    if (department) {
      where.department = { contains: department, mode: 'insensitive' }
    }

    const [internships, total] = await Promise.all([
      prisma.internship.findMany({
        where,
        skip,
        take: limit,
        include: {
          employer: {
            include: {
              user: {
                select: { name: true, email: true },
              },
            },
          },
        },
        orderBy: { publishedAt: 'desc' },
      }),
      prisma.internship.count({ where }),
    ])

    return NextResponse.json({
      internships,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching internships:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/internships
 * Create a new internship (employers only)
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
      include: { employerProfile: true },
    })

    if (!dbUser?.employerProfile) {
      return NextResponse.json({ error: 'Employer profile required' }, { status: 403 })
    }

    const body = await request.json()
    const {
      title,
      description,
      requirements,
      responsibilities,
      benefits,
      location,
      locationType,
      department,
      duration,
      stipend,
      currency,
      startDate,
      applicationDeadline,
    } = body

    if (!title || !description || !location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const internship = await prisma.internship.create({
      data: {
        employerId: dbUser.employerProfile.id,
        title,
        description,
        requirements,
        responsibilities,
        benefits,
        location,
        locationType,
        department,
        duration,
        stipend,
        currency,
        startDate: new Date(startDate),
        applicationDeadline: new Date(applicationDeadline),
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true, internship })
  } catch (error) {
    console.error('Error creating internship:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
