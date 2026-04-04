'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/components/providers/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import type { Prompt } from '@/types/database'
import styles from '../../new/new.module.css'

const CATEGORIES = ['Art', 'Business', 'Design', 'Food', 'Homework', 'Instagram', 'Linkedin', 'Math', 'Photography', 'Software']
const AI_TOOLS = [
  { value: 'chatgpt', label: 'ChatGPT' },
  { value: 'gemini', label: 'Gemini' },
  { value: 'midjourney', label: 'Midjourney' },
]

export default function EditPromptPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const locale = useLocale()
  const params = useParams()
  const promptId = params.id as string
  const t = useTranslations('promptNew')
  const tEdit = useTranslations('promptEdit')

  const [prompt, setPrompt] = useState<Prompt | null>(null)
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPrompt() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('id', promptId)
        .single()

      if (error || !data) {
        router.push(`/${locale}`)
        return
      }

      // Sadece sahibi duzenleyebilir
      if (user && data.user_id !== user.id) {
        router.push(`/${locale}/prompts/${promptId}`)
        return
      }

      setPrompt(data)
      setTitle(data.title)
      setDescription(data.description)
      setPromptText(data.prompt_text)
      setCategory(data.category)
      setAiTool(data.ai_tool || '')
      setTags(data.tags?.join(', ') || '')
      setIsPublic(data.is_public)
      if (data.image_url) {
        setImageUrl(data.image_url)
        setImagePreview(data.image_url)
      }
      setLoading(false)
    }

    if (!authLoading && !user) {
      router.push(`/${locale}/login`)
      return
    }

    if (user) {
      fetchPrompt()
    }
  }, [promptId, user, authLoading, router, locale])

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
    if (!user || !prompt) return
    setError('')
    setSubmitting(true)

    try {
      const supabase = createClient()
      const parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean)

      let finalImageUrl: string | null = prompt.image_url

      // Yeni dosya yukleme
      if (imageMode === 'upload' && imageFile) {
        if (imageFile.size > 5 * 1024 * 1024) {
          setError(t('imageUploadError') + ' (Max 5MB)')
          setSubmitting(false)
          return
        }

        const fileExt = imageFile.name.split('.').pop()
        const filePath = `prompts/${user.id}/${Date.now()}.${fileExt}`

        try {
          const { error: uploadError } = await supabase.storage
            .from('prompt-images')
            .upload(filePath, imageFile, {
              cacheControl: '3600',
              upsert: false,
            })

          if (!uploadError) {
            const { data: publicUrlData } = supabase.storage
              .from('prompt-images')
              .getPublicUrl(filePath)
            finalImageUrl = publicUrlData.publicUrl
          }
        } catch {
          // Upload basarisiz olsa da guncellemeye devam et
        }
      } else if (imageMode === 'url' && imageUrl.trim()) {
        finalImageUrl = imageUrl.trim()
      }

      const { error: updateError } = await supabase
        .from('prompts')
        .update({
          title: title.trim(),
          description: description.trim(),
          prompt_text: promptText.trim(),
          category,
          ai_tool: (aiTool as 'chatgpt' | 'gemini' | 'midjourney') || null,
          image_url: finalImageUrl,
          tags: parsedTags,
          is_public: isPublic,
        })
        .eq('id', prompt.id)

      setSubmitting(false)

      if (updateError) {
        console.error('Update error:', updateError)
        setError(`${tEdit('error')} (${updateError.message})`)
      } else {
        setSuccess(true)
        setTimeout(() => router.push(`/${locale}/prompts/${prompt.id}`), 1500)
      }
    } catch (err) {
      console.error('Submit error:', err)
      setSubmitting(false)
      setError(`${tEdit('error')} (${err instanceof Error ? err.message : 'Unknown error'})`)
    }
  }

  if (loading || authLoading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingDot} />
      </div>
    )
  }

  return (
    <main className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href={`/${locale}/prompts/${promptId}`} className={styles.backBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            {tEdit('backToPrompt')}
          </Link>
          <h1 className={styles.title}>{tEdit('title')}</h1>
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
          {success && <p className={styles.success}>{tEdit('saved')}</p>}

          <button type="submit" className={styles.submitBtn} disabled={submitting}>
            {submitting ? tEdit('saving') : tEdit('save')}
          </button>
        </form>
      </div>
    </main>
  )
}
