# GitHub Actions ile Cloudflare Pages Deployment

Bu dosya GitHub Actions kullanarak otomatik Cloudflare Pages deployment'ı için gerekli adımları içerir.

## 📋 Gerekli GitHub Secrets

GitHub Actions'ın çalışması için repository'nize iki secret eklemeniz gerekiyor:

### 1. CLOUDFLARE_API_TOKEN

**Nasıl Alınır:**

1. Cloudflare Dashboard'a gidin: https://dash.cloudflare.com
2. Sağ üstteki profil ikonuna tıklayın
3. **"My Profile"** → **"API Tokens"** seçin
4. **"Create Token"** butonuna tıklayın
5. **"Edit Cloudflare Workers"** template'ini seçin veya Custom Token oluşturun

**Custom Token İçin İzinler:**
```
Account - Cloudflare Pages - Edit
```

6. Token'ı kopyalayın (bir daha gösterilmeyecek!)

### 2. CLOUDFLARE_ACCOUNT_ID

**Nasıl Bulunur:**

1. Cloudflare Dashboard → Workers & Pages
2. Sağ taraftaki sidebar'da **Account ID** görünecek
3. Kopyalayın

**VEYA**

URL'den alın:
```
https://dash.cloudflare.com/BURASI_ACCOUNT_ID/workers-and-pages
```

---

## 🔐 GitHub Secrets Ekleme

### Adımlar:

1. GitHub repository'nize gidin
2. **Settings** sekmesine tıklayın
3. Sol menüden **Secrets and variables** → **Actions** seçin
4. **"New repository secret"** butonuna tıklayın

### Secret 1: CLOUDFLARE_API_TOKEN
```
Name: CLOUDFLARE_API_TOKEN
Secret: [Yukarıda oluşturduğunuz token]
```

### Secret 2: CLOUDFLARE_ACCOUNT_ID
```
Name: CLOUDFLARE_ACCOUNT_ID
Secret: [Account ID'niz]
```

---

## 🚀 Nasıl Çalışır?

### Otomatik Trigger

Her `main` branch'e push yapıldığında:
```bash
git push origin main
```

GitHub Actions otomatik olarak:
1. ✅ Kodu checkout eder
2. ✅ Node.js 20 kurar
3. ✅ Dependencies yükler
4. ✅ Cloudflare için build yapar
5. ✅ Cloudflare Pages'e deploy eder

### Pull Request Preview

Her Pull Request için:
- Preview deployment oluşturur
- PR'da deployment URL'i görünür

---

## 📊 Workflow Durumu Görüntüleme

1. GitHub repository'nize gidin
2. **Actions** sekmesine tıklayın
3. Workflow çalıştırmalarını görürsünüz

---

## 🔧 Troubleshooting

### Hata: "Error: Unable to find project"

**Çözüm:** `projectName` doğru mu kontrol edin:
```yaml
projectName: promptloper  # Cloudflare'deki proje adı
```

### Hata: "Authentication error"

**Çözüm:** API Token izinlerini kontrol edin:
- Account - Cloudflare Pages - Edit

### Hata: "Account ID is invalid"

**Çözüm:** Account ID'yi tekrar kopyalayın:
```
https://dash.cloudflare.com/{ACCOUNT_ID}/workers-and-pages
```

---

## 🎯 Alternatif: Cloudflare Dashboard Entegrasyonu

GitHub Actions kullanmak istemiyorsanız:

1. Cloudflare Dashboard → Workers & Pages → Create → Pages
2. Connect to Git → Repository seçin
3. Cloudflare otomatik deploy eder (GitHub Actions'a gerek yok)

**Fark:**
- **GitHub Actions:** Daha fazla kontrol, custom steps ekleyebilirsiniz
- **Cloudflare Dashboard:** Daha basit, tek seferlik kurulum

---

## ✅ Kontrol Listesi

Deployment çalışması için:

- [ ] `.github/workflows/cloudflare-pages.yml` dosyası var
- [ ] GitHub Secrets eklendi:
  - [ ] CLOUDFLARE_API_TOKEN
  - [ ] CLOUDFLARE_ACCOUNT_ID
- [ ] Cloudflare'de "promptloper" projesi var
- [ ] `package.json`'da `pages:build` script'i var
- [ ] Git push yapıldı

---

## 📝 Notlar

- Workflow dosyası her commit'te çalışır
- Build süresi: ~2-3 dakika
- Başarısız build'ler email ile bildirilir
- Deployment URL'i Actions loglarında görünür

---

## 🆘 Yardım

Sorun yaşarsanız:
- Actions sekmesinde hata loglarına bakın
- Cloudflare API Token izinlerini kontrol edin
- Account ID doğru mu kontrol edin
