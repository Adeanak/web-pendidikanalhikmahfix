# Web Pendidikan Al-Hikmah

Aplikasi web untuk sistem informasi pendidikan Al-Hikmah yang dibangun dengan teknologi modern.

## 🚀 Features

- **Dashboard Admin**: Manajemen siswa, guru, dan data akademik
- **Sistem SPMB**: Pendaftaran mahasiswa baru online
- **Galeri Alumni**: Showcase lulusan dan prestasi
- **Responsive Design**: Optimal di semua perangkat
- **Real-time Data**: Integrasi dengan Supabase
- **Modern UI**: Menggunakan shadcn/ui dan Tailwind CSS

## How can I edit this code?

There are several ways of editing your application.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## 🛠️ Technologies Used

This project is built with modern web technologies:

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Routing**: React Router DOM
- **State Management**: React Context
- **Charts**: Recharts
- **PDF Generation**: jsPDF + html2canvas
- **Icons**: Lucide React
- **Deployment**: Vercel

## 🚀 Deployment to Vercel

### Quick Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/web-pendidikan-alhikmah)

### Manual Setup
1. Fork this repository
2. Connect to Vercel dashboard
3. Add environment variables
4. Deploy automatically

### CLI Deployment
```bash
# Deploy preview
npm run deploy:vercel

# Deploy to production
npm run deploy:vercel:prod
```

📖 **Detailed Guide**: See [VERCEL-DEPLOYMENT.md](./VERCEL-DEPLOYMENT.md)

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 📱 Features Overview

### Admin Dashboard
- Manajemen data siswa dan guru
- Statistik dan analytics
- Export data ke PDF/Excel
- Upload dan manajemen file

### SPMB (Sistem Penerimaan Mahasiswa Baru)
- Formulir pendaftaran online
- Upload dokumen persyaratan
- Tracking status pendaftaran
- Notifikasi real-time

### Public Pages
- Homepage dengan informasi sekolah
- Galeri alumni dan prestasi
- Program studi dan kurikulum
- Kontak dan lokasi

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- 📧 Email: support@alhikmah.edu
- 📱 WhatsApp: +62 xxx-xxxx-xxxx
- 🌐 Website: https://alhikmah.edu
