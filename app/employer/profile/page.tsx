import { prisma } from '../../../lib/prismaClient'
import { getEntityFromToken } from '../../../lib/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import EmployerProfileClient from './EmployerProfileClient'

export default async function EmployerProfile(){
  const token = cookies().get('token')?.value
  if (!token) {
    redirect('/auth/login')
  }

  const entity = await getEntityFromToken(token)
  if (!entity || entity.type !== 'employer' || !entity.employer) {
    redirect('/auth/login')
  }

  const employer = await prisma.employer.findUnique({
    where: { id: entity.employer.id },
    include: { jobs: true }
  })

  if(!employer) {
    console.error('Employer not found in database')
    redirect('/auth/login')
  }

  if (!employer.approved) {
    redirect('/')
  }

  return <EmployerProfileClient employer={employer} title={`About ${employer.companyName}`} />
}
