import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main(){
  const adminPw = await bcrypt.hash('myname', 10)
  await prisma.admin.upsert({
    where: { email: 'wael@local.test' },
    update: {},
    create: { email: 'wael@local.test', password: adminPw, name: 'Wael' }
  })

  const empPw = await bcrypt.hash('employerpass', 10)
  const emp = await prisma.employer.upsert({
    where: { email: 'acme@local.test' },
    update: {},
    create: { companyName: 'Acme Corp', email: 'acme@local.test', password: empPw, approved: true }
  })

  const jobs = [
    { title: 'Store Manager - Downtown', slug: 'store-manager-downtown', location: 'Downtown', description: 'Manage store operations, staff, inventory.' },
    { title: 'Assistant Store Manager', slug: 'assistant-store-manager', location: 'City Center', description: 'Assist store manager in daily tasks and staff scheduling.' },
    { title: 'Sales Associate', slug: 'sales-associate', location: 'Mall Branch', description: 'Customer service, sales, and merchandising.' },
    { title: 'Inventory Specialist', slug: 'inventory-specialist', location: 'Warehouse', description: 'Manage stock counts, ordering, and supplier coordination.' },
    { title: 'Driver / Delivery', slug: 'driver-delivery', location: 'Regional', description: 'Deliver goods to stores and manage logistics.' }
  ]

  for(const j of jobs){
    await prisma.job.upsert({
      where: { slug: j.slug },
      update: {},
      create: {
        title: j.title,
        slug: j.slug,
        description: j.description,
        location: j.location,
        salary: 50000, // Add required salary field
        employer: {
          connect: { id: emp.id }
        }
      }
    })
  }

  await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, cryptoCurrenciesCount: 5 }
  })

  // Seed news items
  await prisma.newsItem.createMany({
    data: [
      {
        title: 'Welcome to Our Job Board',
        content: 'We are excited to launch our new job board platform. Find your dream job or post opportunities for top talent.',
        priority: 'HIGH',
        category: 'Announcement',
        targetAudience: 'ALL',
        displayPosition: 'BANNER',
        active: true
      },
      {
        title: 'New Features Added',
        content: 'Check out the latest features including improved search, notifications, and employer dashboards.',
        priority: 'MEDIUM',
        category: 'Update',
        targetAudience: 'ALL',
        displayPosition: 'BANNER',
        active: true
      }
    ]
  })

  console.log('Seed complete. Admin: wael@local.test / myname')
}
main().catch(e=>{ console.error(e); process.exit(1) }).finally(()=>process.exit())
