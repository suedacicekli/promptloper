-- =============================================
-- SEED DATA DESTEGI
-- =============================================
-- Neden? JSON'daki statik promptlari veritabanina migrate etmek icin:
-- 1. user_id nullable olmali (sistem promptlarinin sahibi yok)
-- 2. is_trending alani trending promptlari isaretlemek icin
-- 3. source_id alani JSON'daki orijinal ID'yi saklamak icin (favori uyumlulugu)

-- user_id'yi nullable yap (seed promptlarin sahibi olmayacak)
ALTER TABLE public.prompts ALTER COLUMN user_id DROP NOT NULL;

-- is_trending kolonu ekle
ALTER TABLE public.prompts ADD COLUMN IF NOT EXISTS is_trending boolean DEFAULT false;

-- source_id kolonu ekle (JSON'daki "prompt-1", "trend-1" gibi ID'ler)
ALTER TABLE public.prompts ADD COLUMN IF NOT EXISTS source_id text;
CREATE UNIQUE INDEX IF NOT EXISTS idx_prompts_source_id ON public.prompts(source_id) WHERE source_id IS NOT NULL;

-- RLS: user_id null olan (seed) promptlari da herkes gorebilsin
-- Mevcut policy zaten is_public=true kontrolu yapiyor, user_id null olsa da calisiyor
