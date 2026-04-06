'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/types/database'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    // Profil bilgilerini cek
    async function fetchProfile(userId: string) {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle()
        setProfile(data)
      } catch {
        // ignore
      }
    }

    // 1. Mevcut oturumu kontrol et
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) {
        fetchProfile(currentUser.id).finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    }).catch(() => {
      setLoading(false)
    })

    // 2. Auth degisikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null
        setUser(currentUser)
        if (currentUser) {
          await fetchProfile(currentUser.id)
        } else {
          setProfile(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Cikis yap
  async function signOut() {
    // State temizle
    setUser(null)
    setProfile(null)

    // Supabase session cookie'lerini temizle
    document.cookie.split(';').forEach(cookie => {
      const name = cookie.split('=')[0].trim()
      if (name.startsWith('sb-') || name.includes('supabase')) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
      }
    })

    // Supabase signOut'u beklemeden baslat
    const supabase = createClient()
    supabase.auth.signOut({ scope: 'local' }).catch(() => {})

    // Local storage'daki session'i da temizle
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('sb-') || key.includes('supabase')) {
        localStorage.removeItem(key)
      }
    })

    // Redirect
    const locale = window.location.pathname.split('/')[1] || 'tr'
    window.location.href = `/${locale}`
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
