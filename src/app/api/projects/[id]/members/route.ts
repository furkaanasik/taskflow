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

    // Check if user has access to the project
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

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          },
          orderBy: {
            joinedAt: 'asc'
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
    console.error('Get project members error:', error)
    return NextResponse.json(
      { message: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}

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

    const { id: projectId } = await params

    // Check if user is admin or owner of the project
    const userMember = await prisma.projectMember.findFirst({
      where: {
        projectId,
        userId: user.userId,
        role: {
          in: ['OWNER', 'ADMIN']
        }
      }
    })

    if (!userMember) {
      return NextResponse.json(
        { message: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { message: 'Kullanıcı ID gereklidir' },
        { status: 400 }
      )
    }

    // Check if user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!targetUser) {
      return NextResponse.json(
        { message: 'Kullanıcı bulunamadı' },
        { status: 404 }
      )
    }

    // Check if user is already a member
    const existingMember = await prisma.projectMember.findFirst({
      where: {
        projectId,
        userId
      }
    })

    if (existingMember) {
      return NextResponse.json(
        { message: 'Bu kullanıcı zaten proje üyesi' },
        { status: 400 }
      )
    }

    // Add user to project
    const newMember = await prisma.projectMember.create({
      data: {
        projectId,
        userId,
        role: 'MEMBER'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })

    return NextResponse.json(newMember, { status: 201 })
  } catch (error) {
    console.error('Add project member error:', error)
    return NextResponse.json(
      { message: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}