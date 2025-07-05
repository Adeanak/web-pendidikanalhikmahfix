# 🚨 QUICK FIX - Error 404 DEPLOYMENT_NOT_FOUND

## ⚡ Solusi Cepat (5 Menit)

### 1. Jalankan Script Otomatis
```bash
npm run fix:deployment
```

### 2. Set Environment Variables di Vercel
**WAJIB DILAKUKAN:**

1. Buka [Vercel Dashboard](https://vercel.com/dashboard)
2. Pilih project `web-pendidikanalhikmah`
3. **Settings** → **Environment Variables**
4. Tambahkan:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
VITE_APP_NAME=Web Pendidikan Al-Hikmah
VITE_APP_VERSION=1.0.0
```

### 3. Redeploy
```bash
# Metode 1: Via CLI
vercel --prod

# Metode 2: Via Dashboard
# Buka Vercel → Project → Deployments → Redeploy
```

## 🔍 Jika Masih Error

### Cek Build Lokal
```bash
npm run build
npm run preview
# Jika lokal works, masalah di environment variables
```

### Debug Environment Variables
```bash
# Cek di browser console setelah deploy
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
```

### Force Redeploy
```bash
vercel --prod --force
```

## ✅ Checklist
- [ ] Environment variables diset di Vercel Dashboard
- [ ] Build lokal berhasil
- [ ] Supabase project aktif
- [ ] Redeploy dilakukan

## 📞 Bantuan Lebih Lanjut
- Baca: `VERCEL-404-FIX.md` untuk panduan lengkap
- Jalankan: `npm run fix:deployment` untuk diagnosis otomatis

---
**⏱️ Estimasi waktu fix: 5-10 menit**