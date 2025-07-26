import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthUser(request)
    
    if (!user) {
      return NextResponse.json(
        { message: 'Yetkilendirme gerekli' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Check if user is member of the project
    const projectMember = await prisma.projectMember.findFirst({
      where: {
        projectId: id,
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
    const { title, description, type, priority, assigneeId } = body

    if (!title) {
      return NextResponse.json(
        { message: 'Görev başlığı gereklidir' },
        { status: 400 }
      )
    }

    // If assigneeId is provided, check if the assignee is a project member
    if (assigneeId) {
      console.log('Checking assignee:', { projectId: id, assigneeId })
      
      const assigneeMember = await prisma.projectMember.findFirst({
        where: {
          projectId: id,
          userId: assigneeId
        }
      })

      console.log('Found member:', assigneeMember)

      if (!assigneeMember) {
        return NextResponse.json(
          { message: 'Atanan kişi bu projenin üyesi değil' },
          { status: 400 }
        )
      }
    }

    const issue = await prisma.issue.create({
      data: {
        title,
        description,
        type: type || 'TASK',
        priority: priority || 'MEDIUM',
        status: 'TODO',
        projectId: id,
        creatorId: user.userId,
        assigneeId: assigneeId || null,
      },
      include: {
        assignee: {
          select: {
            name: true,
            email: true,
          }
        },
        creator: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    })

    return NextResponse.json(issue, { status: 201 })
  } catch (error) {
    console.error('Create issue error:', error)
    return NextResponse.json(
      { message: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}