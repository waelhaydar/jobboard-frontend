'use client'

import { useState } from 'react'
import Link from 'next/link'
import JoinEmployerModal from '../components/JoinEmployerModal'
import { Briefcase, Building2, Users, ArrowRight, Sparkles } from 'lucide-react'
import dynamic from 'next/dynamic'
import NewsBanner from 'components/NewsBanner'

const JobCard = dynamic(() => import('../components/JobCard'), {
  loading: () => (
    <div className="glass-dark rounded-full p-6 h-48 animate-pulse">
      <div className="bg-gray-300 dark:bg-gray-700 rounded h-4 w-3/4 mb-4"></div>
      <div className="bg-gray-200 dark:bg-gray-600 rounded h-3 w-1/2 mb-2"></div>
      <div className="bg-gray-200 dark:bg-gray-600 rounded h-3 w-2/3"></div>
    </div>
  )
})

interface HomeClientProps {
  jobs: any[]
  totalJobs: number
  totalEmployers: number
  totalCandidates: number
  isEmployer: boolean
  isSignedIn: boolean
}

export default function HomeClient({
  jobs = [],
  totalJobs = 0,
  totalEmployers = 0,
  totalCandidates = 0,
  isEmployer = false,
  isSignedIn = false
}: HomeClientProps) {
  const [isJoinEmployerModalOpen, setIsJoinEmployerModalOpen] = useState(false)

  return (
    <div className="min-h-dvh relative">
      <NewsBanner />
      {/* Hero Section */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="glass-dark p-8 md:p-12 lg:p-16 mx-auto max-w-7xl backdrop-blur-xl">
              {/* Animated Badge */}
              <div className={`inline-flex items-center bg-black/20 gap-2 rounded-full px-4 py-2 mb-8 animate-float`}>
                <Sparkles className={`w-4 h-4`} />
                <span className={`text-sm font-medium`}>Trusted by {totalEmployers.toLocaleString()}+ companies</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight tracking-tight">
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent bg-size-200">
                  Find Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent bg-size-200">
                  Dream Job
                </span>
              </h1>
              
              <p className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed`}>
                Discover opportunities from <span className={`font-semibold`}>verified employers</span> — 
                local-first, private hiring with modern technology.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
 <Link href="/jobs" className="primaryButton" prefetch={true}>
  <span>
    Explore Jobs
    <ArrowRight className="w-4 h-4" />
  </span>
</Link>

          
              </div>
              
              {/* Quick Stats */}
              <div className={`flex flex-wrap justify-center items-center gap-6 text-sm`}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span>{totalJobs.toLocaleString()} Active Jobs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse animation-delay-500"></div>
                  <span>{totalEmployers.toLocaleString()} Companies</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse animation-delay-1000"></div>
                  <span>{totalCandidates.toLocaleString()} Candidates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <StatCard
              icon={Briefcase}
              value={totalJobs}
              label="Active Jobs"
              color="cyan"
              delay="delay-0"
              theme='dark'
            />
            <StatCard
              icon={Building2}
              value={totalEmployers}
              label="Verified Employers"
              color="purple"
              delay="delay-200"
              theme='dark'
            />
            <StatCard
              icon={Users}
              value={totalCandidates}
              label="Active Candidates"
              color="pink"
              delay="delay-400"
              theme='dark'
            />
          </div>
        </div>
      </section>

      {/* Employer CTA Section */}
        <section className="py-6 md:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass-dark p-8 md:p-12 text-center max-w-4xl mx-auto">
              <h2 className={`text-3xl md:text-4xl font-bold mb-4`}>
                Ready to <span className="bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">Hire Talent</span>?
              </h2>
              <p className={`text-lg mb-8 max-w-2xl mx-auto`}>
                Join thousands of employers finding their perfect candidates. Post jobs, manage applications, and grow your team with our modern platform.
              </p>
              <button
                onClick={() => setIsJoinEmployerModalOpen(true)}
                className="secondaryButton-dark"
              >
                <span>Join as Employer</span>
              </button>
              {isJoinEmployerModalOpen && <JoinEmployerModal isOpen={isJoinEmployerModalOpen} setIsOpen={setIsJoinEmployerModalOpen} />}
            </div>
          </div>
        </section>


      {/* Latest Jobs Section */}
      <section className="py-6 md:py-8">




        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-dark rounded-3xl p-8 md:p-12 backdrop-blur-xl">
            <div className="text-center mb-12">
              <h2 className={`text-3xl md:text-4xl font-bold mb-4`}>
                Latest <span className="bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">Job Opportunities</span>
              </h2>
              <p className={`text-lg`}>Fresh opportunities added daily by top companies</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {jobs.map((job, index) => (
                <div 
                  key={job.id} 
                  className={`transition-all duration-300 hover:scale-105 animate-fadeInUp ${index === 0 ? 'animation-delay-100ms' : index === 1 ? 'animation-delay-200ms' : index === 2 ? 'animation-delay-300ms' : 'animation-delay-400ms'}`}
                >
                  <JobCard job={job} />
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 items-center">
  <Link href="/jobs" className="primaryButton" prefetch={true}>
  <span>
    View all Jobs
    <ArrowRight className="w-4 h-4" />
  </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Stat Card Component
function StatCard({
  icon: Icon,
  value,
  label,
  color = 'cyan',
  delay = 'delay-0',
  theme = 'dark'
}: {
  icon: React.ComponentType<any>
  value: number
  label: string
  color: 'cyan' | 'purple' | 'pink'
  delay?: string
  theme?: string
}) {


  const colorClasses = {
    cyan: {
      light: 'from-cyan-500 to-cyan-600 border-cyan-200 text-cyan-600',
      dark: 'from-cyan-500 to-cyan-600 border-cyan-500/20 text-cyan-400'
    },
    purple: {
      light: 'from-purple-500 to-purple-600 border-purple-200 text-purple-600',
      dark: 'from-purple-500 to-purple-600 border-purple-500/20 text-purple-400'
    },
    pink: {
      light: 'from-pink-500 to-pink-600 border-pink-200 text-pink-600',
      dark: 'from-pink-500 to-pink-600 border-pink-500/20 text-pink-400'
    }
  }

  const currentColorClass = theme === 'light' ? colorClasses[color].light : colorClasses[color].dark

  return (
    <div className={`group relative glass-dark rounded-3xl p-8 text-center transition-all duration-300 hover:scale-105 animate-fadeInUp ${delay}`}>
      <div className="relative z-10">
        <div className={`w-16 h-16 bg-gradient-to-br rounded-full flex items-center justify-center mx-auto mb-4 ${currentColorClass.split(' ')[0]} ${currentColorClass.split(' ')[1]}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className={`text-5xl font-bold mb-2 ${currentColorClass.split(' ')[2]}`}>
          {value.toLocaleString()}+
        </h3>
        <p className={`text-lg font-medium`}>{label}</p>
      </div>
    </div>
  )
}
