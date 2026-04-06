'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import AIToolIcon, { getAIToolName } from '@/components/AIToolIcon'
import AuthModal from '@/components/auth/AuthModal'
import { useAuth } from '@/components/providers/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import type { Prompt, Profile } from '@/types/database'
import styles from './detail.module.css'

export default function PromptDetailPage() {
  const { user } = useAuth()
  const router = useRouter()
  const locale = useLocale()
  const params = useParams()
  const promptId = params.id as string
  const t = useTranslations('promptDetail')
  const tCommon = useTranslations('common')

  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [owner, setOwner] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [favoriteCount, setFavoriteCount] = useState(0)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const isOwner = user && prompt && prompt.user_id === user.id

  useEffect(() => {
    async function fetchPrompt() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('id', promptId)
        .single()

      if (error || !data) {
        setLoading(false)
        return
      }

      setPrompt(data)

      // Prompt sahibinin profilini cek
      if (data.user_id) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user_id)
          .single()

        if (profileData) setOwner(profileData)
      }

      // Favori sayisini cek
      const favId = data.source_id || data.id
      const { count } = await supabase
        .from('favorites')
        .select('id', { count: 'exact', head: true })
        .eq('prompt_id', favId)

      setFavoriteCount(count || 0)

      // Favori durumunu kontrol et
      if (user) {
        const { data: favData } = await supabase
          .from('favorites')
          .select('id')
          .eq('user_id', user.id)
          .eq('prompt_id', favId)
          .maybeSingle()

        setIsFavorited(!!favData)
      }

      setLoading(false)
    }

    fetchPrompt()
  }, [promptId, user])

  const handleCopy = async () => {
    if (!prompt) return
    await navigator.clipboard.writeText(prompt.prompt_text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleFavorite = async () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }
    if (!prompt) return

    const supabase = createClient()
    const favId = prompt.source_id || prompt.id

    if (isFavorited) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('prompt_id', favId)
      setIsFavorited(false)
      setFavoriteCount(prev => Math.max(0, prev - 1))
    } else {
      await supabase
        .from('favorites')
        .insert({ user_id: user.id, prompt_id: favId })
      setIsFavorited(true)
      setFavoriteCount(prev => prev + 1)
    }
  }

  const handleDelete = async () => {
    if (!prompt) return
    setDeleting(true)

    const supabase = createClient()
    const { error } = await supabase
      .from('prompts')
      .delete()
      .eq('id', prompt.id)

    if (error) {
      console.error('Delete error:', error)
      setDeleting(false)
      return
    }

    router.push(`/${locale}/profile`)
  }

  if (loading) {
    return (
      <main className={styles.page}>
        <Navbar />
        <div className={styles.loadingScreen}>
          <div className={styles.loadingDot} />
        </div>
      </main>
    )
  }

  if (!prompt) {
    return (
      <main className={styles.page}>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.notFound}>
            <h1 className={styles.notFoundTitle}>{t('notFound')}</h1>
            <p className={styles.notFoundDesc}>{t('notFoundDesc')}</p>
            <Link href={`/${locale}`} className={styles.homeBtn}>
              {t('backToHome')}
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        <Link href={`/${locale}`} className={styles.backBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          {t('backToHome')}
        </Link>

        <div className={styles.card}>
          {prompt.image_url && (
            <div className={styles.imageWrapper}>
              <img src={prompt.image_url} alt={prompt.title} />
            </div>
          )}

          <div className={styles.content}>
            <div className={styles.topRow}>
              <h1 className={styles.titleText}>{prompt.title}</h1>

              {isOwner && (
                <div className={styles.actions}>
                  <button
                    className={styles.editBtn}
                    onClick={() => router.push(`/${locale}/prompts/${prompt.id}/edit`)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    {t('editPrompt')}
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-2 14H7L5 6" />
                      <path d="M10 11v6M14 11v6M9 6V4h6v2" />
                    </svg>
                    {t('deletePrompt')}
                  </button>
                </div>
              )}
            </div>

            <p className={styles.description}>{prompt.description}</p>

            <div className={styles.meta}>
              <span className={`${styles.metaItem} ${styles.categoryBadge}`}>
                {prompt.category}
              </span>
              {prompt.ai_tool && (
                <span className={`${styles.metaItem} ${styles.aiToolBadge}`}>
                  <AIToolIcon tool={prompt.ai_tool} size={14} />
                  {getAIToolName(prompt.ai_tool)}
                </span>
              )}
              <span className={styles.metaItem}>
                <span className={styles.metaLabel}>{t('createdAt')}:</span>
                {new Date(prompt.created_at).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US')}
              </span>
            </div>

            {prompt.tags && prompt.tags.length > 0 && (
              <div className={styles.tags}>
                {prompt.tags.map(tag => (
                  <span key={tag} className={styles.tag}>#{tag}</span>
                ))}
              </div>
            )}

            <div className={styles.promptSection}>
              <p className={styles.promptLabel}>{t('promptText')}</p>
              <div className={styles.promptBox}>
                <p className={styles.promptText}>{prompt.prompt_text}</p>
              </div>
            </div>

            <div className={styles.bottomActions}>
              <button className={styles.copyBtn} onClick={handleCopy}>
                {copied ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {t('copied')}
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                      <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                    </svg>
                    {t('copyPrompt')}
                  </>
                )}
              </button>

              <button
                className={`${styles.favoriteBtn} ${isFavorited ? styles.favoriteBtnActive : ''}`}
                onClick={handleFavorite}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
                {favoriteCount > 0 && (
                  <span>{t('favoriteCount', { count: favoriteCount })}</span>
                )}
              </button>
            </div>

            {owner && (
              <div className={styles.sharedBy}>
                {owner.avatar_url && (
                  <img src={owner.avatar_url} alt={owner.name || ''} className={styles.sharedByAvatar} />
                )}
                <div className={styles.sharedByInfo}>
                  <span className={styles.sharedByLabel}>{t('sharedBy')}</span>
                  <Link href={`/${locale}/user/${owner.id}`} className={styles.sharedByName}>
                    {owner.name || owner.email}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className={styles.deleteOverlay} onClick={() => !deleting && setShowDeleteModal(false)}>
          <div className={styles.deleteModal} onClick={e => e.stopPropagation()}>
            <p className={styles.deleteModalText}>{t('deleteConfirm')}</p>
            <div className={styles.deleteModalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                {tCommon('cancel')}
              </button>
              <button
                className={styles.confirmDeleteBtn}
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? t('deleting') : t('deletePrompt')}
              </button>
            </div>
          </div>
        </div>
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </main>
  )
}
