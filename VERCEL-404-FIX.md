# 🚨 Panduan Mengatasi Error 404 DEPLOYMENT_NOT_FOUND di Vercel

## 📋 Analisis Error

**Error yang terjadi:**
```
404 : NOT_FOUND
Code: DEPLOYMENT_NOT_FOUND
ID: sin1::4wztp-1751677215192-0c9205450c17

Uncaught (in promise) Error: A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received
```

## 🔍 Penyebab Utama

1. **Environment Variables tidak diset** di Vercel Dashboard
2. **Domain/URL tidak dikonfigurasi** dengan benar
3. **Build process gagal** karena missing dependencies
4. **Supabase connection error** saat runtime

## ✅ Solusi Step-by-Step

### 1. Set Environment Variables di Vercel

**Langkah:**
1. Buka [Vercel Dashboard](https://vercel.com/dashboard)
2. Pilih project `web-pendidikanalhikmah`
3. Masuk ke **Settings** → **Environment Variables**
4. Tambahkan variables berikut:

```env
# WAJIB - Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# OPSIONAL - Application Configuration
VITE_APP_NAME=Web Pendidikan Al-Hikmah
VITE_APP_VERSION=1.0.0
```

**⚠️ PENTING:** Pastikan semua environment variables menggunakan prefix `VITE_`

### 2. Redeploy Aplikasi

**Metode A: Via Vercel Dashboard**
```bash
# 1. Buka Vercel Dashboard
# 2. Pilih project → Deployments
# 3. Klik "Redeploy" pada deployment terakhir
# 4. Centang "Use existing Build Cache" = NO
# 5. Klik "Redeploy"
```

**Metode B: Via Git Push**
```bash
# Push perubahan kecil untuk trigger redeploy
git add .
git commit -m "fix: trigger redeploy for env vars"
git push origin main
```

**Metode C: Via Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Login dan deploy
vercel login
vercel --prod
```

### 3. Verifikasi Build Lokal

```bash
# Test build lokal
npm run build
npm run preview

# Jika berhasil, lanjut ke deployment
```

### 4. Cek Domain Configuration

**Di Vercel Dashboard:**
1. **Settings** → **Domains**
2. Pastikan domain `web-pendidikanalhikmah.vercel.app` aktif
3. Jika ada custom domain, pastikan DNS sudah benar

### 5. Debug Supabase Connection

**Tambahkan error handling di `src/lib/supabase.ts`:**
```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey
  });
  throw new Error('Missing Supabase environment variables');
}
```

## 🛠️ Troubleshooting Lanjutan

### Jika Masih Error 404:

**1. Cek Build Logs di Vercel:**
- Buka project → **Functions** → **View Build Logs**
- Cari error messages

**2. Cek Runtime Logs:**
- **Functions** → **View Function Logs**
- Lihat real-time errors

**3. Test dengan Deployment Preview:**
```bash
# Deploy ke preview environment dulu
vercel
# Jika preview works, deploy ke production
vercel --prod
```

### Jika Error Supabase:

**1. Verifikasi Supabase Project:**
- Pastikan project Supabase aktif
- Cek API keys di Supabase Dashboard

**2. Test Connection:**
```javascript
// Tambahkan di console browser
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 10) + '...');
```

## 🚀 Quick Fix Commands

```bash
# 1. Rebuild dan redeploy
npm run build
vercel --prod

# 2. Clear cache dan redeploy
vercel --prod --force

# 3. Check deployment status
vercel ls
```

## ✅ Checklist Verifikasi

- [ ] Environment variables sudah diset di Vercel
- [ ] Build lokal berhasil (`npm run build`)
- [ ] Supabase project aktif dan accessible
- [ ] Domain configuration benar
- [ ] No build errors di Vercel logs
- [ ] No runtime errors di browser console

## 📞 Jika Masih Bermasalah

1. **Screenshot error** lengkap dari browser console
2. **Copy build logs** dari Vercel Dashboard
3. **Verifikasi Supabase credentials** di dashboard
4. **Test dengan fresh deployment** ke project baru

---

**Status:** ✅ Siap untuk deployment ulang dengan konfigurasi yang diperbaiki!