import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Heart, Target, Eye, Award, Users, BookOpen, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FloatingStats from '@/components/FloatingStats';
import { supabase } from '@/lib/supabase';

const AboutPage = () => {
  const [showFloatingStats, setShowFloatingStats] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('website_settings')
        .select('settings')
        .eq('id', 1)
        .single();
      
      if (error) {
        console.log('Using default website settings');
        return;
      }
      
      if (data && data.settings) {
        setShowFloatingStats(data.settings.showFloatingStats !== undefined ? data.settings.showFloatingStats : true);
      }
    } catch (error) {
      console.error('Error loading website settings:', error);
    }
  };

  const values = [
    {
      icon: Heart,
      title: 'Kasih Sayang',
      description: 'Mendidik dengan penuh kasih sayang dan kesabaran'
    },
    {
      icon: BookOpen,
      title: 'Kualitas',
      description: 'Memberikan pendidikan berkualitas tinggi'
    },
    {
      icon: Users,
      title: 'Kebersamaan',
      description: 'Membangun komunitas yang solid dan saling mendukung'
    },
    {
      icon: Award,
      title: 'Prestasi',
      description: 'Menghasilkan lulusan yang berprestasi dan berakhlak mulia'
    }
  ];

  const achievements = [
    { number: '15+', label: 'Tahun Pengalaman' },
    { number: '500+', label: 'Alumni Sukses' },
    { number: '350+', label: 'Siswa Aktif' },
    { number: '25+', label: 'Tenaga Pengajar' }
  ];

  const milestones = [
    { year: '2009', title: 'Pendirian Yayasan', description: 'Yayasan Al-Hikmah resmi didirikan dengan fokus pada pendidikan Islam' },
    { year: '2010', title: 'Pembukaan TKA/TPA', description: 'Program TKA/TPA pertama dibuka dengan 25 santri' },
    { year: '2012', title: 'Pembukaan PAUD/KOBER', description: 'Memperluas layanan dengan membuka program untuk usia dini' },
    { year: '2015', title: 'Pembukaan Madrasah Diniyah', description: 'Melengkapi jenjang pendidikan dengan program Madrasah Diniyah' },
    { year: '2018', title: 'Renovasi Gedung', description: 'Peningkatan fasilitas dengan renovasi gedung utama' },
    { year: '2020', title: 'Akreditasi A', description: 'Mendapatkan Akreditasi A dari Kementerian Agama' },
    { year: '2023', title: 'Pengembangan Kurikulum', description: 'Pembaruan kurikulum terintegrasi dengan teknologi' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-indigo-950">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300 mb-4">
              🏛️ Tentang Kami
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Yayasan Pendidikan Al-Hikmah
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Sejak tahun 2009, Yayasan Pendidikan Al-Hikmah telah menjadi rumah kedua bagi ribuan anak 
              dalam perjalanan pendidikan mereka
            </p>
          </div>
          
          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Left Content */}
            <div>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Sejak tahun 2009, Yayasan Pendidikan Al-Hikmah telah menjadi rumah kedua bagi ribuan anak 
                dalam perjalanan pendidikan mereka. Kami berkomitmen untuk membentuk generasi yang tidak hanya 
                cerdas secara akademis, tetapi juga berkarakter mulia berdasarkan nilai-nilai Islam.
              </p>

              {/* Vision & Mission */}
              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Visi</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Menjadi lembaga pendidikan Islam terdepan yang menghasilkan generasi Qurani, 
                      berakhlak mulia, dan berprestasi.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Misi</h3>
                    <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                      <li>• Menyelenggarakan pendidikan Islam yang berkualitas</li>
                      <li>• Membentuk karakter anak berdasarkan Al-Quran dan Sunnah</li>
                      <li>• Mengembangkan potensi akademik dan non-akademik siswa</li>
                      <li>• Menciptakan lingkungan belajar yang kondusif dan menyenangkan</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="text-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/50 dark:to-cyan-900/50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{achievement.number}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">{achievement.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content */}
            <div className="relative">
              {/* Main Image Card */}
              <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto gradient-primary rounded-2xl flex items-center justify-center mb-4">
                      <Heart className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pendidikan dengan Hati</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Setiap anak adalah amanah yang berharga. Kami mendidik dengan penuh kasih sayang 
                      dan memahami keunikan setiap individu.
                    </p>
                  </div>
                  
                  {/* Values Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {values.map((value, index) => (
                      <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <div className="w-10 h-10 mx-auto gradient-secondary rounded-lg flex items-center justify-center mb-2">
                          <value.icon className="h-5 w-5 text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{value.title}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-300">{value.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full opacity-80 animate-bounce-gentle"></div>
              <div className="absolute -bottom-6 -left-6 w-6 h-6 bg-pink-400 rounded-full opacity-80 animate-bounce-gentle" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute top-1/3 -left-8 w-4 h-4 bg-green-400 rounded-full opacity-80 animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
          
          {/* Milestones */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Perjalanan Kami
            </h2>
            
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div key={milestone.year} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12'}`}>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{milestone.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{milestone.description}</p>
                    </div>
                    
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white dark:bg-gray-800 rounded-full border-4 border-blue-500 flex items-center justify-center z-10">
                      <span className="text-blue-600 dark:text-blue-400 font-bold">{milestone.year}</span>
                    </div>
                    
                    <div className="w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* CTA */}
          <Card className="mb-16 border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl">
            <CardContent className="p-12">
              <div className="text-center">
                <h3 className="text-3xl font-bold mb-4">Bergabunglah dengan Kami</h3>
                <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
                  Jadilah bagian dari keluarga besar Al-Hikmah dan berikan pendidikan terbaik untuk putra-putri Anda
                </p>
                <Button 
                  onClick={() => window.location.href = '/spmb'}
                  className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-6 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center space-x-3 mx-auto"
                >
                  <Star className="h-6 w-6 mr-2" />
                  <span className="text-lg">Daftar Sekarang</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      {showFloatingStats && <FloatingStats />}
      <Footer />
    </div>
  );
};

export default AboutPage;