'use client'

import { useState } from 'react'
import Image from 'next/image'
import { PromptData } from '@/types'
import AIToolIcon from '@/components/AIToolIcon'
import styles from './TrendingCard.module.css'
import PromptModal from '@/components/PromptModal'

interface TrendingCardProps {
  promptData: PromptData
}

export default function TrendingCard({ promptData }: TrendingCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCardClick = () => {
    setIsModalOpen(true)
  }

  return (
    <>
      <div
        className={styles.card}
        onClick={handleCardClick}
      >
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
      </div>

      <PromptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        promptData={promptData}
      />
    </>
  )
}
