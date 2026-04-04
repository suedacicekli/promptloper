'use client'

import styles from './Skeleton.module.css'

interface SkeletonProps {
  width?: string
  height?: string
  borderRadius?: string
  className?: string
}

export default function Skeleton({ width, height, borderRadius, className }: SkeletonProps) {
  return (
    <div
      className={`${styles.skeleton} ${className || ''}`}
      style={{ width, height, borderRadius }}
    />
  )
}

// Prompt kartı skeleton'ı
export function PromptCardSkeleton() {
  return (
    <div className={styles.cardSkeleton}>
      <div className={styles.cardImage} />
      <div className={styles.cardFavBtn} />
    </div>
  )
}

// Prompt grid skeleton'ı — birden fazla kart
export function PromptGridSkeleton({ count = 8 }: { count?: number }) {
  const heights = [350, 250, 300, 400, 280, 320, 360, 290]
  return (
    <div className={styles.gridSkeleton}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.gridItem}>
          <div
            className={styles.cardSkeleton}
            style={{ height: `${heights[i % heights.length]}px` }}
          >
            <div className={styles.cardImage} />
            <div className={styles.cardFavBtn} />
          </div>
        </div>
      ))}
    </div>
  )
}

// Trending section skeleton'ı
export function TrendingSkeleton() {
  return (
    <div className={styles.trendingSkeleton}>
      <div className={styles.trendingTitle} />
      <div className={styles.trendingCards}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={styles.trendingCard} />
        ))}
      </div>
    </div>
  )
}

// Profil sayfası skeleton'ı
export function ProfileSkeleton() {
  return (
    <div className={styles.profileSkeleton}>
      <div className={styles.profileCardSkeleton}>
        <div className={styles.profileAvatarSkeleton} />
        <div className={styles.profileInfoSkeleton}>
          <div className={styles.profileNameSkeleton} />
          <div className={styles.profileEmailSkeleton} />
          <div className={styles.profileBioSkeleton} />
        </div>
      </div>
      <div className={styles.tabsSkeleton}>
        <div className={styles.tabSkeleton} />
        <div className={styles.tabSkeleton} />
        <div className={styles.tabSkeleton} />
      </div>
    </div>
  )
}
