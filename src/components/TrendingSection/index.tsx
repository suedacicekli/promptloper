'use client'

import TrendingCard from '../TrendingCard'
import trendingData from '../../../public/data/trending-prompts.json'
import { PromptData } from '@/types'
import styles from './TrendingSection.module.css'

export default function TrendingSection() {
  const prompts = trendingData as PromptData[]
  const triplePrompts = [...prompts, ...prompts, ...prompts]

  return (
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
              />
            ))}
          </div>
        </div>

        <div className={styles.gradientLeft} />
        <div className={styles.gradientRight} />
      </div>
    </section>
  )
}
