import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    const user = getAuthUser(request)
    
    if (!user) {
      return NextResponse.json(
        { message: 'Yetkilendirme gerekli' },
        { status: 401 }
      )
    }

    const { id: projectId, memberId } = await params

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
    const { role } = body

    if (!role || !['MEMBER', 'ADMIN'].includes(role)) {
      return NextResponse.json(
        { message: 'Geçerli bir rol belirtiniz' },
        { status: 400 }
      )
    }

    // Check if target member exists
    const targetMember = await prisma.projectMember.findFirst({
      where: {
        id: memberId,
        projectId
      }
    })

    if (!targetMember) {
      return NextResponse.json(
        { message: 'Üye bulunamadı' },
        { status: 404 }
      )
    }

    // Can't change owner role
    if (targetMember.role === 'OWNER') {
      return NextResponse.json(
        { message: 'Proje sahibinin rolü değiştirilemez' },
        { status: 400 }
      )
    }

    const updatedMember = await prisma.projectMember.update({
      where: { id: memberId },
      data: { role },
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

    return NextResponse.json(updatedMember)
  } catch (error) {
    console.error('Update member role error:', error)
    return NextResponse.json(
      { message: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    const user = getAuthUser(request)
    
    if (!user) {
      return NextResponse.json(
        { message: 'Yetkilendirme gerekli' },
        { status: 401 }
      )
    }

    const { id: projectId, memberId } = await params

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

    // Check if target member exists
    const targetMember = await prisma.projectMember.findFirst({
      where: {
        id: memberId,
        projectId
      }
    })

    if (!targetMember) {
      return NextResponse.json(
        { message: 'Üye bulunamadı' },
        { status: 404 }
      )
    }

    // Can't remove owner
    if (targetMember.role === 'OWNER') {
      return NextResponse.json(
        { message: 'Proje sahibi çıkarılamaz' },
        { status: 400 }
      )
    }

    await prisma.projectMember.delete({
      where: { id: memberId }
    })

    return NextResponse.json({ message: 'Üye başarıyla çıkarıldı' })
  } catch (error) {
    console.error('Remove member error:', error)
    return NextResponse.json(
      { message: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}