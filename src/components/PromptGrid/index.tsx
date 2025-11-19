'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { PromptData } from '@/types'
import AIToolIcon, { getAIToolName } from '@/components/AIToolIcon'
import SupportModal from '@/components/SupportModal'
import styles from './PromptGrid.module.css'

interface PromptGridProps {
  prompts: PromptData[]
}

interface PromptCardProps {
  promptData: PromptData
  useFixedHeight?: boolean
  cardHeight: number
  onCopy: () => void
}

function PromptCard({ promptData, useFixedHeight = false, cardHeight, onCopy }: PromptCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [copied, setCopied] = useState(false)

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

  return (
    <div
      className={styles.card}
      style={{ height: useFixedHeight ? '350px' : `${cardHeight}px` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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

export default function PromptGrid({ prompts }: PromptGridProps) {
  const useFixedLayout = prompts.length < 8
  const [showSupportModal, setShowSupportModal] = useState(false)
  const [copyCount, setCopyCount] = useState(0)

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

  return (
    <>
      <div className={styles.container}>
        <div className={`${styles.grid} ${useFixedLayout ? styles.gridFixed : ''}`}>
          {prompts.map((prompt) => (
            <div key={prompt.id} className={styles.gridItem}>
              <PromptCard
                promptData={prompt}
                useFixedHeight={useFixedLayout}
                cardHeight={prompt.height || 300}
                onCopy={handleCopy}
              />
            </div>
          ))}
        </div>
      </div>

      <SupportModal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
      />
    </>
  )
}
