// app/layout.tsx
import './globals.css'
import { ReactNode, Suspense } from 'react'
import Header from '../components/Header'
import { AuthModalProvider } from '../components/AuthModalContext'
import { PreloaderProvider } from '../components/PreloaderContext'
import { ApplicationFormProvider } from '../components/ApplicationFormContext'
import GlobalPreloader from '../components/GlobalPreloader'
import Preloader from '../components/Preloader'
import dynamic from 'next/dynamic'
import { getEntityFromToken } from '../lib/auth'
import { cookies } from 'next/headers'
import type { Metadata, Viewport } from 'next'
import Footer from '../components/Footer'
import WireGlowWaves from '../components/WireGlowWaves'

// Lazy load client-side components
const BrowserCloseHandler = dynamic(
  () => import('../components/BrowserCloseHandler'),
  { 
    ssr: false,
    loading: () => null
  }
)

// --- Metadata ---
export const metadata: Metadata = {
  title: {
    default: 'JobBoard - Find Your Dream Job',
    template: '%s | JobBoard'
  },
  description: 'Discover opportunities from verified employers — local-first, private hiring.',
  icons: { 
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.png'
  },
  manifest: '/manifest.json',
  keywords: ['jobs', 'careers', 'hiring', 'employment'],
  authors: [{ name: 'JobBoard' }],
  creator: 'JobBoard',
  publisher: 'JobBoard',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#06b6d4',
}

// --- Root Layout ---
export default async function RootLayout({ children }: { children: ReactNode }) {
  const token = cookies().get('token')?.value
  const entity = await getEntityFromToken(token)
  const isSignedIn = !!entity
  const userType = entity?.type ?? null
  const employerApproved = userType === 'employer' ? (entity as any)?.employer?.approved ?? null : null
  const isPending = userType === 'candidate_pending'

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <PreloaderProvider>
          <AuthModalProvider isSignedIn={isSignedIn}>
            <ApplicationFormProvider>


              {/* Main Layout Structure */}
              <div className="prismatic-container min-h-dvh">
                {/* Background Elements */}
                <div className="prismatic-aurora" aria-hidden="true" />
                <div className="fixed-background" aria-hidden="true" />
                <div className="fixed-overlay" aria-hidden="true" />

                {/* Bottom Waves */}
                <WireGlowWaves />

                {/* Main Content */}
                <div className="main-content relative z-1">
                  <Header
                    isSignedIn={isSignedIn}
                    userType={userType}
                    employerApproved={employerApproved}
                    isPending={isPending}

                  />

                  <main id="main-content" className="min-h-[80dvh]">
                    <Suspense fallback={
                      <div className="flex items-center justify-center min-h-[400px]">
                        <Preloader isLoading={true} size="lg" text="Loading content..." />
                      </div>
                    }>
                      {children}
                    </Suspense>
                  </main>

                  <Footer />
                </div>
              </div>
            </ApplicationFormProvider>
          </AuthModalProvider>

          {/* Global Components */}
          <GlobalPreloader />

          {/* Client-side Handler */}
          <Suspense fallback={null}>
            <BrowserCloseHandler isSignedIn={isSignedIn} />
          </Suspense>
        </PreloaderProvider>
      </body>
    </html>
  )
}