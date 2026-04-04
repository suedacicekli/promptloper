'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
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
import allPromptsJson from '../../../public/data/all-prompts.json'

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [allPrompts, setAllPrompts] = useState<PromptData[]>(allPromptsJson as PromptData[])
  const [promptDbMap, setPromptDbMap] = useState<Map<string, { dbId: string; ownerId: string | null }>>(new Map())
  const [loading, setLoading] = useState(true)

  const fetchPrompts = useCallback(async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })

      if (error) throw error

      if (data && data.length > 0) {
        const dbPrompts = data.map(dbPromptToPromptData)
        const staticPrompts = (allPromptsJson as PromptData[]).filter(
          sp => !dbPrompts.some(dp => dp.id === sp.id)
        )
        setAllPrompts([...dbPrompts, ...staticPrompts])

        // DB bilgilerini map'e kaydet (modal'da edit/delete icin)
        const map = new Map<string, { dbId: string; ownerId: string | null }>()
        data.forEach((p: Prompt) => {
          const displayId = p.source_id || p.id
          map.set(displayId, { dbId: p.id, ownerId: p.user_id })
        })
        setPromptDbMap(map)
      }
    } catch {
      // Supabase hatasi durumunda statik JSON kullanilir
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPrompts()
  }, [fetchPrompts])

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(allPrompts.map(p => p.category)))
    return uniqueCategories.sort()
  }, [allPrompts])

  const filteredPrompts = useMemo(() => {
    return allPrompts.filter(prompt => {
      const matchesCategory = selectedCategory === 'All' || prompt.category === selectedCategory
      const matchesSearch = searchQuery === '' ||
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (prompt.aiTool && prompt.aiTool.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchesCategory && matchesSearch
    })
  }, [allPrompts, selectedCategory, searchQuery])

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
        prompts={filteredPrompts}
        loading={loading}
        promptDbMap={promptDbMap}
        onPromptDeleted={fetchPrompts}
      />
      <Footer />
    </main>
  )
}
