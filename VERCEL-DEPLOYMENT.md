# Vercel Deployment Guide

Panduan lengkap untuk deploy aplikasi Web Pendidikan Al-Hikmah ke Vercel.

## Prerequisites

1. Akun Vercel (https://vercel.com)
2. Repository GitHub/GitLab/Bitbucket
3. Node.js 20.11.0 atau lebih tinggi

## Konfigurasi yang Sudah Disiapkan

### 1. File Konfigurasi
- `vercel.json` - Konfigurasi deployment Vercel
- `.vercelignore` - File yang diabaikan saat deployment
- Build script khusus Vercel di `package.json`

### 2. Build Settings
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Node.js Version**: 20.x

### 3. Environment Variables yang Diperlukan
Pastikan untuk menambahkan environment variables berikut di Vercel Dashboard:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Langkah Deployment

### Opsi 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login ke Vercel:
```bash
vercel login
```

3. Deploy dari root directory:
```bash
vercel
```

4. Untuk production deployment:
```bash
vercel --prod
```

### Opsi 2: Deploy via Vercel Dashboard

1. Login ke https://vercel.com
2. Klik "New Project"
3. Import repository GitHub/GitLab/Bitbucket
4. Vercel akan otomatis mendeteksi framework Vite
5. Pastikan settings berikut:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

6. Tambahkan Environment Variables di tab "Environment Variables"
7. Klik "Deploy"

## Optimizations Applied

### 1. Dependency Management
- Externalized problematic dependencies (`html2canvas`, `jspdf`, `jspdf-autotable`)
- Simplified Vite configuration for stable builds
- Using standard React plugin for better compatibility

### 2. Build Configuration
- Minimal Vite config to avoid bundling conflicts
- TypeScript compilation check before build
- Optimized asset handling and chunking

### 3. Routing Configuration
- SPA routing support with catch-all route to `index.html`
- Proper handling of client-side routing

### 4. Performance Optimizations
- Asset optimization and compression
- Code splitting for better loading performance
- Proper caching headers

## Troubleshooting

### Build Failures
1. Check Node.js version (should be 20.x)
2. Verify all environment variables are set
3. Check build logs for specific errors

### Runtime Errors
1. Verify Supabase configuration
2. Check browser console for client-side errors
3. Ensure all external dependencies are properly loaded

### Performance Issues
1. Enable Vercel Analytics for monitoring
2. Use Vercel Speed Insights
3. Optimize images and assets

## Custom Domain Setup

1. Go to Project Settings in Vercel Dashboard
2. Navigate to "Domains" tab
3. Add your custom domain
4. Configure DNS records as instructed
5. SSL certificate will be automatically provisioned

## Monitoring & Analytics

- Enable Vercel Analytics in project settings
- Use Vercel Speed Insights for performance monitoring
- Set up error tracking with Sentry (optional)

## Automatic Deployments

- Production deployments: Push to `main` branch
- Preview deployments: Push to any other branch
- Pull request deployments: Automatic preview URLs

## Support

Untuk bantuan lebih lanjut:
- Vercel Documentation: https://vercel.com/docs
- Vercel Community: https://github.com/vercel/vercel/discussions
- Vite Documentation: https://vitejs.dev/guide/