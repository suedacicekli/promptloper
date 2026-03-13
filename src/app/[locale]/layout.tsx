import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import FloatingActionButton from '@/components/FloatingActionButton'
import AuthProvider from '@/components/providers/AuthProvider'
import { routing } from '@/i18n/routing'

export const metadata: Metadata = {
  title: 'Promptloper - AI Prompt Sharing Platform',
  description: 'Open-source platform for sharing AI prompts. Browse and copy categorized prompts.',
  icons: {
    icon: '/asset/promptloper.png',
  },
}

export const runtime = 'edge'

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Validate locale
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  // Get messages for the current locale
  const messages = await getMessages()

  return (
    <html lang={locale} data-theme="black">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-black min-h-screen">
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            {children}
            <FloatingActionButton />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
