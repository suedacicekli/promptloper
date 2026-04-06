'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { PromptData } from '@/types'
import styles from './PromptShowcase.module.css'

interface PromptShowcaseProps {
  prompts: PromptData[]
}

export default function PromptShowcase({ prompts }: PromptShowcaseProps) {
  const t = useTranslations('prompt')
  const locale = useLocale()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [copied, setCopied] = useState(false)

  const currentPrompt = prompts[currentIndex]

  // Her 8 saniyede bir sonraki prompt'a gec
  const goToNext = useCallback(() => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % prompts.length)
      setIsTransitioning(false)
    }, 400)
  }, [prompts.length])

  useEffect(() => {
    const interval = setInterval(goToNext, 8000)
    return () => clearInterval(interval)
  }, [goToNext])

  // Prompt kopyalama
  async function handleCopy() {
    await navigator.clipboard.writeText(currentPrompt.prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!currentPrompt) return null

  return (
    <div className={styles.container}>
      {/* Arka plan gorseli */}
      <div className={`${styles.bgImage} ${isTransitioning ? styles.fadeOut : styles.fadeIn}`}>
        <Image
          src={currentPrompt.imageSrc}
          alt={currentPrompt.title}
          fill
          sizes="50vw"
          className={styles.image}
          priority
        />
        <div className={styles.overlay} />
      </div>

      {/* Icerik */}
      <div className={styles.content}>
        {/* Ust kisim: Logo + Slogan */}
        <div className={styles.header}>
          <Link href={`/${locale}`} className={styles.logoRow}>
            <Image
              src="/asset/promptloper.png"
              alt="Promptloper"
              width={32}
              height={32}
            />
            <span className={styles.logoText}>Promptloper</span>
          </Link>
          <p className={styles.slogan}>
            Discover, share & create with AI prompts
          </p>
        </div>

        {/* Prompt karti */}
        <div className={`${styles.card} ${isTransitioning ? styles.cardOut : styles.cardIn}`}>
          {/* Kategori badge */}
          <div className={styles.cardHeader}>
            <span className={styles.categoryBadge}>{currentPrompt.category}</span>
            {currentPrompt.aiTool && (
              <Image
                src={`/asset/ai-logo/${currentPrompt.aiTool}-logo.png`}
                alt={currentPrompt.aiTool}
                width={20}
                height={20}
                className={styles.aiLogo}
              />
            )}
          </div>

          {/* Baslik */}
          <h3 className={styles.cardTitle}>{currentPrompt.title}</h3>

          {/* Prompt metni */}
          <div className={styles.promptBox}>
            <p className={styles.promptText}>
              {currentPrompt.prompt.length > 200
                ? currentPrompt.prompt.substring(0, 200) + '...'
                : currentPrompt.prompt
              }
            </p>
          </div>

          {/* Kopyala butonu */}
          <button className={styles.copyBtn} onClick={handleCopy}>
            {copied ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                {t('copied')}
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
                {t('copy')}
              </>
            )}
          </button>
        </div>

        {/* Alt kisim: Prompt sayaci */}
        <div className={styles.footer}>
          <div className={styles.dots}>
            {prompts.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === currentIndex ? styles.dotActive : ''}`}
                onClick={() => {
                  setIsTransitioning(true)
                  setTimeout(() => {
                    setCurrentIndex(i)
                    setIsTransitioning(false)
                  }, 400)
                }}
                aria-label={`Prompt ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
