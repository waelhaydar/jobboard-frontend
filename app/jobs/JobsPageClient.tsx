// app/jobs/JobsPageClient.tsx
'use client'

import JobSearch from '../../components/JobSearch'
import { Briefcase, Users, TrendingUp, Shield } from 'lucide-react'

interface JobsPageClientProps {
  jobs: any[]
  stats: Array<{
    icon: string
    label: string
    value: string | number
  }>
}

const iconMap = {
  Briefcase,
  Users,
  TrendingUp,
  Shield
}

export default function JobsPageClient({ jobs, stats }: JobsPageClientProps) {

  // Map icon names to colors for features
  const featureIconMap = [
    { icon: 'Briefcase', color: 'cyan' },
    { icon: 'Users', color: 'purple' },
    { icon: 'Shield', color: 'pink' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 border-job-card-border">
        <div className="absolute inset-0 dark:bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight tracking-tight">
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent bg-size-200">
                  Find Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent bg-size-200">
                  Dream Job
                </span>
              </h1>
            <p className="text-xl md:text-2xl text-job-text-muted max-w-3xl mx-auto mb-8 leading-relaxed">
              Discover thousands of job opportunities from verified employers.
              Your next career move starts here.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {stats.map((stat, index) => {
              const IconComponent = iconMap[stat.icon as keyof typeof iconMap]
              return (
                <div key={index} className={`text-job-text-primary bg-job-card-background/80 backdrop-blur-sm rounded-xl p-6 border border-job-card-border animate-slide-up ${index === 0 ? 'animation-delay-0_1s' : index === 1 ? 'animation-delay-0_2s' : index === 2 ? 'animation-delay-0_3s' : 'animation-delay-0_4s'}`}>
                  <IconComponent className="w-8 h-8 text-job-stat-icon mx-auto mb-3" />
                  <div className="text-2xl font-bold text-job-text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-job-text-muted">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <JobSearch jobs={jobs} />
      </div>

      {/* Features Section */}
      <section className="job-section-background py-16 px-4 sm:px-6 lg:px-8 border-job-card-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-job-text-primary mb-4">Why Choose Our Platform?</h2>
            <p className="text-lg text-job-text-muted max-w-2xl mx-auto">
              We connect talented individuals with leading companies, ensuring the best opportunities for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featureIconMap.map((feature, index) => {
              const IconComponent = iconMap[feature.icon as keyof typeof iconMap]
              const color = feature.color as 'cyan' | 'purple' | 'pink'
              const titles = ['Curated Opportunities', 'Expert Matching', 'Secure & Private']
              const descriptions = [
                'Only the best job openings from verified employers make it to our platform.',
                'Our smart algorithms match you with jobs that fit your skills and preferences.',
                'Your personal information is protected with enterprise-grade security.'
              ]

              return (
                <div key={index} className="text-center p-6 rounded-xl feature-card-background hover:shadow-lg transition-shadow border feature-card-border border-job-card-border">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${color === 'cyan' ? 'feature-icon-cyan-bg' : color === 'purple' ? 'feature-icon-purple-bg' : 'feature-icon-pink-bg'}`}>
                    <IconComponent className={`w-8 h-8 ${color === 'cyan' ? 'feature-icon-cyan-text' : color === 'purple' ? 'feature-icon-purple-text' : 'feature-icon-pink-text'}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-job-text-primary mb-3">{titles[index]}</h3>
                  <p className="text-job-text-muted">{descriptions[index]}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}