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

    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { message: 'E-posta parametresi gerekli' },
        { status: 400 }
      )
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            email: {
              contains: email
            }
          },
          {
            name: {
              contains: email
            }
          }
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      take: 10 // Limit results
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Search users error:', error)
    return NextResponse.json(
      { message: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}