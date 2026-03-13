import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

// Simdilik sadece next-intl middleware.
// Supabase auth token yenilemesi client-side'da AuthProvider uzerinden yapiliyor.
// Cloudflare Edge'de Supabase middleware uyumsuzlugu cozulunce geri eklenecek.
export default createMiddleware(routing)

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
