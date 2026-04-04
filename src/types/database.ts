// Supabase veritabani tipleri
// Supabase CLI kurulduktan sonra otomatik generate edilecek:
//   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
//
// Su an elle tanimliyoruz, ileride otomatik uretilen ile degistirilecek.

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          bio?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      prompts: {
        Row: {
          id: string
          user_id: string | null
          title: string
          description: string
          prompt_text: string
          category: string
          ai_tool: 'chatgpt' | 'gemini' | 'midjourney' | null
          image_url: string | null
          tags: string[]
          is_public: boolean
          is_trending: boolean
          source_id: string | null
          like_count: number
          copy_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          description: string
          prompt_text: string
          category: string
          ai_tool?: 'chatgpt' | 'gemini' | 'midjourney' | null
          image_url?: string | null
          tags?: string[]
          is_public?: boolean
          is_trending?: boolean
          source_id?: string | null
          like_count?: number
          copy_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          description?: string
          prompt_text?: string
          category?: string
          ai_tool?: 'chatgpt' | 'gemini' | 'midjourney' | null
          image_url?: string | null
          tags?: string[]
          is_public?: boolean
          is_trending?: boolean
          source_id?: string | null
          like_count?: number
          copy_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          prompt_id: string // TEXT - JSON prompt ID'leri destekler (ör: "prompt-1")
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          prompt_id: string // TEXT - UUID veya string ID kabul eder
          created_at?: string
        }
        Update: {
          user_id?: string
          prompt_id?: string
        }
        Relationships: []
      }
      prompt_likes: {
        Row: {
          id: string
          user_id: string
          prompt_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          prompt_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          prompt_id?: string
        }
        Relationships: []
      }
      ai_generations: {
        Row: {
          id: string
          user_id: string
          prompt_id: string | null
          ai_provider: string
          input_tokens: number
          output_tokens: number
          result: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          prompt_id?: string | null
          ai_provider: string
          input_tokens: number
          output_tokens: number
          result: string
          created_at?: string
        }
        Update: {
          ai_provider?: string
          input_tokens?: number
          output_tokens?: number
          result?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      ai_tool_type: 'chatgpt' | 'gemini' | 'midjourney'
    }
  }
}

// Kolay erisim icin yardimci tipler
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Prompt = Database['public']['Tables']['prompts']['Row']
export type PromptInsert = Database['public']['Tables']['prompts']['Insert']
export type PromptUpdate = Database['public']['Tables']['prompts']['Update']
export type Favorite = Database['public']['Tables']['favorites']['Row']
export type PromptLike = Database['public']['Tables']['prompt_likes']['Row']
export type AIGeneration = Database['public']['Tables']['ai_generations']['Row']
