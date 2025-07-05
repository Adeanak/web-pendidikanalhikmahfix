# 🚀 Panduan Deployment Vercel - Web Pendidikan Al-Hikmah

## 📋 Persiapan Sebelum Deployment

### 1. Setup Database Supabase

1. **Buat Project Supabase Baru**
   - Kunjungi [supabase.com](https://supabase.com)
   - Buat project baru dengan nama "web-pendidikan-alhikmah"
   - Catat URL dan API Keys

2. **Setup Database Schema**
   ```sql
   -- Jalankan SQL berikut di Supabase SQL Editor
   
   -- Tabel Users
   CREATE TABLE users (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     email VARCHAR(255) UNIQUE NOT NULL,
     name VARCHAR(255) NOT NULL,
     role VARCHAR(50) DEFAULT 'user',
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );
   
   -- Tabel Students
   CREATE TABLE students (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     nis VARCHAR(50) UNIQUE NOT NULL,
     class VARCHAR(100),
     email VARCHAR(255),
     phone VARCHAR(20),
     address TEXT,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );
   
   -- Tabel Teachers
   CREATE TABLE teachers (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     nip VARCHAR(50) UNIQUE NOT NULL,
     subject VARCHAR(100),
     email VARCHAR(255),
     phone VARCHAR(20),
     address TEXT,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );
   
   -- Tabel Graduates
   CREATE TABLE graduates (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     nis VARCHAR(50) UNIQUE NOT NULL,
     graduation_year INTEGER,
     current_status VARCHAR(255),
     contact_info JSONB,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );
   
   -- Tabel PPDB Registrations
   CREATE TABLE ppdb_registrations (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     student_name VARCHAR(255) NOT NULL,
     parent_name VARCHAR(255) NOT NULL,
     email VARCHAR(255) NOT NULL,
     phone VARCHAR(20) NOT NULL,
     address TEXT,
     previous_school VARCHAR(255),
     documents JSONB,
     status VARCHAR(50) DEFAULT 'pending',
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );
   
   -- Tabel Notifications
   CREATE TABLE notifications (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     message TEXT NOT NULL,
     type VARCHAR(50) DEFAULT 'info',
     target_audience VARCHAR(100) DEFAULT 'all',
     is_active BOOLEAN DEFAULT true,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );
   
   -- Enable Row Level Security
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE students ENABLE ROW LEVEL SECURITY;
   ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
   ALTER TABLE graduates ENABLE ROW LEVEL SECURITY;
   ALTER TABLE ppdb_registrations ENABLE ROW LEVEL SECURITY;
   ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
   ```

### 2. Setup Environment Variables

1. **Copy dari .env.production**
   ```bash
   # Supabase Configuration
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   
   # Application Configuration
   VITE_APP_NAME="Web Pendidikan Al-Hikmah"
   VITE_APP_VERSION="1.0.0"
   VITE_APP_ENV="production"
   ```

## 🔧 Metode Deployment

### Metode 1: GitHub Integration (Recommended)

1. **Push ke GitHub**
   ```bash
   git add .
   git commit -m "feat: prepare for Vercel deployment"
   git push origin main
   ```

2. **Connect ke Vercel**
   - Login ke [vercel.com](https://vercel.com)
   - Import project dari GitHub
   - Pilih repository ini
   - Vercel akan otomatis detect sebagai Vite project

3. **Configure Environment Variables**
   - Di Vercel Dashboard → Settings → Environment Variables
   - Add semua variables dari .env.production
   - Set untuk Production environment

4. **Deploy**
   - Vercel akan otomatis deploy setiap push ke main branch
   - Monitor di Vercel Dashboard

### Metode 2: Vercel CLI

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
   npm run deploy:prepare
   vercel --prod
   ```

## 🛠️ Build Commands yang Tersedia

```bash
# Development
npm run dev                 # Start development server
npm run preview            # Preview production build locally

# Building
npm run build              # Standard build
npm run build:prod         # Production optimized build
npm run build:clean        # Clean build (removes dist first)
npm run vercel:build       # Vercel-specific build command

# Deployment
npm run deploy:prepare     # Prepare for deployment
npm run deploy:vercel:prod # Build and deploy to Vercel

# Maintenance
npm run clean              # Clean build artifacts
npm run reinstall          # Clean reinstall dependencies
npm run type-check         # TypeScript type checking
npm run lint:fix           # Fix linting issues
```

## 🔍 Troubleshooting

### Common Issues

1. **Build Fails - Dependencies**
   ```bash
   npm run reinstall
   npm run build:clean
   ```

2. **Environment Variables Not Working**
   - Pastikan semua variables dimulai dengan `VITE_`
   - Check di Vercel Dashboard → Settings → Environment Variables
   - Redeploy setelah menambah variables

3. **Supabase Connection Issues**
   - Verify URL dan API keys di Supabase Dashboard
   - Check RLS policies di Supabase
   - Test connection di development dulu

4. **Build Size Too Large**
   - Check bundle analyzer: `npm run build:prod`
   - Optimize imports (use tree shaking)
   - Consider code splitting

### Performance Optimization

1. **Caching Headers** (sudah dikonfigurasi di vercel.json)
   - Static assets cached for 1 year
   - Immutable cache for versioned files

2. **Code Splitting** (sudah dikonfigurasi di vite.config.ts)
   - React vendor chunk
   - UI library chunks
   - Utility chunks

3. **Build Optimization**
   - Terser minification
   - Console.log removal in production
   - Source maps disabled

## 📊 Monitoring & Maintenance

### Post-Deployment Checklist

- [ ] Website loads correctly
- [ ] All pages accessible
- [ ] Supabase connection working
- [ ] Forms submitting properly
- [ ] Authentication working
- [ ] Mobile responsive
- [ ] Performance acceptable (< 3s load time)

### Regular Maintenance

1. **Weekly**
   - Check Vercel deployment logs
   - Monitor Supabase usage
   - Test critical user flows

2. **Monthly**
   - Update dependencies
   - Review performance metrics
   - Backup database

3. **Quarterly**
   - Security audit
   - Performance optimization
   - Feature updates

## 🆘 Support

Jika mengalami masalah:

1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify environment variables
4. Test locally first: `npm run preview:prod`
5. Check Supabase logs and metrics

## 📝 Notes

- Vercel free tier: 100GB bandwidth/month
- Supabase free tier: 500MB database, 2GB bandwidth
- Build time limit: 45 minutes (free tier)
- Function timeout: 10 seconds (free tier)

---

**Status**: ✅ Ready for Production Deployment
**Last Updated**: $(date)
**Version**: 1.0.0