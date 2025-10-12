import React from 'react'

interface PendingRegistrationHeaderProps {
  onLogout: () => void
  isLoggingOut?: boolean
}

export const PendingRegistrationHeader: React.FC<PendingRegistrationHeaderProps> = ({
  onLogout,
  isLoggingOut = false
}) => {
  return (
    <header className="relative top-0 left-0 right-0 transition-all duration-500 p-4 md:p-6 flex justify-between items-center px-4 sm:px-6 lg:px-8 z-50">
      <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        Job Board
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-base font-medium px-3 py-1 rounded-full backdrop-blur-sm dark:bg-job-status-pending-background">
          Complete Registration Required
        </span>
        <button
          onClick={onLogout}
          disabled={isLoggingOut}
          className="text-lg bg-red-500 text-white px-6 py-2.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </header>
  )
}
