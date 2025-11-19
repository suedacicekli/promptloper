'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { PromptData } from '@/types'
import AIToolIcon from '@/components/AIToolIcon'
import styles from './PromptModal.module.css'

interface PromptModalProps {
  isOpen: boolean
  onClose: () => void
  promptData: PromptData
}

export default function PromptModal({ isOpen, onClose, promptData }: PromptModalProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptData.prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className={styles.imageContainer}>
          <Image
            src={promptData.imageSrc}
            alt={promptData.title}
            fill
            style={{ objectFit: 'cover' }}
            sizes="600px"
          />
        </div>

        <div className={styles.content}>
          <div className={styles.badge}>{promptData.category}</div>

          <h2 className={styles.title}>{promptData.title}</h2>

          <p className={styles.description}>{promptData.description}</p>

          <div className={styles.promptSection}>
            <div className={styles.promptHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={styles.promptLabel}>Prompt</span>
                {promptData.aiTool && (
                  <AIToolIcon tool={promptData.aiTool} size={20} />
                )}
              </div>
              <button onClick={handleCopy} className={styles.copyButton}>
                {copied ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="#16a34a">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                      <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                    </svg>
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className={styles.promptBox}>
              <p className={styles.promptText}>{promptData.prompt}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
