'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/types/database'

interface AuthContextType {
  user: User | null          // Supabase auth kullanicisi (email, id)
  profile: Profile | null    // Bizim profiles tablosundaki ekstra bilgiler (bio, avatar)
  loading: boolean           // Ilk yukleme durumu
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
})

// Bu hook ile herhangi bir componentten auth durumuna erisebilirsin:
// const { user, profile, loading, signOut } = useAuth()
export function useAuth() {
  return useContext(AuthContext)
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  // Profil bilgilerini veritabanindan cek
  async function fetchProfile(userId: string) {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      setProfile(data)
    } catch {
      // Profil bulunamazsa null kalir
    }
  }

  useEffect(() => {
    // 1. Sayfa yuklendiginde mevcut oturumu kontrol et
    async function getInitialSession() {
      try {
        // Once session kontrol et (getUser network calisi yapar, getSession local cache'den okur)
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
          setUser(session.user)
          await fetchProfile(session.user.id)
        } else {
          // Session yoksa getUser ile de dene (cookie'den)
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            setUser(user)
            await fetchProfile(user.id)
          }
        }
      } catch {
        // Sessizce devam et
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // 2. Auth durumu degistiginde (giris/cikis) otomatik guncelle
    // Bu listener login, logout, token refresh gibi olaylari dinler
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          const currentUser = session?.user ?? null
          setUser(currentUser)

          if (currentUser) {
            await fetchProfile(currentUser.id)
          } else {
            setProfile(null)
          }
        } catch {
          // Sessizce devam et
        } finally {
          setLoading(false)
        }
      }
    )

    // Component unmount olunca listener'i temizle (memory leak onleme)
    return () => subscription.unsubscribe()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Cikis yap fonksiyonu
  async function signOut() {
    try {
      await supabase.auth.signOut({ scope: 'local' })
    } catch {
      // signOut hatasi olsa bile devam et
    }

    // State'i temizle
    setUser(null)
    setProfile(null)

    // Sayfayi yenile — cookie'lerin temizlenmesi icin
    const locale = window.location.pathname.split('/')[1] || 'tr'
    window.location.href = `/${locale}`
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
