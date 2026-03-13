import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

// Server-side (Server Components, API Routes, Server Actions) icin Supabase client
// Cookie'ler uzerinden kullanici oturumunu yonetir
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component'ten cagirildiginda set yapilamaz, sorun degil.
            // Middleware veya Server Action'dan cagrilirsa calisir.
          }
        },
      },
    }
  )
}
