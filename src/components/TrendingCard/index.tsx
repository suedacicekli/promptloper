'use client'

import { useState } from 'react'
import Image from 'next/image'
import { PromptData } from '@/types'
import AIToolIcon from '@/components/AIToolIcon'
import styles from './TrendingCard.module.css'
import PromptModal from '@/components/PromptModal'

interface TrendingCardProps {
  promptData: PromptData
  isFavorited: boolean
  favoriteCount?: number
  onFavoriteClick: (promptId: string) => void
}

export default function TrendingCard({ promptData, isFavorited, favoriteCount = 0, onFavoriteClick }: TrendingCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCardClick = () => {
    setIsModalOpen(true)
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    onFavoriteClick(promptData.id)
  }

  return (
    <>
      <div className={styles.card} onClick={handleCardClick}>
        <div className={styles.imageWrapper}>
          <Image
            src={promptData.imageSrc}
            alt={promptData.title}
            fill
            sizes="497px"
            style={{ objectFit: 'cover' }}
          />
        </div>

        <div className={styles.overlay} />

        <div className={styles.badgeContainer}>
          {promptData.aiTool && (
            <div className={styles.iconWrapper}>
              <AIToolIcon tool={promptData.aiTool} size={20} />
            </div>
          )}
          <div className={styles.badge}>
            {promptData.category}
          </div>
        </div>

        <button
          className={`${styles.favoriteBtn} ${isFavorited ? styles.favoriteBtnActive : ''}`}
          onClick={handleFavorite}
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg
            width="16"
            height="16"
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
      </div>

      <PromptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        promptData={promptData}
        isFavorited={isFavorited}
        favoriteCount={favoriteCount}
        onFavoriteClick={onFavoriteClick}
      />
    </>
  )
}
