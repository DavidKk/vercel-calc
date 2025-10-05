import './globals.css'

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import { headers } from 'next/headers'

import { NotificationProvider } from '@/components/Notification/useNotification'
import { LanguageProvider } from '@/contexts/language'

import Footer from './Footer'
import { Nav } from './Nav'

export const metadata: Metadata = {
  title: 'Open APIs',
  description:
    'This service collects and caches commonly used public OPENAPIs to facilitate developer access. It provides caching and forwarding services for commonly used public APIs, making it easier for developers to quickly access them.',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout(props: Readonly<RootLayoutProps>) {
  const { children } = props
  const hmap = await headers()
  const language = hmap.get('accept-language') || 'en'

  return (
    <html lang="en">
      <Analytics />
      <SpeedInsights />

      <body className="antialiased min-h-screen flex flex-col">
        <NotificationProvider>
          <LanguageProvider serverLanguage={language}>
            <Nav />
            {children}
            <Footer />
          </LanguageProvider>
        </NotificationProvider>
      </body>
    </html>
  )
}
