import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export default function LoadingSpinner({ size = 'md', text, className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-job-primary`} />
      {text && <span className="text-job-text-muted">{text}</span>}
    </div>
  )
}

export function LoadingCard({ className = '' }: { className?: string }) {
  return (
    <div className={`text-white bg-job-card-background border border-job-card-border rounded-xl p-6 animate-pulse ${className}`}>
      <div className="space-y-4">
        <div className="h-6 bg-job-card-border-bg rounded w-3/4"></div>
        <div className="h-4 bg-job-border-bg rounded w-1/2"></div>
        <div className="h-4 bg-job-border-bg rounded w-2/3"></div>
        <div className="h-4 bg-job-border-bg rounded w-1/3"></div>
      </div>
    </div>
  )
}

export function LoadingGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <LoadingCard key={index} />
      ))}
    </div>
  )
}
