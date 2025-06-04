import type { Metadata } from 'next'
import './globals.css'
import PerformantCursor from './components/Cursor/PerformantCursor'

export const metadata: Metadata = {
  title: 'Nicholas Park — Motion Designer',
  description: 'Motion Designer & Creative Technologist with 5+ years of experience at HBO, Nike, and Universal Music Group.',
  keywords: 'motion design, creative technology, HBO, Nike, Universal Music Group, VFX, animation',
  authors: [{ name: 'Nicholas Park' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="h-full bg-white text-gray-900 font-sans antialiased">
        <PerformantCursor />
        {children}
      </body>
    </html>
  )
}