'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import PromptShowcase from '@/components/auth/PromptShowcase'
import LoginForm from '@/components/auth/LoginForm'
import { useAuth } from '@/components/providers/AuthProvider'
import { PromptData } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { dbPromptToPromptData } from '@/lib/supabase/prompts'
import trendingFallback from '@/data/trending-prompts.json'
import styles from './login.module.css'

export default function LoginPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const locale = useLocale()
  const [prompts, setPrompts] = useState<PromptData[]>([])

  // DB'den rastgele 5 prompt cek (showcase icin), yoksa fallback
  useEffect(() => {
    async function loadShowcase() {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('prompts')
          .select('*')
          .eq('is_public', true)
          .limit(10)

        if (data && data.length > 0) {
          const shuffled = [...data].sort(() => Math.random() - 0.5)
          setPrompts(shuffled.slice(0, 5).map(dbPromptToPromptData))
        } else {
          const fallback = trendingFallback as PromptData[]
          const shuffled = [...fallback].sort(() => Math.random() - 0.5)
          setPrompts(shuffled.slice(0, 5))
        }
      } catch {
        const fallback = trendingFallback as PromptData[]
        const shuffled = [...fallback].sort(() => Math.random() - 0.5)
        setPrompts(shuffled.slice(0, 5))
      }
    }

    loadShowcase()
  }, [])

  // Zaten giris yapmissa ana sayfaya yonlendir
  useEffect(() => {
    if (!loading && user) {
      router.push(`/${locale}`)
    }
  }, [user, loading, router, locale])

  // Yukleniyor veya zaten giris yapmis
  if (loading || user) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingDot} />
      </div>
    )
  }

  return (
    <div className={styles.page}>
      {/* Sol: Prompt Showcase (sadece desktop) */}
      <div className={styles.left}>
        {prompts.length > 0 && <PromptShowcase prompts={prompts} />}
      </div>

      {/* Sag: Login Form */}
      <div className={styles.right}>
        <LoginForm />
      </div>
    </div>
  )
}
