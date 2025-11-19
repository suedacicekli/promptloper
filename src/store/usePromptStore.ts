import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface Prompt {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  author: string
  createdAt: Date
  likes: number
}

interface PromptState {
  prompts: Prompt[]
  selectedCategory: string | null
  searchQuery: string

  setPrompts: (prompts: Prompt[]) => void
  addPrompt: (prompt: Prompt) => void
  removePrompt: (id: string) => void
  updatePrompt: (id: string, updates: Partial<Prompt>) => void
  setSelectedCategory: (category: string | null) => void
  setSearchQuery: (query: string) => void
  getFilteredPrompts: () => Prompt[]
}

export const usePromptStore = create<PromptState>()(
  devtools(
    persist(
      (set, get) => ({
        prompts: [],
        selectedCategory: null,
        searchQuery: '',

        setPrompts: (prompts) => set({ prompts }),

        addPrompt: (prompt) =>
          set((state) => ({
            prompts: [...state.prompts, prompt],
          })),

        removePrompt: (id) =>
          set((state) => ({
            prompts: state.prompts.filter((p) => p.id !== id),
          })),

        updatePrompt: (id, updates) =>
          set((state) => ({
            prompts: state.prompts.map((p) =>
              p.id === id ? { ...p, ...updates } : p
            ),
          })),

        setSelectedCategory: (category) => set({ selectedCategory: category }),

        setSearchQuery: (query) => set({ searchQuery: query }),

        getFilteredPrompts: () => {
          const { prompts, selectedCategory, searchQuery } = get()

          return prompts.filter((prompt) => {
            const matchesCategory = !selectedCategory || prompt.category === selectedCategory
            const matchesSearch = !searchQuery ||
              prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              prompt.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
              prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

            return matchesCategory && matchesSearch
          })
        },
      }),
      {
        name: 'prompt-storage',
      }
    )
  )
)
