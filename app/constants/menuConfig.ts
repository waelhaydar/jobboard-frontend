type MenuItem = {
  href: string
  label: string
  isLogo?: boolean
}

export const MENU_ITEMS: Record<string, readonly MenuItem[]> = {
  COMMON: [
    { href: '/', label: 'Job Board', isLogo: true },
    { href: '/jobs', label: 'Jobs' }
  ],
  EMPLOYER: [
    { href: '/employer', label: 'Dashboard' },
    { href: '/employer/applications', label: 'Applications' },
    { href: '/employer/profile', label: 'Profile' }
  ],
  CANDIDATE: [
    { href: '/candidate/profile', label: 'Profile' }
  ],
  ADMIN: [
    { href: '/admin', label: 'Admin' }
  ]
}

export type UserType = 'employer' | 'candidate' | 'admin' | null