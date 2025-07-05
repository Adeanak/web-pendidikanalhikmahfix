# Setup Production untuk Vercel Hosting 🚀

## 1. Persiapan Database Supabase

### A. Buat Project Supabase Baru (Jika Belum Ada)
1. Kunjungi [supabase.com](https://supabase.com)
2. Login/Register akun
3. Klik "New Project"
4. Pilih Organization
5. Isi nama project: `web-pendidikan-al-hikmah`
6. Set password database yang kuat
7. Pilih region terdekat (Singapore/Asia Southeast)
8. Klik "Create new project"

### B. Setup Database Schema
1. Buka project Supabase
2. Pergi ke **SQL Editor**
3. Jalankan migration files dari folder `supabase/migrations/` secara berurutan
4. Atau gunakan Supabase CLI:
   ```bash
   npx supabase db reset
   ```

### C. Konfigurasi RLS (Row Level Security)
1. Pergi ke **Authentication** > **Policies**
2. Enable RLS untuk semua tabel
3. Buat policies sesuai kebutuhan aplikasi

### D. Dapatkan Credentials
1. Pergi ke **Settings** > **API**
2. Copy:
   - `Project URL`
   - `anon/public key`
   - `service_role key` (untuk admin functions)

## 2. Persiapan Environment Variables

### A. Buat File .env.local (untuk development)
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Application Configuration
VITE_APP_NAME="Web Pendidikan Al-Hikmah"
VITE_APP_VERSION="1.0.0"

# Production Mode
NODE_ENV=production
```

### B. Environment Variables untuk Vercel
Tambahkan di Vercel Dashboard > Project Settings > Environment Variables:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `VITE_SUPABASE_URL` | https://your-project-id.supabase.co | Production |
| `VITE_SUPABASE_ANON_KEY` | your-anon-key | Production |
| `VITE_SUPABASE_SERVICE_ROLE_KEY` | your-service-role-key | Production |
| `VITE_APP_NAME` | Web Pendidikan Al-Hikmah | Production |
| `VITE_APP_VERSION` | 1.0.0 | Production |
| `NODE_ENV` | production | Production |

## 3. Optimasi Konfigurasi Build

### A. Vercel Configuration (vercel.json)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install --legacy-peer-deps",
  "framework": "vite",
  "functions": {
    "app/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  },
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        }
      ]
    }
  ]
}
```

### B. Vite Configuration Optimization
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          supabase: ['@supabase/supabase-js']
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true
  }
})
```

## 4. Deployment ke Vercel

### Method 1: GitHub Integration (Recommended)
1. **Push ke GitHub**:
   ```bash
   git add .
   git commit -m "feat: prepare for vercel production deployment"
   git push origin main
   ```

2. **Connect ke Vercel**:
   - Login ke [vercel.com](https://vercel.com)
   - Klik "New Project"
   - Import dari GitHub repository
   - Pilih repository `web-pendidikanalhikmahfix`
   - Configure project settings:
     - Framework Preset: **Vite**
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install --legacy-peer-deps`

3. **Add Environment Variables**:
   - Masukkan semua environment variables dari tabel di atas
   - Klik "Deploy"

### Method 2: Vercel CLI
1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

## 5. Post-Deployment Checklist

### A. Verifikasi Deployment
- [ ] Website dapat diakses di URL Vercel
- [ ] Semua halaman loading dengan benar
- [ ] Database connection berfungsi
- [ ] Authentication system bekerja
- [ ] Form submission berhasil
- [ ] Responsive design di mobile

### B. Performance Optimization
- [ ] Lighthouse score > 90
- [ ] Images dioptimasi
- [ ] Bundle size < 1MB
- [ ] First Contentful Paint < 2s

### C. Security Check
- [ ] Environment variables tidak exposed
- [ ] HTTPS enabled
- [ ] RLS policies aktif di Supabase
- [ ] No sensitive data in client-side code

## 6. Monitoring & Maintenance

### A. Setup Analytics
```bash
npm install @vercel/analytics
```

### B. Error Monitoring
```bash
npm install @sentry/react @sentry/tracing
```

### C. Performance Monitoring
- Vercel Analytics
- Web Vitals tracking
- Supabase Dashboard monitoring

## 7. Troubleshooting Common Issues

### Build Errors
- Check TypeScript errors: `npm run build`
- Verify all imports are correct
- Ensure environment variables are set

### Runtime Errors
- Check browser console
- Verify Supabase connection
- Check network requests in DevTools

### Performance Issues
- Analyze bundle size: `npm run build -- --analyze`
- Optimize images and assets
- Implement code splitting

---

**Ready for Production Deployment! 🎉**

Setelah mengikuti panduan ini, aplikasi Web Pendidikan Al-Hikmah siap untuk di-hosting di Vercel dengan performa optimal dan keamanan terjamin.