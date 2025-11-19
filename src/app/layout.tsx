import type { Metadata } from 'next'
import './globals.css'
import FloatingActionButton from '@/components/FloatingActionButton'

export const metadata: Metadata = {
  title: 'Promptloper - AI Prompt Sharing Platform',
  description: 'Open-source platform for sharing AI prompts. Browse and copy categorized prompts.',
  icons: {
    icon: '/asset/promptloper.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="black">
      <body className="bg-black min-h-screen">
        {children}
        <FloatingActionButton />
      </body>
    </html>
  )
}
