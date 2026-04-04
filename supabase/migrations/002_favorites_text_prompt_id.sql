-- =============================================
-- FAVORITES & PROMPT_LIKES: prompt_id UUID -> TEXT
-- =============================================
-- Neden? Promptlar henuz veritabaninda degil, JSON dosyasindan okunuyor.
-- JSON'daki ID'ler "prompt-1", "prompt-2" formatinda (UUID degil).
-- Foreign key constraint ve UUID tipi insert'lerin basarisiz olmasina neden oluyor.
-- Promptlar veritabanina migrate edildiginde (Faz 4) bu tekrar UUID'ye cevrilebilir.

-- 1. FAVORITES tablosundaki foreign key ve unique constraint'i kaldir
ALTER TABLE public.favorites DROP CONSTRAINT IF EXISTS favorites_prompt_id_fkey;
ALTER TABLE public.favorites DROP CONSTRAINT IF EXISTS favorites_user_id_prompt_id_key;

-- prompt_id kolonunu TEXT'e cevir
ALTER TABLE public.favorites ALTER COLUMN prompt_id TYPE text USING prompt_id::text;

-- unique constraint'i tekrar ekle
ALTER TABLE public.favorites ADD CONSTRAINT favorites_user_id_prompt_id_key UNIQUE(user_id, prompt_id);

-- 2. PROMPT_LIKES tablosundaki foreign key ve unique constraint'i kaldir
ALTER TABLE public.prompt_likes DROP CONSTRAINT IF EXISTS prompt_likes_prompt_id_fkey;
ALTER TABLE public.prompt_likes DROP CONSTRAINT IF EXISTS prompt_likes_user_id_prompt_id_key;

-- prompt_id kolonunu TEXT'e cevir
ALTER TABLE public.prompt_likes ALTER COLUMN prompt_id TYPE text USING prompt_id::text;

-- unique constraint'i tekrar ekle
ALTER TABLE public.prompt_likes ADD CONSTRAINT prompt_likes_user_id_prompt_id_key UNIQUE(user_id, prompt_id);

-- 3. AI_GENERATIONS tablosundaki foreign key'i de kaldir (opsiyonel ama tutarli olsun)
ALTER TABLE public.ai_generations DROP CONSTRAINT IF EXISTS ai_generations_prompt_id_fkey;
ALTER TABLE public.ai_generations ALTER COLUMN prompt_id TYPE text USING prompt_id::text;
