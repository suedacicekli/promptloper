'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import PromptGrid from '@/components/PromptGrid'
import { ProfileSkeleton, PromptGridSkeleton } from '@/components/Skeleton'
import { useAuth } from '@/components/providers/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import type { Prompt, AIGeneration } from '@/types/database'
import type { PromptData } from '@/types'
import allPromptsData from '../../../../public/data/all-prompts.json'
import trendingPromptsData from '../../../../public/data/trending-prompts.json'
import styles from './profile.module.css'

type Tab = 'prompts' | 'favorites' | 'aiHistory'

// Supabase Prompt → PromptData dönüşümü
function dbPromptToPromptData(p: Prompt): PromptData {
  return {
    id: p.id,
    category: p.category,
    title: p.title,
    description: p.description,
    prompt: p.prompt_text,
    imageSrc: p.image_url || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500',
    aiTool: p.ai_tool as PromptData['aiTool'],
    tags: p.tags,
  }
}

export default function ProfilePage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('profile')
  const [activeTab, setActiveTab] = useState<Tab>('prompts')
  const [myPrompts, setMyPrompts] = useState<Prompt[]>([])
  const [myFavorites, setMyFavorites] = useState<PromptData[]>([])
  const [aiHistory, setAiHistory] = useState<AIGeneration[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/${locale}/login`)
    }
  }, [user, loading, router, locale])

  const fetchData = useCallback(async () => {
    if (!user) return
    setDataLoading(true)
    const supabase = createClient()
    const [promptsRes, historyRes, favoritesRes] = await Promise.all([
      supabase
        .from('prompts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('ai_generations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20),
      supabase
        .from('favorites')
        .select('prompt_id')
        .eq('user_id', user.id),
    ])
    setMyPrompts(promptsRes.data || [])
    setAiHistory(historyRes.data || [])

    if (favoritesRes.data && favoritesRes.data.length > 0) {
      const favIds = new Set(favoritesRes.data.map(f => f.prompt_id))

      const staticPrompts = [
        ...(allPromptsData as PromptData[]),
        ...(trendingPromptsData as PromptData[]),
      ]
      const staticFavs = staticPrompts.filter(p => favIds.has(p.id))

      const dbFavIds = favoritesRes.data
        .map(f => f.prompt_id)
        .filter(id => !staticPrompts.some(sp => sp.id === id))

      let dbFavs: PromptData[] = []
      if (dbFavIds.length > 0) {
        const { data: dbFavPrompts } = await supabase
          .from('prompts')
          .select('*')
          .in('id', dbFavIds)

        if (dbFavPrompts) {
          dbFavs = dbFavPrompts.map(dbPromptToPromptData)
        }
      }

      setMyFavorites([...dbFavs, ...staticFavs])
    } else {
      setMyFavorites([])
    }
    setDataLoading(false)
  }, [user])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading || !user) {
    return (
      <main className={styles.page}>
        <Navbar />
        <div className={styles.container}>
          <ProfileSkeleton />
          <PromptGridSkeleton count={4} />
        </div>
      </main>
    )
  }

  const displayName = profile?.name || user.email?.split('@')[0] || ''
  const initial = displayName.charAt(0).toUpperCase()
  const joinDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString(
        locale === 'tr' ? 'tr-TR' : 'en-US',
        { year: 'numeric', month: 'long' }
      )
    : ''

  return (
    <main className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        {/* Profile Card */}
        <div className={styles.profileCard}>
          <div className={styles.profileTop}>
            <div className={styles.avatarSection}>
              {profile?.avatar_url ? (
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
              <p className={styles.profileEmail}>{user.email}</p>
              {profile?.bio ? (
                <p className={styles.profileBio}>{profile.bio}</p>
              ) : (
                <p className={styles.noBio}>{t('noBio')}</p>
              )}
              {joinDate && (
                <span className={styles.joinDate}>
                  {t('joinedAt')}: {joinDate}
                </span>
              )}
            </div>

            <Link href={`/${locale}/profile/edit`} className={styles.editBtn}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              {t('editProfile')}
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'prompts' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('prompts')}
          >
            {t('myPrompts')}
            {myPrompts.length > 0 && (
              <span className={styles.tabCount}>{myPrompts.length}</span>
            )}
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'favorites' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            {t('myFavorites')}
            {myFavorites.length > 0 && (
              <span className={styles.tabCount}>{myFavorites.length}</span>
            )}
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'aiHistory' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('aiHistory')}
          >
            {t('aiHistory')}
            {aiHistory.length > 0 && (
              <span className={styles.tabCount}>{aiHistory.length}</span>
            )}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'prompts' && (
          <>
            {myPrompts.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>✨</div>
                <h3 className={styles.emptyTitle}>{t('noPrompts')}</h3>
                <p className={styles.emptyDesc}>{t('noPromptsDesc')}</p>
                <Link href={`/${locale}/prompts/new`} className={styles.emptyBtn}>
                  {t('addFirstPrompt')}
                </Link>
              </div>
            ) : (
              <PromptGrid
                prompts={myPrompts.map(dbPromptToPromptData)}
                noPadding
                promptDbMap={new Map(myPrompts.map(p => [p.id, { dbId: p.id, ownerId: p.user_id }]))}
                onPromptDeleted={fetchData}
              />
            )}
          </>
        )}

        {activeTab === 'favorites' && (
          <>
            {myFavorites.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🤍</div>
                <h3 className={styles.emptyTitle}>{t('noFavorites')}</h3>
                <p className={styles.emptyDesc}>{t('noFavoritesDesc')}</p>
                <Link href={`/${locale}`} className={styles.emptyBtn}>
                  {t('exploreFavorites')}
                </Link>
              </div>
            ) : (
              <PromptGrid prompts={myFavorites} noPadding />
            )}
          </>
        )}

        {activeTab === 'aiHistory' && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🤖</div>
            <h3 className={styles.emptyTitle}>{t('noAiHistory')}</h3>
            <p className={styles.emptyDesc}>{t('noAiHistoryDesc')}</p>
          </div>
        )}
      </div>
    </main>
  )
}
