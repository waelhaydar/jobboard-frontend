'use client'

import { useState, useRef } from 'react'


interface Employer {
  id: number
  companyName: string
  email: string
  imageUrl?: string | null
  about?: string | null
}

export default function EmployerProfileClient({ employer, className, showEdit = true, title }: { employer: Employer, className?: string, showEdit?: boolean, title?: string }) {

  const [isEditing, setIsEditing] = useState(false)
  const [companyName, setCompanyName] = useState(employer.companyName)
  const [email, setEmail] = useState(employer.email)
  const [about, setAbout] = useState(employer.about || '')
  const [image, setImage] = useState<File | null>(null)
  const [message, setMessage] = useState('')
  const [currentImageUrl, setCurrentImageUrl] = useState(employer.imageUrl)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('companyName', companyName)
      formData.append('email', email)
      formData.append('about', about)
      if (image) {
        formData.append('image', image)
      }
      const res = await fetch('/api/employer/profile', {
        method: 'PUT',
        body: formData
      })
      if (res.ok) {
        const data = await res.json()
        setCurrentImageUrl(data.employer.imageUrl)
        setMessage('Profile updated successfully.')
        setIsEditing(false)
      } else {
        const data = await res.json()
        setMessage(data.error || 'Failed to update profile.')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage('Network error. Please try again.')
    }
  }

  return (
    <div className="mx-auto max-w-3xl bg-gradient-to-r from-cyan-500/70 to-purple-500/70 border border-cyan-500/30 text-gray-800 p-8 rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-foreground">{title || 'Employer Profile'}</h2>
      {!isEditing ? (
        <>
          <div className="mb-4">
            {currentImageUrl && (
              <>
                <img
                  src={currentImageUrl.includes('loremflickr.com') ? '/default-company-logo.png' : currentImageUrl}
                  alt="Company Logo"
                  className="w-32 h-32 object-cover rounded mb-2"
                  onError={(e) => {
                    e.currentTarget.src = '/default-company-logo.png'; // Replace with your default image path
                  }}
                />
              </>
            )}
            {!currentImageUrl && (
              <p className="mb-4 text-muted-foreground">No logo uploaded</p>
            )}
            <div>
              <label className="block font-semibold mb-1 text-foreground" htmlFor="companyName">Company Name</label>
              <div className="border border-border p-2 rounded bg-card text-foreground">{companyName}</div>
            </div>
            <div>
              <label className="block font-semibold mb-1 text-foreground" htmlFor="email">Email</label>
              <div className="border border-border p-2 rounded bg-card text-foreground">{email}</div>
            </div>
            <div>
              <label className="block font-semibold mb-1 text-foreground" htmlFor="about">About</label>
              <div className="border border-border p-2 rounded bg-card text-foreground">{about || 'No description provided'}</div>
            </div>
          </div>
          {showEdit && <button onClick={() => setIsEditing(true)} className="secondaryButton-dark">Edit Profile</button>}
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1 text-foreground">Company Logo</label>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={e => setImage(e.target.files?.[0] || null)}
              className="hidden"
              id="imageInput"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="secondaryButton-dark"
            >
              Change Photo
            </button>
            {image && <p className="text-sm text-muted-foreground mb-2">Selected: {image.name}</p>}
            {currentImageUrl && (
              <img
                src={currentImageUrl.includes('loremflickr.com') ? '/default-company-logo.png' : currentImageUrl}
                alt="Current Logo"
                className="w-16 h-16 object-cover rounded mt-2"
                onError={(e) => {
                  e.currentTarget.src = '/default-company-logo.png'; // Replace with your default image path
                }}
              />
            )}
            </div>
          <div>
            <label className="block font-semibold mb-1 text-foreground" htmlFor="companyName">Company Name</label>
            <input id="companyName" type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} required className="w-full border border-border p-2 rounded bg-card text-foreground" />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-foreground" htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border border-border p-2 rounded bg-card text-foreground" />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-foreground" htmlFor="about">About</label>
            <textarea id="about" value={about} onChange={e => setAbout(e.target.value)} className="w-full border border-border p-2 rounded bg-card text-foreground" rows={4} />
          </div>
          <div className="flex space-x-2">
            <button type="submit" className="secondaryButton-dark">Save Changes</button>
            <button type="button" onClick={() => setIsEditing(false)} className="secondaryButton-dark">Cancel</button>
          </div>
        </form>
      )}
      {message && <p className="mt-2 text-sm text-muted-foreground">{message}</p>}


    </div>
  )
}
