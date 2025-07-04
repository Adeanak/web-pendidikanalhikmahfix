# 🔧 Vercel Deployment Troubleshooting

## Error: 404 DEPLOYMENT_NOT_FOUND

### Penyebab Umum:
1. **Konfigurasi routing yang salah**
2. **Build output directory tidak sesuai**
3. **Environment variables tidak lengkap**
4. **File index.html tidak ditemukan**
5. **Framework detection yang salah**

---

## ✅ Solusi Step-by-Step

### 1. Verifikasi Konfigurasi vercel.json

Pastikan file `vercel.json` menggunakan konfigurasi yang disederhanakan:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 2. Pastikan Build Berhasil Lokal

```bash
# Hapus build lama
rm -rf dist node_modules

# Install dependencies
npm install

# Build project
npm run build

# Verifikasi file dist/index.html ada
ls dist/
```

### 3. Periksa Environment Variables

Di Vercel Dashboard > Project Settings > Environment Variables, pastikan ada:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
VITE_APP_NAME=Yayasan Pendidikan Al-Hikmah
VITE_APP_VERSION=1.0.0
```

### 4. Redeploy dengan Metode Berbeda

#### Metode A: Vercel Dashboard
1. Hapus deployment yang error
2. Import ulang project dari Git
3. Pastikan Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Deploy ulang

#### Metode B: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy dari root project
vercel --prod
```

#### Metode C: Force Redeploy
```bash
# Trigger redeploy dengan commit kosong
git commit --allow-empty -m "Force redeploy"
git push origin main
```

---

## 🔍 Debugging Checklist

### ✅ Pre-Deployment
- [ ] `npm run build` berhasil tanpa error
- [ ] File `dist/index.html` ada dan valid
- [ ] File `dist/assets/` berisi JS dan CSS
- [ ] Environment variables sudah diset
- [ ] `vercel.json` menggunakan konfigurasi yang benar

### ✅ Vercel Configuration
- [ ] Framework: Vite
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Install Command: `npm install`
- [ ] Node.js Version: 18.x atau 20.x

### ✅ Post-Deployment
- [ ] Build logs tidak ada error
- [ ] Function logs bersih
- [ ] Domain accessible
- [ ] Routing berfungsi (refresh page)

---

## 🚨 Error Spesifik & Solusi

### Error: "Build failed"
```bash
# Solusi:
1. Check build logs di Vercel dashboard
2. Pastikan semua dependencies ada di package.json
3. Verifikasi TypeScript tidak ada error
4. Test build lokal dulu
```

### Error: "Function timeout"
```bash
# Solusi:
1. Reduce bundle size
2. Enable code splitting
3. Optimize images
4. Use dynamic imports
```

### Error: "Environment variable not found"
```bash
# Solusi:
1. Add di Vercel dashboard
2. Pastikan prefix VITE_
3. Redeploy setelah add env vars
4. Check case sensitivity
```

### Error: "404 on refresh"
```bash
# Solusi:
1. Pastikan rewrites di vercel.json
2. Check SPA routing configuration
3. Verify React Router setup
```

---

## 🔧 Advanced Troubleshooting

### 1. Manual Deployment Test

```bash
# Build lokal
npm run build

# Upload manual ke Vercel
cd dist
vercel --prod
```

### 2. Check Build Output

```bash
# Verifikasi struktur dist/
tree dist/
# Harus ada:
# dist/
# ├── index.html
# ├── assets/
# │   ├── index-[hash].js
# │   └── index-[hash].css
# └── favicon.png
```

### 3. Test Lokal dengan Preview

```bash
# Test build lokal
npm run build
npm run preview
# Akses http://localhost:4173
```

### 4. Vercel Function Logs

1. Buka Vercel Dashboard
2. Project > Functions tab
3. Check error logs
4. Look for specific error messages

---

## 📞 Jika Masih Error

### Langkah Terakhir:

1. **Hapus Project di Vercel**
   - Delete project completely
   - Clear cache

2. **Buat Project Baru**
   - Import fresh dari Git
   - Setup environment variables
   - Deploy ulang

3. **Alternative Platform**
   - Netlify
   - GitHub Pages
   - Firebase Hosting

### Contact Support:
- Vercel Support: https://vercel.com/help
- Community: https://github.com/vercel/vercel/discussions

---

## ✅ Konfigurasi Final yang Benar

### vercel.json (Simplified)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### package.json scripts
```json
{
  "scripts": {
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

### Environment Variables
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
VITE_APP_NAME=Yayasan Pendidikan Al-Hikmah
VITE_APP_VERSION=1.0.0
```

---

## 🎯 Quick Fix Commands

```bash
# Reset dan redeploy
rm -rf node_modules dist
npm install
npm run build
vercel --prod

# Atau force push
git add .
git commit -m "Fix Vercel deployment"
git push origin main --force
```

**Status**: ✅ Konfigurasi sudah diperbaiki dan siap untuk deployment ulang!