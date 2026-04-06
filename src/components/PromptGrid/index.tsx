'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { PromptData } from '@/types'
import AIToolIcon, { getAIToolName } from '@/components/AIToolIcon'
import SupportModal from '@/components/SupportModal'
import AuthModal from '@/components/auth/AuthModal'
import PromptModal from '@/components/PromptModal'
import { useAuth } from '@/components/providers/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import styles from './PromptGrid.module.css'

interface PromptGridProps {
  prompts: PromptData[]
  noPadding?: boolean
  loading?: boolean
  /** Her prompt icin DB bilgisi (modal'da edit/delete icin) */
  promptDbMap?: Map<string, { dbId: string; ownerId: string | null }>
  /** Prompt silindikten sonra listeyi yenile */
  onPromptDeleted?: () => void
}

interface PromptCardProps {
  promptData: PromptData
  useFixedHeight?: boolean
  cardHeight: number
  onCopy: () => void
  isFavorited: boolean
  favoriteCount: number
  onFavoriteClick: (promptId: string) => void
  onCardClick: () => void
}

function PromptCard({ promptData, useFixedHeight = false, cardHeight, onCopy, isFavorited, favoriteCount, onFavoriteClick, onCardClick }: PromptCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [copied, setCopied] = useState(false)
  const t = useTranslations('prompt')

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(promptData.prompt)
      setCopied(true)
      onCopy()
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    onFavoriteClick(promptData.id)
  }

  return (
    <div
      className={styles.card}
      style={{ height: useFixedHeight ? '350px' : `${cardHeight}px`, cursor: 'pointer' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onCardClick}
    >
      <div className={styles.imageWrapper}>
        <Image
          src={promptData.imageSrc}
          alt={promptData.title}
          fill
          className={isHovered ? styles.imageBlur : ''}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          style={{ objectFit: 'cover' }}
        />
      </div>

      <div className={`${styles.overlay} ${isHovered ? styles.overlayHover : ''}`} />

      {/* Favorite button — always visible */}
      <button
        className={`${styles.favoriteBtn} ${isFavorited ? styles.favoriteBtnActive : ''}`}
        onClick={handleFavorite}
        aria-label={isFavorited ? t('favorited') : t('favorite')}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill={isFavorited ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
        {favoriteCount > 0 && (
          <span className={styles.favoriteBtnCount}>{favoriteCount}</span>
        )}
      </button>

      {isHovered && (
        <>
          <div className={styles.badge} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {promptData.aiTool && (
              <AIToolIcon tool={promptData.aiTool} size={16} />
            )}
            <span>{promptData.category}</span>
          </div>

          <div className={styles.content}>
            <div className={styles.promptBox}>
              <p className={styles.promptText}>
                {promptData.prompt}
              </p>
            </div>

            <div className={styles.copyButton}>
              <button
                onClick={handleCopy}
                className={styles.copyBtn}
                aria-label="Copy prompt"
              >
                {copied ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="#16a34a">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="#374151">
                    <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                    <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                  </svg>
                )}
              </button>

              <div className={styles.tooltip}>
                {copied ? (
                  <span>
                    {promptData.aiTool
                      ? `Copied! Use with ${getAIToolName(promptData.aiTool)}`
                      : 'Copied!'
                    }
                  </span>
                ) : (
                  'Copy'
                )}
                <div className={styles.tooltipArrow}></div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default function PromptGrid({ prompts, noPadding = false, loading = false, promptDbMap, onPromptDeleted }: PromptGridProps) {
  const useFixedLayout = prompts.length < 8
  const [showSupportModal, setShowSupportModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [copyCount, setCopyCount] = useState(0)
  const [favoritedIds, setFavoritedIds] = useState<Set<string>>(new Set())
  const [favoriteCounts, setFavoriteCounts] = useState<Map<string, number>>(new Map())
  const [selectedPrompt, setSelectedPrompt] = useState<PromptData | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    const lastShown = localStorage.getItem('supportModalLastShown')
    const today = new Date().toDateString()

    if (lastShown !== today) {
      localStorage.removeItem('todayCopyCount')
    }

    const savedCount = localStorage.getItem('todayCopyCount')
    if (savedCount) {
      setCopyCount(parseInt(savedCount, 10))
    }
  }, [])

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

    if (prompts.length > 0) {
      loadFavoriteCounts()
    }
  }, [prompts])

  const handleCopy = () => {
    const newCount = copyCount + 1
    setCopyCount(newCount)
    localStorage.setItem('todayCopyCount', newCount.toString())

    const isDisabled = localStorage.getItem('supportModalDisabled') === 'true'

    if (newCount === 2 && !isDisabled) {
      const lastShown = localStorage.getItem('supportModalLastShown')
      const today = new Date().toDateString()

      if (lastShown !== today) {
        setShowSupportModal(true)
        localStorage.setItem('supportModalLastShown', today)
      }
    }
  }

  const handleFavoriteClick = async (promptId: string) => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    const supabase = createClient()
    const isFav = favoritedIds.has(promptId)

    if (isFav) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('prompt_id', promptId)

      if (!error) {
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
      }
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, prompt_id: promptId })

      if (!error) {
        setFavoritedIds(prev => new Set(prev).add(promptId))
        setFavoriteCounts(prev => {
          const next = new Map(prev)
          next.set(promptId, (prev.get(promptId) || 0) + 1)
          return next
        })
      }
    }
  }

  const getDbInfo = (promptId: string) => {
    if (promptDbMap) return promptDbMap.get(promptId)
    return undefined
  }

  return (
    <>
      <div className={styles.container} style={noPadding ? { padding: 0 } : undefined}>
        <div className={`${styles.grid} ${useFixedLayout ? styles.gridFixed : ''}`}>
          {prompts.map((prompt) => (
            <div key={prompt.id} className={styles.gridItem}>
              <PromptCard
                promptData={prompt}
                useFixedHeight={useFixedLayout}
                cardHeight={prompt.height || 300}
                onCopy={handleCopy}
                isFavorited={favoritedIds.has(prompt.id)}
                favoriteCount={favoriteCounts.get(prompt.id) || 0}
                onFavoriteClick={handleFavoriteClick}
                onCardClick={() => setSelectedPrompt(prompt)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Prompt Detail Modal */}
      {selectedPrompt && (
        <PromptModal
          isOpen={true}
          onClose={() => setSelectedPrompt(null)}
          promptData={selectedPrompt}
          isFavorited={favoritedIds.has(selectedPrompt.id)}
          favoriteCount={favoriteCounts.get(selectedPrompt.id) || 0}
          onFavoriteClick={handleFavoriteClick}
          dbPromptId={getDbInfo(selectedPrompt.id)?.dbId}
          ownerId={getDbInfo(selectedPrompt.id)?.ownerId}
          onDelete={() => {
            setSelectedPrompt(null)
            if (onPromptDeleted) onPromptDeleted()
          }}
        />
      )}

      <SupportModal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  )
}
