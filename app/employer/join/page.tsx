'use client'
import { useState } from 'react'

export default function Join(){

  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e:any){
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const res = await fetch('/api/employer/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName, email, password })
      })
      const data = await res.json()
      if(res.ok) {
        setSuccess('Registration successful')
        // Set token cookie and redirect or reload page to log in user
        document.cookie = `token=${data.token}; path=/; max-age=${7*24*60*60}`
        window.location.href = '/'
      } else setError(data.error || 'Register failed')
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl glass-dark p-6 rounded">
      <h2 className="text-2xl font-bold text-foreground">Join as Employer</h2>
      <form onSubmit={submit} className="mt-4">
        <label className="block text-foreground">Company name<input value={companyName} onChange={e=>setCompanyName(e.target.value)} required className="border border-border bg-background text-foreground p-2 mt-1 w-full rounded"/></label>
        <label className="block mt-2 text-foreground">Email<input value={email} onChange={e=>setEmail(e.target.value)} type="email" required className="border border-border bg-background text-foreground p-2 mt-1 w-full rounded"/></label>
        <label className="block mt-2 text-foreground">Password<input value={password} onChange={e=>setPassword(e.target.value)} type="password" required className="border border-border bg-background text-foreground p-2 mt-1 w-full rounded"/></label>
        {error && <p className="text-destructive mt-2">{error}</p>}
        {success && <p className="text-green-600 mt-2">{success}</p>}
        <button className="secondaryButton-dark mt-3 disabled:opacity-50 transition" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p className="text-sm text-muted-foreground mt-2">An admin will review and approve your employer account.</p>
    </div>
  )
}
