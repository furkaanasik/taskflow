import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(
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
    const project = await prisma.project.findFirst({
      where: {
        id,
        OR: [
          { creatorId: user.userId },
          {
            members: {
              some: {
                userId: user.userId
              }
            }
          }
        ]
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              }
            }
          }
        },
        issues: {
          include: {
            assignee: {
              select: {
                name: true,
              }
            }
          },
          orderBy: {
            updatedAt: 'desc'
          }
        }
      }
    })

    if (!project) {
      return NextResponse.json(
        { message: 'Proje bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Get project error:', error)
    return NextResponse.json(
      { message: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}