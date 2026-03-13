'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { routing } from '@/i18n/routing'

type Locale = (typeof routing.locales)[number]
import styles from './LanguageSwitcher.module.css'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (newLocale: Locale) => {
    // Remove current locale from pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, '')
    // Add new locale
    const newPath = `/${newLocale}${pathWithoutLocale || ''}`
    router.push(newPath)
  }

  return (
    <div className={styles.container}>
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={`${styles.langBtn} ${locale === loc ? styles.active : ''}`}
          aria-label={`Switch to ${loc.toUpperCase()}`}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
