'use client'
import { useEffect, useState, useRef } from 'react'
import { Bell, BellRing } from 'lucide-react'

interface Notification {
  id: number;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  employerId: number | null;
  admin: boolean;
  jobId: string | null;
  Job?: { title: string }; // Add Job property
}

export default function NotificationPoller(){
  const [count, setCount] = useState(0)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(()=>{
    let mounted = true
    async function askPermission(){
      if('Notification' in window && Notification.permission === 'default'){
        try{ await Notification.requestPermission() }catch(e){}
      }
    }
    askPermission()
    async function poll(){
      try{
        const res = await fetch('/api/notifications/poll')
        if(!res.ok) return
        const j = await res.json()
        const notes = j.notifications || []
        if(notes.length && mounted){
          setCount(c=>c+notes.length)
          setNotifications(prev => [...notes, ...prev])
          for(const n of notes){
            if('Notification' in window && Notification.permission === 'granted'){
              try{ new Notification(n.title, { body: n.body }) }catch(e){}
            }
          }
        }
      }catch(e){}
    }
    poll()
    const id = setInterval(poll, 5000)
    return ()=>{ mounted=false; clearInterval(id) }
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleBellClick = async () => {
    setIsDropdownOpen(!isDropdownOpen)
    if (!isDropdownOpen) {
      // Mark notifications as read when opening dropdown
      try {
        await fetch('/api/notifications/mark-read', { method: 'POST' })
        setCount(0) // Reset count when opening dropdown
      } catch (error) {
        console.error('Failed to mark notifications as read:', error)
      }
    }
  }

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={handleBellClick}
        aria-haspopup="true"
        aria-expanded={isDropdownOpen}
        aria-label="Notifications"
        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
      >
        {count > 0 ? (
          <BellRing className="w-6 h-6" />
        ) : (
          <Bell className="w-6 h-6" />
        )}
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-job-button-primary-gradient text-job-button-text text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse-glow">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>

      {isDropdownOpen && (
        <div
          role="menu"
          aria-label="Notifications"
          className="text-white absolute right-0 mt-2 w-80 bg-job-card-background rounded-lg shadow-job-card border border-job-card-border z-50 max-h-96 overflow-y-auto animate-fadeInRight"
        >
          <div className="p-4 border-b border-job-card-border">
            <h3 className="text-lg font-semibold text-job-text-primary">Notifications</h3>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-job-text-muted">
                No notifications
              </div>
            ) : (
              notifications.map((notification, index) => (
                <div
                  key={index}
                  role="menuitem"
                  tabIndex={0}
                  className="p-4 border-b border-job-card-border-light-border hover:bg-job-fill-hover transition-colors focus:bg-job-fill-hover focus:outline-none"
                >
                  <div className="font-semibold text-job-text-primary">{notification.title}</div>
                  <div className="text-sm text-job-text-muted mt-1">{notification.body}</div>
                  <div className="text-xs text-job-text-muted-light-text mt-2">
                    {new Date(notification.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
          {notifications.length > 0 && (
            <div className="p-3 border-t border-job-card-border">
              <a
                href="/mailbox"
                className="text-sm text-job-primary-text hover:text-job-primary-text-hover transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                View all notifications →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
