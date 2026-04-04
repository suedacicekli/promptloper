'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import LanguageSwitcher from '../LanguageSwitcher'
import { useAuth } from '../providers/AuthProvider'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const t = useTranslations('navbar')
  const tAuth = useTranslations('auth')
  const locale = useLocale()
  const { user, profile, loading, signOut } = useAuth()

  // Kullanicinin gorunecek adi
  const displayName = profile?.name || user?.email?.split('@')[0] || ''

  // Avatar: profil resmi varsa onu goster, yoksa ismin bas harfi
  const avatarUrl = profile?.avatar_url
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.container}>
          {/* Logo */}
          <Link href={`/${locale}`} className={styles.logoContainer}>
            <Image
              src="/asset/promptloper.png"
              alt={t('logoText')}
              width={36}
              height={36}
              priority
              className={styles.logo}
            />
            <span className={styles.logoText}>{t('logoText')}</span>
          </Link>

          {/* Desktop Menu - Center */}
          <div className={styles.menuContainer}>
            <Link href={`/${locale}`} className={styles.menuItem}>
              {t('explore')}
            </Link>
            <a href="#trending" className={styles.menuItem}>
              {t('trending')}
            </a>
            <Link href={`/${locale}/contribute`} className={styles.menuItem}>
              {t('community')}
            </Link>
          </div>

          {/* Right Actions */}
          <div className={styles.actionsContainer}>
            {/* GitHub */}
            <a
              href="https://github.com/suedacicekli/promptloper"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.iconBtn}
              aria-label="GitHub"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>

            <LanguageSwitcher />

            <div className={styles.divider} />

            {loading ? (
              // Yukleniyor — kullanici butonu boyutunda placeholder
              <div className={styles.profilePlaceholder}>
                <div className={styles.avatarPlaceholder} />
                <div className={styles.namePlaceholder} />
              </div>
            ) : user ? (
              // Giris yapmis kullanici
              <div className={styles.profileContainer}>
                <button
                  className={styles.profileBtn}
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                >
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={displayName}
                      width={32}
                      height={32}
                      className={styles.avatar}
                    />
                  ) : (
                    <div className={styles.avatarFallback}>{initial}</div>
                  )}
                  <span className={styles.profileName}>{displayName}</span>
                </button>

                {/* Profil Dropdown */}
                {isProfileMenuOpen && (
                  <div className={styles.profileDropdown}>
                    <div className={styles.profileDropdownHeader}>
                      <span className={styles.profileDropdownEmail}>{user.email}</span>
                    </div>
                    <Link
                      href={`/${locale}/profile`}
                      className={styles.profileDropdownItem}
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      {t('profile')}
                    </Link>
                    <button
                      className={styles.profileDropdownItem}
                      onClick={async () => {
                        await signOut()
                        setIsProfileMenuOpen(false)
                      }}
                    >
                      {tAuth('signOut')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Giris yapmamis kullanici
              <Link href={`/${locale}/login`} className={styles.loginBtn}>
                {t('login')}
              </Link>
            )}

            {/* CTA - Add Prompt */}
            <Link href={`/${locale}/prompts/new`} className={styles.ctaBtn}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              {t('addPrompt')}
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={styles.mobileMenuBtn}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            <svg
              className={styles.menuIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={styles.mobileMenu}>
            <div className={styles.mobileMenuNav}>
              <Link href={`/${locale}`} className={styles.mobileMenuItem} onClick={() => setIsMenuOpen(false)}>
                {t('explore')}
              </Link>
              <a href="#trending" className={styles.mobileMenuItem} onClick={() => setIsMenuOpen(false)}>
                {t('trending')}
              </a>
              <Link href={`/${locale}/contribute`} className={styles.mobileMenuItem} onClick={() => setIsMenuOpen(false)}>
                {t('community')}
              </Link>
            </div>

            <div className={styles.mobileActions}>
              <div className={styles.mobileActionsRow}>
                {user ? (
                  <>
                    <Link
                      href={`/${locale}/profile`}
                      className={styles.mobileLoginBtn}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('profile')}
                    </Link>
                    <button
                      className={styles.mobileLoginBtn}
                      onClick={async () => {
                        await signOut()
                        setIsMenuOpen(false)
                      }}
                    >
                      {tAuth('signOut')}
                    </button>
                  </>
                ) : (
                  <Link
                    href={`/${locale}/login`}
                    className={styles.mobileLoginBtn}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('login')}
                  </Link>
                )}
                <Link
                  href={`/${locale}/prompts/new`}
                  className={styles.mobileCtaBtn}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  {t('addPrompt')}
                </Link>
              </div>

              <div className={styles.mobileBottomRow}>
                <a
                  href="https://github.com/suedacicekli/promptloper"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mobileGithub}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
