'use client'

import Link from 'next/link'

interface AdminSidebarProps {
  currentPath?: string
}

export default function AdminSidebar({ currentPath = '/admin' }: AdminSidebarProps) {
  const navItems = [
    { href: '/admin', label: 'Overview', icon: '📊' },
    { href: '/admin/candidates', label: 'Candidates', icon: '👥' },
    { href: '/admin/jobs', label: 'Job Posts', icon: '💼' },
    { href: '/admin/employers', label: 'Employers', icon: '🏢' },
    { href: '/admin/database', label: 'Database', icon: '🗃️' },
    { href: '/admin/news', label: 'News', icon: '📰' },
  ]

  return (
    <aside className="w-64 min-h-screen p-4 space-y-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Admin Dashboard
        </h2>
        <p className="text-gray-400 text-sm mt-1">Manage your platform</p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300 group ${
              currentPath === item.href
                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-400'
                : 'text-gray-300 hover:bg-white/5 hover:text-white border border-transparent'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
            {currentPath === item.href && (
              <div className="w-2 h-2 bg-cyan-400 rounded-full ml-auto animate-pulse" />
            )}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
