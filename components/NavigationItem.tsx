import React from 'react'
import LinkGuard from './LinkGuard'

interface NavigationItemProps {
  href: string
  label: string
  isLogo?: boolean
  onAccessDenied: () => void
}

export const NavigationItem: React.FC<NavigationItemProps> = ({
  href,
  label,
  isLogo = false,
  onAccessDenied
}) => (
  <LinkGuard 
    href={href} 
    onAccessDenied={onAccessDenied}
    className={`
      transition-colors cursor-pointer
      ${isLogo 
        ? 'text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300' 
        : 'text-foreground text-lg hover:text-foreground/80'
      }
    `}
  >
    {label}
  </LinkGuard>
)