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
    { title: 'Store Manager - Downtown', slug: 'store-manager-downtown', location: 'Downtown', description: 'Manage store operations, staff, inventory.', hiringFrom: '2024-01-01T00:00:00.000Z', basicMonthlySalaryUSD: 4000, transportation: true, accommodation: true, freeMeals: false, bonuses: true, companyCar: false },
    { title: 'Assistant Store Manager', slug: 'assistant-store-manager', location: 'City Center', description: 'Assist store manager in daily tasks and staff scheduling.', hiringFrom: '2024-02-01T00:00:00.000Z', basicMonthlySalaryUSD: 3000, transportation: false, accommodation: true, freeMeals: true, bonuses: false, companyCar: false },
    { title: 'Sales Associate', slug: 'sales-associate', location: 'Mall Branch', description: 'Customer service, sales, and merchandising.', hiringFrom: '2024-03-01T00:00:00.000Z', basicMonthlySalaryUSD: 2500, transportation: false, accommodation: false, freeMeals: false, bonuses: true, companyCar: false },
    { title: 'Inventory Specialist', slug: 'inventory-specialist', location: 'Warehouse', description: 'Manage stock counts, ordering, and supplier coordination.', hiringFrom: '2024-04-01T00:00:00.000Z', basicMonthlySalaryUSD: 3500, transportation: true, accommodation: false, freeMeals: true, bonuses: false, companyCar: true },
    { title: 'Driver / Delivery', slug: 'driver-delivery', location: 'Regional', description: 'Deliver goods to stores and manage logistics.', hiringFrom: '2024-05-01T00:00:00.000Z', basicMonthlySalaryUSD: 2800, transportation: true, accommodation: true, freeMeals: true, bonuses: true, companyCar: true }
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
        applicantLimit: 100, // Added applicantLimit
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Set endDate to one year from now
        hiringFrom: j.hiringFrom,
        basicMonthlySalaryUSD: j.basicMonthlySalaryUSD,
        transportation: j.transportation,
        accommodation: j.accommodation,
        freeMeals: j.freeMeals,
        bonuses: j.bonuses,
        companyCar: j.companyCar,
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
