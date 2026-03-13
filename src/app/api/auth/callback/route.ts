import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Google/GitHub OAuth donus noktasi.
// Kullanici provider'dan onay verdikten sonra buraya yonlendirilir.
// URL'deki `code` parametresi ile gercek oturum acilir.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    // code'u Supabase'e vererek session olustur
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Basarili giris → kullaniciyi yonlendir
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Hata durumunda ana sayfaya yonlendir
  return NextResponse.redirect(`${origin}/tr`)
}
