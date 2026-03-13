-- =============================================
-- PROMPTLOPER VERITABANI SEMASI
-- =============================================
-- Bu dosyayi Supabase Dashboard > SQL Editor'de calistir
-- veya Supabase CLI ile: supabase db push

-- 1. PROFILES TABLOSU
-- Neden ayri bir tablo? Supabase Auth kendi `auth.users` tablosunu yonetir
-- ama biz kullaniciya ait ekstra bilgileri (bio, avatar) burada tutuyoruz.
-- `id` alani auth.users.id ile birebir eslesiyor (foreign key).
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  name text,
  avatar_url text,
  bio text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 2. PROMPTS TABLOSU
-- Ana icerik tablosu. Kullanicilarin paylastigi promptlar burada.
create table if not exists public.prompts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text not null,
  prompt_text text not null,
  category text not null,
  ai_tool text check (ai_tool in ('chatgpt', 'gemini', 'midjourney')),
  image_url text,
  tags text[] default '{}',
  is_public boolean default true,
  like_count integer default 0,
  copy_count integer default 0,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 3. FAVORITES TABLOSU
-- Kullanici-prompt iliskisi (many-to-many).
-- unique constraint: bir kullanici ayni prompti 2 kez favoriye ekleyemez.
create table if not exists public.favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  prompt_id uuid references public.prompts(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  unique(user_id, prompt_id)
);

-- 4. PROMPT LIKES TABLOSU
-- Begeni sistemi. Favorites ile ayni mantik ama farkli amac:
-- Favori = "sonra bakarim", Like = "bu iyiymis"
create table if not exists public.prompt_likes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  prompt_id uuid references public.prompts(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  unique(user_id, prompt_id)
);

-- 5. AI GENERATIONS TABLOSU
-- Kullanicilarin AI ile yaptigi uretim gecmisi.
-- Token kullanimi takibi icin input/output_tokens alanlari var.
create table if not exists public.ai_generations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  prompt_id uuid references public.prompts(id) on delete set null,
  ai_provider text not null,
  input_tokens integer default 0,
  output_tokens integer default 0,
  result text not null,
  created_at timestamptz default now() not null
);

-- =============================================
-- INDEXLER (Performans)
-- =============================================
-- Neden index? WHERE ve JOIN sorgularinda kullanilan kolonlara index eklemek
-- sorgu hizini dramatik sekilde arttirir (ozellikle veri buyudukce).

create index if not exists idx_prompts_user_id on public.prompts(user_id);
create index if not exists idx_prompts_category on public.prompts(category);
create index if not exists idx_prompts_created_at on public.prompts(created_at desc);
create index if not exists idx_prompts_is_public on public.prompts(is_public);
create index if not exists idx_favorites_user_id on public.favorites(user_id);
create index if not exists idx_favorites_prompt_id on public.favorites(prompt_id);
create index if not exists idx_prompt_likes_user_id on public.prompt_likes(user_id);
create index if not exists idx_prompt_likes_prompt_id on public.prompt_likes(prompt_id);
create index if not exists idx_ai_generations_user_id on public.ai_generations(user_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================
-- Neden RLS? Supabase'de anon key public'tir. RLS olmadan herkes her seyi
-- okuyup yazabilir. RLS ile "kim neyi gorebilir/degistirebilir" kurallarini
-- veritabani seviyesinde tanimliyoruz. API'den bypass edilemez.

-- RLS'i aktif et
alter table public.profiles enable row level security;
alter table public.prompts enable row level security;
alter table public.favorites enable row level security;
alter table public.prompt_likes enable row level security;
alter table public.ai_generations enable row level security;

-- PROFILES politikalari
-- Herkes profil okuyabilir (public profiller)
create policy "Profiller herkese acik" on public.profiles
  for select using (true);

-- Kullanici sadece kendi profilini guncelleyebilir
create policy "Kullanici kendi profilini guncelleyebilir" on public.profiles
  for update using (auth.uid() = id);

-- PROMPTS politikalari
-- Herkes public promptlari gorebilir
create policy "Public promptlar herkese acik" on public.prompts
  for select using (is_public = true);

-- Kullanici kendi private promptlarini gorebilir
create policy "Kullanici kendi promptlarini gorebilir" on public.prompts
  for select using (auth.uid() = user_id);

-- Giris yapmis kullanici prompt ekleyebilir
create policy "Giris yapmis kullanici prompt ekleyebilir" on public.prompts
  for insert with check (auth.uid() = user_id);

-- Kullanici sadece kendi promptini guncelleyebilir
create policy "Kullanici kendi promptunu guncelleyebilir" on public.prompts
  for update using (auth.uid() = user_id);

-- Kullanici sadece kendi promptunu silebilir
create policy "Kullanici kendi promptunu silebilir" on public.prompts
  for delete using (auth.uid() = user_id);

-- FAVORITES politikalari
create policy "Kullanici kendi favorilerini gorebilir" on public.favorites
  for select using (auth.uid() = user_id);

create policy "Kullanici favori ekleyebilir" on public.favorites
  for insert with check (auth.uid() = user_id);

create policy "Kullanici favori silebilir" on public.favorites
  for delete using (auth.uid() = user_id);

-- PROMPT_LIKES politikalari
create policy "Like'lar herkese acik" on public.prompt_likes
  for select using (true);

create policy "Kullanici like ekleyebilir" on public.prompt_likes
  for insert with check (auth.uid() = user_id);

create policy "Kullanici like silebilir" on public.prompt_likes
  for delete using (auth.uid() = user_id);

-- AI_GENERATIONS politikalari
create policy "Kullanici kendi uretimlerini gorebilir" on public.ai_generations
  for select using (auth.uid() = user_id);

create policy "Kullanici uretim yapabilir" on public.ai_generations
  for insert with check (auth.uid() = user_id);

-- =============================================
-- TRIGGER: Yeni kullanici kaydolunca profil olustur
-- =============================================
-- Neden? Supabase Auth yeni kullanici olusturdugunda auth.users'a yazar.
-- Biz de otomatik olarak profiles tablosuna bir kayit olusturuyoruz.
-- Boylece kullanicinin ekstra islem yapmasina gerek kalmaz.

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger: auth.users'a INSERT olunca handle_new_user cagirilir
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================
-- TRIGGER: updated_at otomatik guncelleme
-- =============================================
-- Neden? Her UPDATE'de updated_at'i elle set etmek yerine,
-- trigger ile otomatik guncelliyoruz. Boylece unutma riski yok.

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger set_updated_at_profiles
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create or replace trigger set_updated_at_prompts
  before update on public.prompts
  for each row execute procedure public.handle_updated_at();
