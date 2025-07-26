import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function POST(
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

    // Check if issue exists in this project
    const issue = await prisma.issue.findFirst({
      where: {
        id: issueId,
        projectId
      }
    })

    if (!issue) {
      return NextResponse.json(
        { message: 'Görev bulunamadı' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { content } = body

    if (!content || !content.trim()) {
      return NextResponse.json(
        { message: 'Yorum içeriği gereklidir' },
        { status: 400 }
      )
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        issueId,
        userId: user.userId,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('Create comment error:', error)
    return NextResponse.json(
      { message: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}