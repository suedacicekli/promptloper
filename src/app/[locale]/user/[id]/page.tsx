'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { createClient } from '@/lib/supabase/client'
import type { Profile, Prompt } from '@/types/database'
import styles from './user.module.css'

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>()
  const locale = useLocale()
  const t = useTranslations('profile')
  const [profile, setProfile] = useState<Profile | null>(null)
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return

    async function fetchUser() {
      const supabase = createClient()

      const profileRes = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

      if (!profileRes.data || profileRes.error) {
        setNotFound(true)
        setLoading(false)
        return
      }

      const promptsRes = await supabase
        .from('prompts')
        .select('*')
        .eq('user_id', id)
        .eq('is_public', true)
        .order('created_at', { ascending: false })

      setProfile(profileRes.data)
      setPrompts(promptsRes.data || [])
      setLoading(false)
    }

    fetchUser()
  }, [id])

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingDot} />
      </div>
    )
  }

  if (notFound || !profile) {
    return (
      <main className={styles.page}>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.notFound}>
            <span className={styles.notFoundIcon}>👤</span>
            <h2 className={styles.notFoundTitle}>
              {t('publicProfile.notFound')}
            </h2>
            <Link href={`/${locale}`} className={styles.backLink}>
              ← {t('backToHome')}
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const displayName = profile.name || t('anonymous')
  const initial = displayName.charAt(0).toUpperCase()
  const joinDate = new Date(profile.created_at).toLocaleDateString(
    locale === 'tr' ? 'tr-TR' : 'en-US',
    { year: 'numeric', month: 'long' }
  )

  return (
    <main className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        {/* Profile Card */}
        <div className={styles.profileCard}>
          <div className={styles.profileTop}>
            <div className={styles.avatarSection}>
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={displayName}
                  width={80}
                  height={80}
                  className={styles.avatar}
                />
              ) : (
                <div className={styles.avatarFallback}>{initial}</div>
              )}
            </div>

            <div className={styles.profileInfo}>
              <h1 className={styles.profileName}>{displayName}</h1>
              {profile.bio && (
                <p className={styles.profileBio}>{profile.bio}</p>
              )}
              <span className={styles.joinDate}>
                {t('joinedAt')}: {joinDate}
              </span>
            </div>
          </div>
        </div>

        {/* Prompts Section */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            {t('publicProfile.prompts')}
            {prompts.length > 0 && (
              <span className={styles.sectionCount}>{prompts.length}</span>
            )}
          </h2>
        </div>

        {prompts.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>✨</div>
            <p className={styles.emptyTitle}>{t('noPrompts')}</p>
          </div>
        ) : (
          <div className={styles.promptGrid}>
            {/* Faza 4'te PromptCard component'leri buraya gelecek */}
          </div>
        )}
      </div>
    </main>
  )
}
