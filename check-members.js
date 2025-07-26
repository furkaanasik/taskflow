const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkMembers() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        members: {
          include: {
            user: true
          }
        }
      }
    })
    
    console.log('Projects and their members:')
    projects.forEach(project => {
      console.log(`\nProject: ${project.name} (${project.key})`)
      console.log(`Creator ID: ${project.creatorId}`)
      console.log('Members:')
      project.members.forEach(member => {
        console.log(`  - ${member.user.name} (${member.user.id}) - Role: ${member.role}`)
      })
    })
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkMembers()