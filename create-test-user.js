const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createTestUser() {
  try {
    const hashedPassword = await bcrypt.hash('123456', 12)
    
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@test.com',
        password: hashedPassword,
      }
    })
    
    console.log('Test user created:', user)
    console.log('Login credentials:')
    console.log('Email: test@test.com')
    console.log('Password: 123456')
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser()