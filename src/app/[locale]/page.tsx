'use client'

import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { useTranslations } from 'next-intl'
import Navbar from '@/components/Navbar'
import TrendingSection from '@/components/TrendingSection'
import CategoryFilter from '@/components/CategoryFilter'
import SearchInput from '@/components/SearchInput'
import PromptGrid from '@/components/PromptGrid'
import Footer from '@/components/Footer'
import { PromptData } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { dbPromptToPromptData } from '@/lib/supabase/prompts'
import type { Prompt } from '@/types/database'
import allPromptsJson from '@/data/all-prompts.json'

const PAGE_SIZE = 12

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [prompts, setPrompts] = useState<PromptData[]>([])
  const [promptDbMap, setPromptDbMap] = useState<Map<string, { dbId: string; ownerId: string | null }>>(new Map())
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [categories, setCategories] = useState<string[]>([])
  const pageRef = useRef(0)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const t = useTranslations('common')

  const fetchPrompts = useCallback(async (page: number, category?: string, search?: string) => {
    const supabase = createClient()
    const from = page * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    let query = supabase
      .from('prompts')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (category && category !== 'All') {
      query = query.eq('category', category)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,prompt_text.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  }, [])

  const fetchCategories = useCallback(async () => {
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('prompts')
        .select('category')
        .eq('is_public', true)

      if (data && data.length > 0) {
        const unique = Array.from(new Set(data.map(p => p.category))).sort()
        setCategories(unique)
      } else {
        // Fallback: statik JSON'dan kategorileri al
        const fallback = allPromptsJson as PromptData[]
        const unique = Array.from(new Set(fallback.map(p => p.category))).sort()
        setCategories(unique)
      }
    } catch {
      const fallback = allPromptsJson as PromptData[]
      const unique = Array.from(new Set(fallback.map(p => p.category))).sort()
      setCategories(unique)
    }
  }, [])

  // Ilk yukleme
  const loadInitial = useCallback(async () => {
    setLoading(true)
    pageRef.current = 0

    try {
      const data = await fetchPrompts(0, selectedCategory, searchQuery)

      if (data.length > 0) {
        const dbPrompts = data.map(dbPromptToPromptData)
        setPrompts(dbPrompts)
        setHasMore(data.length === PAGE_SIZE)

        const map = new Map<string, { dbId: string; ownerId: string | null }>()
        data.forEach((p: Prompt) => {
          const displayId = p.source_id || p.id
          map.set(displayId, { dbId: p.id, ownerId: p.user_id })
        })
        setPromptDbMap(map)
      } else {
        // DB bossa statik JSON fallback
        setPrompts(allPromptsJson as PromptData[])
        setHasMore(false)
      }
    } catch {
      // Supabase hatasi — statik JSON fallback
      setPrompts(allPromptsJson as PromptData[])
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }, [fetchPrompts, selectedCategory, searchQuery])

  // Daha fazla yukle
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)

    try {
      const nextPage = pageRef.current + 1
      const data = await fetchPrompts(nextPage, selectedCategory, searchQuery)

      if (data.length > 0) {
        const dbPrompts = data.map(dbPromptToPromptData)
        setPrompts(prev => [...prev, ...dbPrompts])
        pageRef.current = nextPage
        setHasMore(data.length === PAGE_SIZE)

        setPromptDbMap(prev => {
          const map = new Map(prev)
          data.forEach((p: Prompt) => {
            const displayId = p.source_id || p.id
            map.set(displayId, { dbId: p.id, ownerId: p.user_id })
          })
          return map
        })
      } else {
        setHasMore(false)
      }
    } catch {
      // Sessizce devam et
    } finally {
      setLoadingMore(false)
    }
  }, [fetchPrompts, loadingMore, hasMore, selectedCategory, searchQuery])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    loadInitial()
  }, [loadInitial])

  // Infinite scroll observer
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasMore, loadingMore, loading, loadMore])

  return (
    <main className="min-h-screen w-full bg-black">
      <Navbar />
      <TrendingSection />
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
      />
      <PromptGrid
        prompts={prompts}
        loading={loading}
        promptDbMap={promptDbMap}
        onPromptDeleted={loadInitial}
      />

      {/* Infinite scroll sentinel */}
      {!loading && hasMore && (
        <div
          ref={sentinelRef}
          style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {loadingMore && (
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#C6F449',
              animation: 'pulse 1.2s ease-in-out infinite'
            }} />
          )}
        </div>
      )}

      {!loading && !hasMore && prompts.length > 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem' }}>
          {t('noMoreResults')}
        </div>
      )}

      <Footer />
    </main>
  )
}
