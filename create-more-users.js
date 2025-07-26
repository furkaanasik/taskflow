const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createMoreUsers() {
  try {
    const users = [
      { name: 'Alice Johnson', email: 'alice@test.com', password: '123456' },
      { name: 'Bob Smith', email: 'bob@test.com', password: '123456' },
      { name: 'Carol Brown', email: 'carol@test.com', password: '123456' },
      { name: 'David Wilson', email: 'david@test.com', password: '123456' },
    ]

    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 12)
      
      const user = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
        }
      })
      
      console.log(`Created user: ${user.name} (${user.email})`)
    }
    
    console.log('\nAll users created successfully!')
    console.log('You can now search and add these users to your projects.')
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createMoreUsers()