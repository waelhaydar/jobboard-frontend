'use client'
import { useState } from 'react'
import SignInSignUpModal from '../../../components/SignInSignUpModal'

export default function Login() {
  const [isModalOpen, setIsModalOpen] = useState(true)

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <div className="max-w-md mx-auto bg-job-card-background-bg p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Log in</h2>
      {/* The button to open the modal is no longer needed if the modal is open by default */}
    <button
        onClick={openModal}
        className="w-full bg-job-primary-bg text-white px-4 py-2 rounded-md hover:bg-job-primary-hover-bg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Open Login Modal
      </button> 
      {isModalOpen && <SignInSignUpModal isSignedIn={false} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />}
    </div>
  )
}
