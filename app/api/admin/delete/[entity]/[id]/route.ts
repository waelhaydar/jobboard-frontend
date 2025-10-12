import { prisma } from 'lib/prismaClient'
import { getEntityFromToken } from 'lib/auth'
import { cookies } from 'next/headers'


export async function DELETE(request: Request, { params }: { params: { entity: string, id: string } }) {
  const token = cookies().get('token')?.value
  const entity = await getEntityFromToken(token)

  if (!entity || entity.type !== 'admin') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const { entity: entityType, id: idString } = params
  const id = parseInt(idString)

  try {
    switch (entityType) {
      case 'candidate':
        await prisma.candidate.delete({ where: { id } })
        break
      case 'employer':
        await prisma.employer.delete({ where: { id } })
        break
      case 'job':
        await prisma.job.delete({ where: { id: idString } })
        break
      case 'admin':
        await prisma.admin.delete({ where: { id } })
        break
      case 'application':
        await prisma.application.delete({ where: { id } })
        break
      case 'notification':
        await prisma.notification.delete({ where: { id } })
        break
      default:
        return new Response(JSON.stringify({ error: 'Invalid entity type' }), { status: 400 })
    }
    return new Response(JSON.stringify({ message: `${entityType} with ID ${id} deleted successfully` }), { status: 200 })
  } catch (error) {
    console.error(`Error deleting ${entityType} with ID ${id}:`, error)
    return new Response(JSON.stringify({ error: `Failed to delete ${entityType}` }), { status: 500 })
  }
}