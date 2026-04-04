import { PromptData } from '@/types'
import type { Prompt } from '@/types/database'

/**
 * Supabase prompt verisini PromptData formatina cevirir.
 * PromptGrid ve TrendingCard componentleri bu formati bekliyor.
 */
export function dbPromptToPromptData(dbPrompt: Prompt): PromptData {
  return {
    id: dbPrompt.source_id || dbPrompt.id,
    category: dbPrompt.category,
    title: dbPrompt.title,
    description: dbPrompt.description,
    prompt: dbPrompt.prompt_text,
    imageSrc: dbPrompt.image_url || '',
    tags: dbPrompt.tags || [],
    aiTool: dbPrompt.ai_tool || undefined,
  }
}
