
import React, { useEffect, useState } from 'react';
import { Sparkles, Award, Star, Trophy, BookOpen, Users, Heart, CheckCircle } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState('Memuat...');
  const [currentFeature, setCurrentFeature] = useState(0);

  const loadingTexts = [
    'Memuat...',
    'Menyiapkan Halaman...',
    'Menginisialisasi Database...',
    'Hampir Selesai...',
    'Selamat Datang!'
  ];

  const features = [
    { 
      icon: Award, 
      title: 'Pendidikan Berkualitas', 
      description: 'Kurikulum terintegrasi dengan nilai-nilai Islam dan pembelajaran modern',
      color: 'text-yellow-400'
    },
    { 
      icon: Trophy, 
      title: 'Prestasi Gemilang', 
      description: 'Ratusan siswa berprestasi di berbagai kompetisi tingkat nasional',
      color: 'text-orange-400'
    },
    { 
      icon: BookOpen, 
      title: 'Program Unggulan', 
      description: 'TKA/TPA, PAUD/Kober, dan Madrasah Diniyah dengan metode terbaik',
      color: 'text-blue-400'
    },
    { 
      icon: Users, 
      title: 'Tenaga Pengajar Profesional', 
      description: 'Guru berpengalaman dan bersertifikat dengan dedikasi tinggi',
      color: 'text-green-400'
    },
    { 
      icon: Sparkles, 
      title: 'Fasilitas Modern', 
      description: 'Lingkungan belajar yang nyaman, kondusif, dan mendukung kreativitas',
      color: 'text-purple-400'
    },
    { 
      icon: Heart, 
      title: '15 Tahun Pengalaman', 
      description: 'Dedikasi panjang dalam mencerdaskan generasi bangsa',
      color: 'text-pink-400'
    },
    { 
      icon: CheckCircle, 
      title: 'Akreditasi Terbaik', 
      description: 'Diakui secara resmi dengan standar pendidikan tinggi',
      color: 'text-cyan-400'
    },
    { 
      icon: Star, 
      title: 'Alumni Berprestasi', 
      description: 'Lulusan yang sukses dan berkontribusi positif bagi masyarakat',
      color: 'text-indigo-400'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;
        
        // Update text based on progress
        if (newProgress <= 20) setCurrentText(loadingTexts[0]);
        else if (newProgress <= 40) setCurrentText(loadingTexts[1]);
        else if (newProgress <= 60) setCurrentText(loadingTexts[2]);
        else if (newProgress <= 80) setCurrentText(loadingTexts[3]);
        else setCurrentText(loadingTexts[4]);

        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 1000);
          return 100;
        }
        return newProgress;
      });
    }, 50);

    // Feature rotation
    const featureInterval = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % features.length);
    }, 2500);

    return () => {
      clearInterval(interval);
      clearInterval(featureInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center z-50">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-lg px-6">
        {/* Logo */}
        <div className="mb-8 relative">
          <div className="w-28 h-28 mx-auto mb-6 relative">
            <img 
              src="/logo.png" 
              alt="Al-Hikmah Logo" 
              className="w-full h-full object-contain animate-pulse drop-shadow-2xl"
            />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-bounce">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="mb-2">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-1 animate-fade-in">
            Yayasan Al-Hikmah
          </h1>
          <h2 className="text-lg md:text-xl font-semibold text-blue-200 animate-fade-in animation-delay-300">
            Pendidikan Islam Berkualitas
          </h2>
        </div>
        <p className="text-lg text-blue-200 mb-8 animate-fade-in animation-delay-500">
          Membentuk Generasi Qurani Berakhlak Mulia
        </p>

        {/* Featured Achievement */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20 min-h-[160px]">
          <div className="flex items-center justify-center mb-4">
            {React.createElement(features[currentFeature].icon, {
              className: `h-8 w-8 ${features[currentFeature].color}`
            })}
          </div>
          <h3 className="text-lg font-bold text-white mb-3">
            {features[currentFeature].title}
          </h3>
          <p className="text-blue-200 text-sm leading-relaxed">
            {features[currentFeature].description}
          </p>
        </div>

        {/* Loading Progress */}
        <div className="w-80 mx-auto mb-6">
          <div className="bg-white/20 rounded-full h-3 overflow-hidden backdrop-blur-sm">
            <div 
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-300 ease-out shadow-lg"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="mt-4 text-white font-medium animate-pulse">
            {currentText}
          </div>
          <div className="text-blue-200 text-sm mt-2">
            {progress}%
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-4 h-4 bg-yellow-400 rounded-full opacity-60 animate-ping"></div>
        <div className="absolute bottom-20 right-16 w-3 h-3 bg-pink-400 rounded-full opacity-60 animate-ping animation-delay-1000"></div>
        <div className="absolute top-1/3 right-10 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-ping animation-delay-2000"></div>
      </div>
    </div>
  );
};

export default SplashScreen;
