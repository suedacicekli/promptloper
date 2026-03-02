# Cloudflare Deployment Kılavuzu

Promptloper projesini Cloudflare Pages üzerinde yayına almak için adım adım rehber.

## 📋 Gereksinimler

- Node.js 18.x veya üzeri
- npm veya yarn
- Git (versiyon kontrolü için)
- Cloudflare hesabı (ücretsiz: https://dash.cloudflare.com/sign-up)

## 🚀 Hızlı Başlangıç (3 Adım)

### Adım 1: Bağımlılıkları Yükleyin

```bash
npm install
```

Bu komut aşağıdaki Cloudflare paketlerini yükleyecek:
- `@cloudflare/next-on-pages` - Next.js'i Cloudflare Pages için dönüştürür
- `wrangler` - Cloudflare CLI aracı

### Adım 2: Projeyi Build Edin

```bash
npm run pages:build
```

Bu komut Next.js uygulamanızı Cloudflare Pages için optimize edilmiş hale getirecek.

### Adım 3: Cloudflare'e Deploy Edin

İki yöntem var: **Otomatik (GitHub)** veya **Manuel (Wrangler CLI)**

---

## 🔄 Yöntem 1: Otomatik Deployment (GitHub - ÖNERİLEN)

Bu yöntem her Git push'unda otomatik deployment sağlar.

### 1. GitHub Repository Oluşturun

```bash
# Eğer henüz remote repository eklemediyseniz:
git remote add origin https://github.com/KULLANICI_ADINIZ/promptloper.git
git branch -M main
git push -u origin main
```

### 2. Cloudflare Dashboard'a Gidin

1. https://dash.cloudflare.com adresine gidin
2. Sol menüden **"Workers & Pages"** seçin
3. **"Create application"** butonuna tıklayın
4. **"Pages"** sekmesine geçin
5. **"Connect to Git"** seçeneğini seçin

### 3. GitHub Repository'nizi Bağlayın

1. GitHub hesabınızı Cloudflare'e bağlayın
2. `promptloper` repository'sini seçin
3. **"Begin setup"** butonuna tıklayın

### 4. Build Ayarlarını Yapın

Cloudflare otomatik olarak Next.js algılayacak, ancak aşağıdaki ayarları doğrulayın:

```
Framework preset: Next.js
Build command: npm run pages:build
Build output directory: .vercel/output/static
Root directory: (boş bırakın)
```

**Environment variables (Opsiyonel):**
- `NODE_VERSION`: `18` (Cloudflare otomatik algılar, .node-version dosyasından)

### 5. Deploy Edin!

1. **"Save and Deploy"** butonuna tıklayın
2. Build işlemini izleyin (2-3 dakika sürer)
3. Deployment tamamlandığında Cloudflare size bir URL verecek: `https://promptloper-xxx.pages.dev`

### 6. Custom Domain Ekleyin (Opsiyonel)

1. Cloudflare Pages project sayfasında **"Custom domains"** sekmesine gidin
2. **"Set up a custom domain"** butonuna tıklayın
3. Domain adınızı girin (örn: `promptloper.com`)
4. Cloudflare DNS kayıtlarını otomatik ayarlayacak

✅ **Artık her `git push` yaptığınızda Cloudflare otomatik deploy edecek!**

---

## ⚡ Yöntem 2: Manuel Deployment (Wrangler CLI)

Bu yöntem terminal üzerinden hızlı deployment için kullanılır.

### 1. Wrangler'ı Kurulumu Doğrulayın

```bash
npx wrangler --version
```

### 2. Cloudflare'e Login Olun

```bash
npx wrangler login
```

Bu komut tarayıcınızı açacak ve Cloudflare hesabınıza giriş yapmanızı isteyecek.

### 3. İlk Deployment

```bash
npm run deploy
```

Bu komut:
1. Projeyi build eder (`npm run pages:build`)
2. Cloudflare Pages'e deploy eder
3. Size deployment URL'i verir

### 4. Sonraki Deployment'lar

Her değişiklikten sonra:

```bash
npm run deploy
```

---

## 🔧 Yerel Test (Production Benzeri Ortam)

Cloudflare Workers runtime'ında yerel olarak test etmek için:

```bash
npm run preview
```

Bu komut:
1. Projeyi build eder
2. Yerel Cloudflare Workers ortamında çalıştırır
3. `http://localhost:8788` adresinde açar

---

## 📝 Yeni Eklenen Dosyalar

### 1. `.node-version`
```
18.17.0
```
Cloudflare'e hangi Node.js versiyonunu kullanacağını söyler.

### 2. `wrangler.toml`
```toml
name = "promptloper"
compatibility_date = "2024-01-01"
pages_build_output_dir = ".vercel/output/static"
```
Cloudflare Pages yapılandırması.

### 3. `package.json` (Güncellemeler)
```json
"scripts": {
  "pages:build": "npx @cloudflare/next-on-pages",
  "preview": "npm run pages:build && wrangler pages dev",
  "deploy": "npm run pages:build && wrangler pages deploy"
}
```

Yeni komutlar:
- `npm run pages:build` - Cloudflare için build
- `npm run preview` - Yerel Cloudflare ortamında test
- `npm run deploy` - Cloudflare'e deploy

---

## 🎯 Hangi Yöntemi Seçmeliyim?

| Özellik | GitHub (Otomatik) | Wrangler (Manuel) |
|---------|-------------------|-------------------|
| Otomatik deployment | ✅ Her push'da | ❌ Manuel |
| Kurulum kolaylığı | 🟡 Orta | 🟢 Kolay |
| CI/CD entegrasyonu | ✅ Var | ❌ Yok |
| Hız | 🟡 2-3 dakika | 🟢 1-2 dakika |
| Preview deployments | ✅ Her PR için | ❌ Yok |
| Önerilen | ✅ Üretim için | 🟡 Test için |

**Öneri:** Production için **GitHub (Otomatik)**, hızlı test için **Wrangler (Manuel)** kullanın.

---

## ⚙️ Gelişmiş Yapılandırma

### Environment Variables Ekleme

#### GitHub Method:
1. Cloudflare Dashboard → Pages → Projeniz → Settings → Environment variables
2. Değişkeni ekleyin (örn: `FORMSPREE_ENDPOINT`)
3. Production ve Preview için ayrı ayrı ayarlayabilirsiniz

#### Wrangler Method:
`.dev.vars` dosyası oluşturun (root dizinde):
```env
FORMSPREE_ENDPOINT=https://formspree.io/f/YOUR_FORM_ID
```

**⚠️ Önemli:** `.dev.vars` dosyası `.gitignore`'da, Git'e pushlama!

### Custom Headers Ekleme

`wrangler.toml` dosyasına ekleyin:

```toml
[[headers]]
for = "/*"

[headers.values]
X-Frame-Options = "DENY"
X-Content-Type-Options = "nosniff"
Referrer-Policy = "strict-origin-when-cross-origin"
```

### Redirect Kuralları

`public/_redirects` dosyası oluşturun:

```
/old-path /new-path 301
/blog/* /news/:splat 302
```

---

## 🐛 Sorun Giderme

### Build Hatası: "Module not found"

```bash
# Önce node_modules'ı temizleyin
rm -rf node_modules package-lock.json
npm install
npm run pages:build
```

### Deploy Hatası: "Wrangler not authenticated"

```bash
npx wrangler logout
npx wrangler login
```

### Görsel (Image) Yükleme Sorunları

Next.js Image Optimization Cloudflare'de farklı çalışır. `next.config.js` zaten yapılandırıldı:

```js
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',
    },
  ],
}
```

### Build Çok Yavaş

`wrangler.toml` dosyasına ekleyin:

```toml
[build]
command = "npm run pages:build"
cwd = ""
watch_dirs = ["src", "public"]
```

---

## 📊 Deployment Sonrası

### 1. Analytics Aktifleştirin

Cloudflare Dashboard → Pages → Projeniz → Analytics

Ücretsiz olarak şunları görürsünüz:
- Ziyaretçi sayısı
- Sayfa görüntülemeleri
- Coğrafi dağılım
- Performance metrics

### 2. Custom Domain Ekleyin

1. Cloudflare Pages → Custom domains
2. Domain ekleyin
3. DNS ayarlarını doğrulayın (otomatik)

### 3. SSL/TLS Otomatik Aktif

Cloudflare otomatik olarak SSL sertifikası sağlar (Let's Encrypt).

---

## 🚀 Performans Optimizasyonları

Cloudflare Pages otomatik olarak şunları yapar:

- ✅ Global CDN dağıtımı (300+ veri merkezi)
- ✅ Automatic caching
- ✅ Brotli compression
- ✅ HTTP/3 support
- ✅ DDoS protection
- ✅ SSL/TLS encryption

---

## 💰 Maliyet

**Cloudflare Pages ücretsiz plan:**
- ✅ Unlimited requests
- ✅ Unlimited bandwidth
- ✅ 500 builds/month
- ✅ Concurrent builds: 1

**Yeterli mi?** Evet! Çoğu proje için ücretsiz plan yeterlidir.

---

## 📚 Ek Kaynaklar

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
- [Cloudflare Workers](https://workers.cloudflare.com/)

---

## ✅ Checklist

Deployment öncesi kontrol listesi:

- [ ] `npm install` çalıştırıldı
- [ ] `npm run pages:build` başarılı
- [ ] `npm run preview` ile yerel test yapıldı
- [ ] Git repository oluşturuldu (GitHub method için)
- [ ] Cloudflare hesabı oluşturuldu
- [ ] Environment variables ayarlandı (varsa)
- [ ] `.env` dosyaları `.gitignore`'da

---

## 🆘 Yardım

Sorun mu yaşıyorsunuz?

1. [Cloudflare Community](https://community.cloudflare.com/)
2. [GitHub Issues](https://github.com/cloudflare/next-on-pages/issues)
3. Proje sahibine ulaşın: suedacicekli@gmail.com

---

**İyi yayınlar! 🎉**
