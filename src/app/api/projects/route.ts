import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request)
    
    if (!user) {
      return NextResponse.json(
        { message: 'Yetkilendirme gerekli' },
        { status: 401 }
      )
    }

    const projects = await prisma.project.findMany({
      where: {
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
        _count: {
          select: {
            members: true,
            issues: true,
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Get projects error:', error)
    return NextResponse.json(
      { message: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request)
    
    if (!user) {
      return NextResponse.json(
        { message: 'Yetkilendirme gerekli' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, key, description } = body

    if (!name || !key) {
      return NextResponse.json(
        { message: 'Proje adı ve kodu gereklidir' },
        { status: 400 }
      )
    }

    // Check if project key already exists
    const existingProject = await prisma.project.findUnique({
      where: { key }
    })

    if (existingProject) {
      return NextResponse.json(
        { message: 'Bu proje kodu zaten kullanılıyor' },
        { status: 400 }
      )
    }

    const project = await prisma.project.create({
      data: {
        name,
        key,
        description,
        creatorId: user.userId,
        members: {
          create: {
            userId: user.userId,
            role: 'OWNER'
          }
        }
      },
      include: {
        _count: {
          select: {
            members: true,
            issues: true,
          }
        }
      }
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Create project error:', error)
    return NextResponse.json(
      { message: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}