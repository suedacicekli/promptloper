import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

// next-intl middleware'i olustur
const intlMiddleware = createIntlMiddleware(routing)

// Supabase auth token'ini her istekte yeniler (refresh).
// Bu olmazsa kullanicinin oturumu beklenmedik sekilde kapanabilir.
async function updateSupabaseSession(request: NextRequest, response: NextResponse) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Oncelikle request'e cookie'leri yaz (sonraki middleware'ler icin)
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          // Sonra response'a yaz (tarayiciya gonderilecek)
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // getUser() cagrisi token'i dogrular ve gerekirse yeniler.
  // Bu cagri olmadan cookie'deki token expire olabilir.
  await supabase.auth.getUser()
}

export default async function middleware(request: NextRequest) {
  // 1. Once next-intl middleware'ini calistir (locale routing)
  const response = intlMiddleware(request)

  // 2. Sonra Supabase auth session'ini yenile
  await updateSupabaseSession(request, response)

  return response
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
