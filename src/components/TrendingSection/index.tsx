'use client'

import { useState, useEffect } from 'react'
import TrendingCard from '../TrendingCard'
import AuthModal from '../auth/AuthModal'
import trendingJson from '../../../public/data/trending-prompts.json'
import { PromptData } from '@/types'
import { useAuth } from '@/components/providers/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import styles from './TrendingSection.module.css'

export default function TrendingSection() {
  // Trending: statik JSON + ileride favori sayisina gore Supabase'den
  const prompts = trendingJson as PromptData[]
  const { user } = useAuth()
  const [favoritedIds, setFavoritedIds] = useState<Set<string>>(new Set())
  const [favoriteCounts, setFavoriteCounts] = useState<Map<string, number>>(new Map())
  const [showAuthModal, setShowAuthModal] = useState(false)

  const triplePrompts = [...prompts, ...prompts, ...prompts]

  useEffect(() => {
    async function loadFavoriteCounts() {
      const supabase = createClient()
      const promptIds = prompts.map(p => p.id)
      const { data } = await supabase
        .from('favorites')
        .select('prompt_id')
        .in('prompt_id', promptIds)

      if (data) {
        const counts = new Map<string, number>()
        data.forEach(f => {
          counts.set(f.prompt_id, (counts.get(f.prompt_id) || 0) + 1)
        })
        setFavoriteCounts(counts)
      }
    }

    loadFavoriteCounts()
  }, [prompts])

  useEffect(() => {
    if (!user) {
      setFavoritedIds(new Set())
      return
    }

    async function loadFavorites() {
      const supabase = createClient()
      const { data } = await supabase
        .from('favorites')
        .select('prompt_id')
        .eq('user_id', user!.id)

      if (data) {
        setFavoritedIds(new Set(data.map(f => f.prompt_id)))
      }
    }

    loadFavorites()
  }, [user])

  const handleFavoriteClick = async (promptId: string) => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    const supabase = createClient()
    const isFav = favoritedIds.has(promptId)

    if (isFav) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('prompt_id', promptId)

      setFavoritedIds(prev => {
        const next = new Set(prev)
        next.delete(promptId)
        return next
      })
      setFavoriteCounts(prev => {
        const next = new Map(prev)
        next.set(promptId, Math.max(0, (prev.get(promptId) || 0) - 1))
        return next
      })
    } else {
      await supabase
        .from('favorites')
        .insert({ user_id: user.id, prompt_id: promptId })

      setFavoritedIds(prev => new Set(prev).add(promptId))
      setFavoriteCounts(prev => {
        const next = new Map(prev)
        next.set(promptId, (prev.get(promptId) || 0) + 1)
        return next
      })
    }
  }

  return (
    <>
      <section className={styles.section}>
        <div className={styles.header}>
          <h2 className={styles.title}>Trending Now</h2>
        </div>

        <div className={styles.scrollContainer}>
          <div className={styles.scrollWrapper}>
            <div className={styles.cardsContainer}>
              {triplePrompts.map((prompt, index) => (
                <TrendingCard
                  key={`${prompt.id}-${index}`}
                  promptData={prompt}
                  isFavorited={favoritedIds.has(prompt.id)}
                  favoriteCount={favoriteCounts.get(prompt.id) || 0}
                  onFavoriteClick={handleFavoriteClick}
                />
              ))}
            </div>
          </div>

          <div className={styles.gradientLeft} />
          <div className={styles.gradientRight} />
        </div>
      </section>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  )
}
