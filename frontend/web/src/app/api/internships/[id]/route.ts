import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/internships/[id]
 * Get a single internship by ID
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const internship = await prisma.internship.findUnique({
      where: { id: params.id },
      include: {
        employer: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
      },
    })

    if (!internship) {
      return NextResponse.json({ error: 'Internship not found' }, { status: 404 })
    }

    // Increment views
    await prisma.internship.update({
      where: { id: params.id },
      data: { views: internship.views + 1 },
    })

    return NextResponse.json({ internship })
  } catch (error) {
    console.error('Error fetching internship:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
