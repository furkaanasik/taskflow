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

    // Get all issues from projects where user is a member
    const issues = await prisma.issue.findMany({
      where: {
        project: {
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
        }
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
        },
        project: {
          select: {
            id: true,
            name: true,
            key: true,
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return NextResponse.json(issues)
  } catch (error) {
    console.error('Get issues error:', error)
    return NextResponse.json(
      { message: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}