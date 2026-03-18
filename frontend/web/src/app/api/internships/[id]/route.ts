import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/internships/[id]
 * Get single internship by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
        applications: {
          where: { studentId: request.nextUrl.searchParams.get('studentId') || undefined },
          select: {
            id: true,
            status: true,
          },
        },
      },
    })

    if (!internship) {
      return NextResponse.json({ error: 'Internship not found' }, { status: 404 })
    }

    // Increment view count
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

/**
 * PUT /api/internships/[id]
 * Update internship (employer only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const internship = await prisma.internship.update({
      where: { id: params.id },
      data: {
        ...body,
        startDate: body.startDate ? new Date(body.startDate) : null,
        applicationDeadline: body.applicationDeadline ? new Date(body.applicationDeadline) : null,
      },
    })

    return NextResponse.json({ success: true, internship })
  } catch (error) {
    console.error('Error updating internship:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/internships/[id]
 * Delete internship (employer only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.internship.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting internship:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
