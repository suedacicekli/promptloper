'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/components/providers/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import styles from './new.module.css'

const CATEGORIES = ['Art', 'Business', 'Design', 'Food', 'Homework', 'Instagram', 'Math', 'Photography', 'Software']
const AI_TOOLS = [
  { value: 'chatgpt', label: 'ChatGPT' },
  { value: 'gemini', label: 'Gemini' },
  { value: 'midjourney', label: 'Midjourney' },
]

export default function NewPromptPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('promptNew')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [promptText, setPromptText] = useState('')
  const [category, setCategory] = useState('')
  const [aiTool, setAiTool] = useState('')
  const [tags, setTags] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url')
  const [isPublic, setIsPublic] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/${locale}/login`)
    }
  }, [user, loading, router, locale])

  if (loading || !user) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingDot} />
      </div>
    )
  }

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url)
    setImagePreview(url)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setError('')
    setSubmitting(true)

    try {
      const supabase = createClient()
      const parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean)

      let finalImageUrl: string | null = null

      // Dosya yükleme
      if (imageMode === 'upload' && imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const filePath = `prompts/${user.id}/${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('prompt-images')
          .upload(filePath, imageFile, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) {
          console.error('Upload error:', uploadError)
          setError(`${t('imageUploadError')} (${uploadError.message})`)
          setSubmitting(false)
          return
        }

        const { data: publicUrlData } = supabase.storage
          .from('prompt-images')
          .getPublicUrl(filePath)

        finalImageUrl = publicUrlData.publicUrl
      } else if (imageMode === 'url' && imageUrl.trim()) {
        finalImageUrl = imageUrl.trim()
      }

      const insertPromise = supabase.from('prompts').insert({
        user_id: user.id,
        title: title.trim(),
        description: description.trim(),
        prompt_text: promptText.trim(),
        category,
        ai_tool: (aiTool as 'chatgpt' | 'gemini' | 'midjourney') || null,
        image_url: finalImageUrl,
        tags: parsedTags,
        is_public: isPublic,
      })

      // 10 saniye timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), 10000)
      )

      const { error: insertError } = await Promise.race([insertPromise, timeoutPromise]) as Awaited<typeof insertPromise>

      setSubmitting(false)

      if (insertError) {
        console.error('Insert error:', insertError)
        setError(`${t('error')} (${insertError.message})`)
      } else {
        setSuccess(true)
        setTimeout(() => router.push(`/${locale}/profile`), 1500)
      }
    } catch (err) {
      console.error('Submit error:', err)
      setSubmitting(false)
      setError(`${t('error')} (${err instanceof Error ? err.message : 'Unknown error'})`)
    }
  }

  return (
    <main className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href={`/${locale}`} className={styles.backBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            {t('backToHome')}
          </Link>
          <h1 className={styles.title}>{t('title')}</h1>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>{t('promptTitle')}</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={t('promptTitlePlaceholder')}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>{t('description')}</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder={t('descriptionPlaceholder')}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>{t('promptText')}</label>
            <textarea
              value={promptText}
              onChange={e => setPromptText(e.target.value)}
              placeholder={t('promptTextPlaceholder')}
              className={styles.textarea}
              rows={6}
              required
            />
          </div>

          {/* Resim Alanı */}
          <div className={styles.field}>
            <label className={styles.label}>{t('image')}</label>
            <div className={styles.imageToggle}>
              <button
                type="button"
                className={`${styles.imageToggleBtn} ${imageMode === 'url' ? styles.imageToggleBtnActive : ''}`}
                onClick={() => setImageMode('url')}
              >
                {t('imageUrl')}
              </button>
              <button
                type="button"
                className={`${styles.imageToggleBtn} ${imageMode === 'upload' ? styles.imageToggleBtnActive : ''}`}
                onClick={() => setImageMode('upload')}
              >
                {t('imageUpload')}
              </button>
            </div>

            {imageMode === 'url' ? (
              <input
                type="url"
                value={imageUrl}
                onChange={e => handleImageUrlChange(e.target.value)}
                placeholder={t('imageUrlPlaceholder')}
                className={styles.input}
              />
            ) : (
              <label className={styles.uploadArea}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className={styles.fileInput}
                />
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span>{imageFile ? imageFile.name : t('imageUploadHint')}</span>
              </label>
            )}

            {imagePreview && (
              <div className={styles.imagePreview}>
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>{t('category')}</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className={styles.select}
                required
              >
                <option value="">{t('selectCategory')}</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>{t('aiTool')}</label>
              <select
                value={aiTool}
                onChange={e => setAiTool(e.target.value)}
                className={styles.select}
              >
                <option value="">{t('selectAiTool')}</option>
                {AI_TOOLS.map(tool => (
                  <option key={tool.value} value={tool.value}>{tool.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>{t('tags')}</label>
            <input
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder={t('tagsPlaceholder')}
              className={styles.input}
            />
            <span className={styles.hint}>{t('tagsHint')}</span>
          </div>

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={e => setIsPublic(e.target.checked)}
              className={styles.checkbox}
            />
            <span>{t('isPublic')}</span>
          </label>

          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{t('success')}</p>}

          <button type="submit" className={styles.submitBtn} disabled={submitting}>
            {submitting ? t('submitting') : t('submit')}
          </button>
        </form>
      </div>
    </main>
  )
}
