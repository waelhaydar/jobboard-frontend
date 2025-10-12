'use client'

import { useState, useMemo } from 'react'
import JobCard from './JobCard'
import { Search, Filter, X, MapPin, Briefcase, DollarSign, Clock, ArrowDown } from 'lucide-react'

interface Job {
  id: string
  slug: string
  title: string
  location?: string
  jobType?: string
  experience?: string
  basicMonthlySalaryUSD?: number
  employer?: {
    companyName: string
  }
  createdAt?: Date | string
}

interface JobSearchProps {
  jobs: Job[]
}

export default function JobSearch({ jobs }: JobSearchProps) {
  const [query, setQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedJobType, setSelectedJobType] = useState('')
  const [selectedExperience, setSelectedExperience] = useState('')
  const [salaryRange, setSalaryRange] = useState([0, 10000])
  const [sortBy, setSortBy] = useState('newest')



  // Get unique values for filters
  const locations = useMemo(() => [...new Set(jobs.map(job => job.location).filter(Boolean))], [jobs])
  const jobTypes = useMemo(() => [...new Set(jobs.map(job => job.jobType).filter(Boolean))], [jobs])
  const experiences = useMemo(() => [...new Set(jobs.map(job => job.experience).filter(Boolean))], [jobs])

  const filteredAndSortedJobs = useMemo(() => {
    let filtered = jobs.filter(job => {
      const matchesQuery = query === '' ||
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        (job.location && job.location.toLowerCase().includes(query.toLowerCase())) ||
        (job.employer?.companyName && job.employer.companyName.toLowerCase().includes(query.toLowerCase()))

      const matchesLocation = selectedLocation === '' || job.location === selectedLocation
      const matchesJobType = selectedJobType === '' || job.jobType === selectedJobType
      const matchesExperience = selectedExperience === '' || job.experience === selectedExperience
      const matchesSalary = !job.basicMonthlySalaryUSD ||
        (job.basicMonthlySalaryUSD >= salaryRange[0] && job.basicMonthlySalaryUSD <= salaryRange[1])

      return matchesQuery && matchesLocation && matchesJobType && matchesExperience && matchesSalary
    })

    // Sort jobs
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        case 'oldest':
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
        case 'salary-high':
          return (b.basicMonthlySalaryUSD || 0) - (a.basicMonthlySalaryUSD || 0)
        case 'salary-low':
          return (a.basicMonthlySalaryUSD || 0) - (b.basicMonthlySalaryUSD || 0)
        case 'title':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    return filtered
  }, [jobs, query, selectedLocation, selectedJobType, selectedExperience, salaryRange, sortBy])

  const clearFilters = () => {
    setSelectedLocation('')
    setSelectedJobType('')
    setSelectedExperience('')
    setSalaryRange([0, 10000])
    setQuery('')
  }

  return (
    <div className="space-y-6">
      {/* Search Bar with Filter Toggle and Sort */}
      <div className="relative max-w-7xl mx-auto">
        <div className="relative glass-dark p-2 flex flex-col sm:flex-row gap-2 items-end">
          <div className="relative flex-1 w-full sm:w-auto">
            <Search className={`absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ${query ? 'animate-pulse text-cyan-500' : 'text-gray-500 dark:text-job-text-muted'}`} />
            <input
              type="text"
              placeholder="Search jobs by title, location, or company..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="job-search-input w-full pl-12 pr-4 py-4 text-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-transparent border-0 text-job-text-primary dark:text-job-text-primary placeholder-job-text-muted dark:placeholder-job-text-muted transition-all duration-300"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="secondaryButton-dark p-4 flex items-center justify-center flex-shrink-0"
              title={showFilters ? 'Hide Filters' : 'Show Filters'}
            ><span>
              <Filter className="w-5 h-5" />
              Filter</span>
            </button>
            <div className="relative flex-shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="secondaryButton-dark p-4 flex items-center justify-center flex-shrink-0 appearance-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="salary-high">Salary: High to Low</option>
                <option value="salary-low">Salary: Low to High</option>
                <option value="title">Job Title A-Z</option>
              </select>
            
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="text-gray-900 dark:text-white glass-dark rounded-xl p-6 animate-slideInUp">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Location Filter */}
            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-job-text-primary mb-2 flex items-center gap-2 hover-neon">
                <MapPin className="w-4 h-4 text-cyan-600 dark:text-job-secondary" />
                Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="enhanced-select w-full px-3 py-2 text-gray-900 dark:text-job-text-primary bg-job-card-background border-job-card-border focus:ring-job-primary-ring"
              >
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            {/* Job Type Filter */}
            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-job-text-primary mb-2 flex items-center gap-2 hover-neon">
                <Briefcase className="w-4 h-4 text-purple-600 dark:text-job-secondary" />
                Job Type
              </label>
              <select
                value={selectedJobType}
                onChange={(e) => setSelectedJobType(e.target.value)}
                className="enhanced-select w-full px-3 py-2 text-gray-900 dark:text-job-text-primary bg-job-card-background border-job-card-border focus:ring-job-primary-ring"
              >
                <option value="">All Types</option>
                {jobTypes.map(type => (
                  <option key={type} value={type}>{type?.replace('_', ' ')}</option>
                ))}
              </select>
            </div>

            {/* Experience Filter */}
            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-job-text-primary mb-2 flex items-center gap-2 hover-neon">
                <Clock className="w-4 h-4 text-pink-600 dark:text-job-secondary" />
                Experience
              </label>
              <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="enhanced-select w-full px-3 py-2 text-gray-900 dark:text-job-text-primary bg-job-card-background border-job-card-border focus:ring-job-primary-ring"
              >
                <option value="">Any Experience</option>
                {experiences.map(exp => (
                  <option key={exp} value={exp}>{exp}</option>
                ))}
              </select>
            </div>

            {/* Salary Range Filter */}
            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-job-text-primary mb-2 flex items-center gap-2 hover-neon">
                <DollarSign className="w-4 h-4 text-green-600 dark:text-job-secondary" />
                Max Salary: ${salaryRange[1].toLocaleString()}
              </label>
              <input
                type="range"
                min="0"
                max="10000"
                value={salaryRange[1]}
                onChange={(e) => setSalaryRange([0, parseInt(e.target.value)])}
                className="w-full h-2 bg-gray-300 dark:bg-job-card-border-bg rounded-lg appearance-none cursor-pointer slider-thumb-custom"
              />
            </div>
          </div>

          <div className="flex justify-end mt-4">
          <button
            onClick={clearFilters}
            className="secondaryButton-dark"
          >
            Clear Filters
          </button>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="text-center text-job-text-muted dark:text-job-text-muted">
        Showing {filteredAndSortedJobs.length} of {jobs.length} jobs
      </div>

      {/* Job Grid */}
  <section className="glass-dark p-6 md:p-8 rounded-2xl shadow-2xl backdrop-blur-md">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {filteredAndSortedJobs.map((job, index) => (
      <div
        key={job.id}
        className={`transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fadeInUp ${index === 0 ? 'animation-delay-100ms' : index === 1 ? 'animation-delay-200ms' : index === 2 ? 'animation-delay-300ms' : index === 3 ? 'animation-delay-400ms' : index === 4 ? 'animation-delay-500ms' : index === 5 ? 'animation-delay-600ms' : 'animation-delay-700ms'}`}
      >
        <JobCard job={job} />
      </div>
    ))}
  </div>
</section>

      {/* No Results */}
      {filteredAndSortedJobs.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4 animate-spin">🔍</div>
          <h3 className="text-xl font-semibold text-gradient mb-2">No jobs found</h3>
          <p className="text-job-text-muted dark:text-job-text-muted mb-4">Try adjusting your search criteria or filters</p>
          <button
            onClick={clearFilters}
            className="secondaryButton-dark"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  )
}
