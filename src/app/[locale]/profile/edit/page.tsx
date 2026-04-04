'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/components/providers/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'
import styles from './edit.module.css'

type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export default function ProfileEditPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('profile')
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/${locale}/login`)
    }
  }, [user, loading, router, locale])

  useEffect(() => {
    if (profile) {
      setName(profile.name || '')
      setBio(profile.bio || '')
    }
  }, [profile])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaved(false)
    setSaving(true)

    const supabase = createClient()
    const updateData: ProfileUpdate = {
      name: name.trim() || null,
      bio: bio.trim() || null,
    }
    const { error: updateError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user!.id)

    setSaving(false)

    if (updateError) {
      setError(t('edit.error'))
    } else {
      setSaved(true)
      setTimeout(() => {
        router.push(`/${locale}/profile`)
      }, 1500)
    }
  }

  if (loading || !user) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingDot} />
      </div>
    )
  }

  return (
    <main className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h1 className={styles.title}>{t('edit.title')}</h1>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>{t('edit.name')}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('edit.namePlaceholder')}
                className={styles.input}
                maxLength={50}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>{t('edit.bio')}</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={t('edit.bioPlaceholder')}
                className={styles.textarea}
                rows={4}
                maxLength={200}
              />
              <span className={styles.charCount}>{bio.length}/200</span>
            </div>

            {error && <p className={styles.error}>{error}</p>}
            {saved && <p className={styles.success}>{t('edit.saved')}</p>}

            <div className={styles.actions}>
              <Link href={`/${locale}/profile`} className={styles.cancelBtn}>
                {t('edit.cancel')}
              </Link>
              <button
                type="submit"
                className={styles.saveBtn}
                disabled={saving}
              >
                {saving ? t('edit.saving') : t('edit.save')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
