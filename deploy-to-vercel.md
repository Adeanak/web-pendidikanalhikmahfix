# 🚀 Panduan Deployment ke Vercel

## Persiapan Sebelum Deploy

### 1. Pastikan Build Berhasil
```bash
npm run build
```

### 2. Environment Variables yang Diperlukan
Pastikan Anda memiliki nilai untuk variabel berikut:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SUPABASE_SERVICE_ROLE_KEY`
- `VITE_APP_NAME`
- `VITE_APP_VERSION`

## Metode Deployment

### Opsi 1: Vercel Dashboard (Recommended)

1. **Login ke Vercel**
   - Kunjungi [vercel.com](https://vercel.com)
   - Login dengan GitHub/GitLab/Bitbucket

2. **Import Project**
   - Klik "New Project"
   - Import repository dari Git provider
   - Pilih repository project ini

3. **Configure Project**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Environment Variables**
   - Tambahkan semua environment variables yang diperlukan
   - Pastikan semua nilai sudah benar

5. **Deploy**
   - Klik "Deploy"
   - Tunggu proses deployment selesai

### Opsi 2: Vercel CLI

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login**
```bash
vercel login
```

3. **Deploy**
```bash
# Development deployment
vercel

# Production deployment
vercel --prod
```

### Opsi 3: Automated Script

```bash
# Menggunakan script yang sudah tersedia
node deploy-vercel.js

# Atau menggunakan npm script
npm run deploy:vercel:prod
```

## Post-Deployment Checklist

### ✅ Functional Testing
- [ ] Halaman utama loading dengan splash screen
- [ ] Navigasi antar halaman berfungsi
- [ ] Form SPMB dapat disubmit
- [ ] Admin panel dapat diakses
- [ ] Database connection berfungsi

### ✅ Performance Testing
- [ ] Page load time < 3 detik
- [ ] Images loading dengan baik
- [ ] Mobile responsiveness
- [ ] SEO meta tags

### ✅ Security Check
- [ ] Environment variables tidak exposed
- [ ] HTTPS enabled
- [ ] Security headers aktif

## Optimizations Applied

### 🎯 Bundle Optimization
- Code splitting untuk vendor libraries
- Separate chunks untuk React, UI components, Supabase
- Gzip compression enabled
- Static assets caching

### 🔒 Security Headers
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

### ⚡ Performance
- Static assets cache: 1 year
- HTML no-cache for updates
- Image optimization
- Font preloading

## Troubleshooting

### Build Errors
```bash
# Clear cache dan rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Environment Variables
- Pastikan semua VITE_ prefix variables sudah set
- Check di Vercel dashboard > Settings > Environment Variables

### Routing Issues
- Vercel.json sudah dikonfigurasi untuk SPA routing
- Semua routes akan redirect ke index.html

## Custom Domain (Optional)

1. **Add Domain di Vercel**
   - Project Settings > Domains
   - Add custom domain

2. **DNS Configuration**
   - Add CNAME record pointing to vercel domain
   - Atau A record ke Vercel IP

3. **SSL Certificate**
   - Otomatis provided oleh Vercel
   - Let's Encrypt integration

## Monitoring & Analytics

### Vercel Analytics
- Enable di Project Settings
- Real-time performance metrics
- Core Web Vitals tracking

### Error Monitoring
- Check Vercel Functions logs
- Monitor build logs
- Set up alerts untuk failures

## Automatic Deployments

### Git Integration
- Push ke main branch = production deploy
- Push ke develop branch = preview deploy
- Pull requests = preview deployments

### Deployment Protection
- Enable untuk production
- Require approval untuk sensitive changes
- Branch protection rules

---

## 🎉 Deployment Ready!

Aplikasi Web Pendidikan Al-Hikmah sudah siap untuk di-deploy ke Vercel dengan:
- ✅ Splash screen terintegrasi
- ✅ Optimized bundle size
- ✅ Security headers
- ✅ Performance optimizations
- ✅ Complete documentation

**Next Steps:**
1. Setup environment variables di Vercel
2. Deploy menggunakan salah satu metode di atas
3. Test functionality setelah deployment
4. Setup custom domain (optional)
5. Enable monitoring & analytics

**Support:**
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Router Deployment](https://reactrouter.com/en/main/guides/deploying)