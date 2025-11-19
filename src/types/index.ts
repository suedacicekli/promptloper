export type AITool = 'chatgpt' | 'gemini' | 'midjourney'

export interface PromptData {
  id: string
  category: string
  title: string
  description: string
  prompt: string
  imageSrc: string
  tags?: string[]
  aiTool?: AITool
  height?: number
  sourceUrl?: string
  contributor?: {
    name: string
    email: string
  }
}

export interface Prompt {
  id: string
  category: string
  title: string
  content: string
  tags: string[]
  author: string
  likes: number
  aiTool?: AITool
}

export interface Category {
  id: string
  name: string
  description: string
  icon?: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}
