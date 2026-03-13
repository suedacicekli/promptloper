import type { Metadata } from 'next'
import { Silkscreen } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import FloatingActionButton from '@/components/FloatingActionButton'
import AuthProvider from '@/components/providers/AuthProvider'
import { routing } from '@/i18n/routing'

const silkscreen = Silkscreen({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-pixel',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Promptloper - AI Prompt Sharing Platform',
  description: 'Open-source platform for sharing AI prompts. Browse and copy categorized prompts.',
  icons: {
    icon: '/asset/promptloper.png',
  },
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

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
    <html lang={locale} data-theme="black" className={silkscreen.variable}>
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
