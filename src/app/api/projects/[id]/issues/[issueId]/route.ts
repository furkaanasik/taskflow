import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; issueId: string }> }
) {
  try {
    const user = getAuthUser(request)
    
    if (!user) {
      return NextResponse.json(
        { message: 'Yetkilendirme gerekli' },
        { status: 401 }
      )
    }

    const { id: projectId, issueId } = await params

    // Check if user has access to the project
    const projectMember = await prisma.projectMember.findFirst({
      where: {
        projectId,
        userId: user.userId
      }
    })

    if (!projectMember) {
      return NextResponse.json(
        { message: 'Bu projeye erişim yetkiniz yok' },
        { status: 403 }
      )
    }

    const issue = await prisma.issue.findFirst({
      where: {
        id: issueId,
        projectId
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            key: true,
          }
        },
        comments: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    })

    if (!issue) {
      return NextResponse.json(
        { message: 'Görev bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json(issue)
  } catch (error) {
    console.error('Get issue error:', error)
    return NextResponse.json(
      { message: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; issueId: string }> }
) {
  try {
    const user = getAuthUser(request)
    
    if (!user) {
      return NextResponse.json(
        { message: 'Yetkilendirme gerekli' },
        { status: 401 }
      )
    }

    const { id: projectId, issueId } = await params

    // Check if user has access to the project
    const projectMember = await prisma.projectMember.findFirst({
      where: {
        projectId,
        userId: user.userId
      }
    })

    if (!projectMember) {
      return NextResponse.json(
        { message: 'Bu projeye erişim yetkiniz yok' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { status, priority, assigneeId, title, description } = body

    const updatedIssue = await prisma.issue.update({
      where: {
        id: issueId,
        projectId
      },
      data: {
        ...(status && { status }),
        ...(priority && { priority }),
        ...(assigneeId !== undefined && { assigneeId }),
        ...(title && { title }),
        ...(description !== undefined && { description }),
        updatedAt: new Date(),
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            key: true,
          }
        },
        comments: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    })

    return NextResponse.json(updatedIssue)
  } catch (error) {
    console.error('Update issue error:', error)
    return NextResponse.json(
      { message: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}