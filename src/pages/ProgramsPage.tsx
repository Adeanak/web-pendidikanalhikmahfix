import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Palette, Star, Clock, Users, Calendar, ArrowRight } from 'lucide-react';
import { useButtonActions } from '@/hooks/useButtonActions';
import { useButtonTexts } from '@/hooks/useButtonTexts';
import FloatingStats from '@/components/FloatingStats';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const ProgramsPage = () => {
  const { handleProgramDetail, handleConsultation } = useButtonActions();
  const { buttonTexts } = useButtonTexts();
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

  const programs = [
    {
      id: 'paud',
      title: 'Kober/PAUD',
      subtitle: 'Kelompok Bermain / Pendidikan Anak Usia Dini',
      description: 'Program pendidikan untuk anak usia dini yang menggabungkan pembelajaran akademik dengan nilai-nilai Islam dalam suasana yang menyenangkan.',
      icon: Palette,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      students: 120,
      schedule: 'Senin - Jumat, 08:00 - 11:00',
      ageRange: '3-6 tahun',
      features: [
        'Pembelajaran Dasar (Calistung)',
        'Pengenalan Huruf Hijaiyah',
        'Seni, Musik, dan Gerak',
        'Permainan Edukatif',
        'Pembentukan Karakter Islami'
      ]
    },
    {
      id: 'tka-tpa',
      title: 'TKA/TPA',
      subtitle: 'Taman Kanak-kanak Al-Quran / Taman Pendidikan Al-Quran',
      description: 'Program pendidikan Al-Quran untuk anak-anak usia 4-12 tahun dengan metode pembelajaran yang menyenangkan dan mudah dipahami.',
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      students: 150,
      schedule: 'Senin - Jumat, 15:30 - 17:00',
      ageRange: '4-12 tahun',
      features: [
        'Pembelajaran Al-Quran dengan Tajwid',
        'Hafalan Surat-surat Pendek',
        'Pendidikan Akhlak dan Adab',
        'Pembelajaran Bahasa Arab Dasar',
        'Kegiatan Seni dan Kreativitas'
      ]
    },
    {
      id: 'diniyah',
      title: 'Madrasah Diniyah',
      subtitle: 'Pendidikan Agama Islam Formal',
      description: 'Program pendidikan agama Islam yang komprehensif untuk memberikan pemahaman mendalam tentang ajaran Islam kepada generasi muda.',
      icon: Star,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      students: 80,
      schedule: 'Senin - Kamis, 19:30 - 21:00',
      ageRange: '7-17 tahun',
      features: [
        'Studi Al-Quran dan Tafsir',
        'Hadits dan Sirah Nabawiyah',
        'Fiqh dan Aqidah',
        'Bahasa Arab Lanjutan',
        'Sejarah Islam'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-indigo-950">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300 mb-4">
              📚 Program Pendidikan
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Program Pendidikan Kami
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Tiga program unggulan yang dirancang khusus untuk mengembangkan potensi anak dalam pendidikan Islam yang berkualitas
            </p>
          </div>

          {/* Programs Grid */}
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {programs.map((program, index) => (
              <Card key={program.id} className={`group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${program.bgColor} dark:bg-gray-800 border-0 overflow-hidden`}>
                <CardContent className="p-8">
                  <div className="flex flex-col items-center mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${program.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <program.icon className="h-8 w-8 text-white" />
                    </div>
                    <h2 className={`text-2xl font-bold ${program.textColor} dark:text-white mb-2 text-center`}>
                      {program.title}
                    </h2>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 text-center">
                      {program.subtitle}
                    </p>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 text-center">
                    {program.description}
                  </p>

                  {/* Program Info */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Users className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      <span className="font-medium">{program.students} Siswa Aktif</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Clock className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      <span>{program.schedule}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      <span>Usia {program.ageRange}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Kurikulum:</h4>
                    <div className="space-y-1">
                      {program.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <div className={`w-2 h-2 bg-gradient-to-r ${program.color} rounded-full mr-2 flex-shrink-0`}></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-center">
                    <Button 
                      onClick={() => handleProgramDetail(program.title)}
                      className="gradient-primary text-white"
                    >
                      Lihat Detail Program
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Tertarik dengan Program Kami?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Bergabunglah dengan ribuan keluarga yang telah mempercayakan pendidikan anak-anak mereka kepada kami
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => handleConsultation()}
                  className="gradient-primary text-white font-semibold px-8 py-3 rounded-xl hover:scale-105 transition-transform duration-200"
                >
                  {buttonTexts.konsultasiGratis}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/spmb'}
                  className="border-2 border-gray-300 text-gray-700 dark:text-gray-200 dark:border-gray-600 font-semibold px-8 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  {buttonTexts.daftarSekarang}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {showFloatingStats && <FloatingStats />}
      <Footer />
    </div>
  );
};

export default ProgramsPage;