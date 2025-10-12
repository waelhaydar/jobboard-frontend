import React from 'react'
import Link from 'next/link'

interface BreadcrumbsProps {
  pathname: string
  jobSlug?: string | null
}

export default function Breadcrumbs({ pathname, jobSlug }: BreadcrumbsProps) {
  const pathSegments = pathname.split('/').filter(Boolean)
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    ...pathSegments.map((segment, index) => {
      const href = '/' + pathSegments.slice(0, index + 1).join('/')
      let label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')

      // If the segment is '[slug]' and jobSlug is provided, use jobSlug as the label
      if (segment === '[slug]' && jobSlug) {
        label = jobSlug.charAt(0).toUpperCase() + jobSlug.slice(1).replace(/-/g, ' ')
      }

      return { label, href }
    })
  ]

  return (
    <nav className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 items-center gap-2 text-gray-500 dark:text-job-muted pb-2">
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.href}>
          {index > 0 && <span className="text-gray-500 dark:text-job-muted">/</span>}
          {index === breadcrumbs.length - 1 ? (
            <span className="text-gray-700 dark:text-job-text">{crumb.label}</span>
          ) : (
            <Link
              href={crumb.href}
              className="text-gray-500 dark:text-job-muted hover:text-gray-700 dark:hover:text-job-text hover:bg-gray-100 dark:hover:bg-job-background transition-colors px-2 py-1 rounded"
            >
              {crumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}
