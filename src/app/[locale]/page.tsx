'use client'

import { useState, useMemo } from 'react'
import Navbar from '@/components/Navbar'
import TrendingSection from '@/components/TrendingSection'
import CategoryFilter from '@/components/CategoryFilter'
import SearchInput from '@/components/SearchInput'
import PromptGrid from '@/components/PromptGrid'
import Footer from '@/components/Footer'
import { PromptData } from '@/types'
import allPromptsData from '../../../public/data/all-prompts.json'

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const allPrompts = allPromptsData as PromptData[]

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
      <PromptGrid prompts={filteredPrompts} />
      <Footer />
    </main>
  )
}
