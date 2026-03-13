import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { routing } from './routing'
import tr from '../../messages/tr.json'
import en from '../../messages/en.json'

// Cloudflare Edge'de dinamik import calismayabiliyor,
// bu yuzden mesajlari statik olarak import ediyoruz.
const messages = { tr, en }

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale

  return {
    locale,
    messages: messages[locale as keyof typeof messages]
  }
})
