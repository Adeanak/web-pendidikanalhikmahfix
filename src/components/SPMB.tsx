import React, { useEffect, useState } from 'react';
import { Calendar, Users, BookOpen, Phone, Download, MessageCircle, UserCheck, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useButtonActions } from '@/hooks/useButtonActions';
import { useButtonTexts } from '@/hooks/useButtonTexts';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

interface SPMBContent {
  spmbTitle: string;
  spmbDescription: string;
  spmbPrograms: {
    id: string;
    title: string;
    description: string;
    age: string;
    duration: string;
    icon: string;
    features: string[];
  }[];
}

const SPMB = () => {
  const { handleDownloadBrochure, handleContactAdmin } = useButtonActions();
  const { buttonTexts } = useButtonTexts();
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState<SPMBContent>({
    spmbTitle: 'Seleksi Penerimaan Mahasiswa Baru',
    spmbDescription: 'Bergabunglah dengan keluarga besar Yayasan Al-Hikmah dalam mendidik generasi Qurani yang berakhlak mulia',
    spmbPrograms: [
      {
        id: '1',
        title: 'TKA/TPA',
        description: 'Taman Kanak-kanak Al-Qur\'an & Taman Pendidikan Al-Qur\'an',
        age: '4-12 tahun',
        duration: '2 tahun',
        icon: 'BookOpen',
        features: ['Hafalan Juz 30', 'Baca Tulis Al-Qur\'an', 'Akhlak Islami', 'Sholat Berjamaah']
      },
      {
        id: '2',
        title: 'PAUD/Kober',
        description: 'Pendidikan Anak Usia Dini & Kelompok Bermain',
        age: '3-6 tahun',
        duration: '3 tahun',
        icon: 'Users',
        features: ['Stimulasi Motorik', 'Pengenalan Huruf Hijaiyah', 'Bermain Edukatif', 'Pembentukan Karakter']
      },
      {
        id: '3',
        title: 'Diniyah',
        description: 'Madrasah Diniyah - Pendidikan Agama Islam',
        age: '7-15 tahun',
        duration: '6 tahun',
        icon: 'Calendar',
        features: ['Fiqh & Aqidah', 'Bahasa Arab', 'Sejarah Islam', 'Praktek Ibadah']
      }
    ]
  });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('website_settings')
        .select('settings')
        .eq('id', 1)
        .single();
      
      if (error) {
        console.log('Using default SPMB content');
        return;
      }
      
      if (data && data.settings && data.settings.homeContent) {
        const homeContent = data.settings.homeContent;
        setContent({
          spmbTitle: homeContent.spmbTitle || content.spmbTitle,
          spmbDescription: homeContent.spmbDescription || content.spmbDescription,
          spmbPrograms: homeContent.spmbPrograms || content.spmbPrograms
        });
      }
    } catch (error) {
      console.error('Error loading SPMB content:', error);
    }
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen': return <BookOpen className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />;
      case 'Users': return <Users className="h-6 w-6 md:h-8 md:w-8 text-green-600" />;
      case 'Calendar': return <Calendar className="h-6 w-6 md:h-8 md:w-8 text-purple-600" />;
      default: return <BookOpen className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />;
    }
  };

  return (
    <section id="spmb" className="py-12 md:py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-10 md:mb-16">
          <div className="flex items-center justify-center space-x-2 md:space-x-3 mb-4 md:mb-6">
            <div className="p-2 md:p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
              <BookOpen className="h-6 w-6 md:h-8 md:w-8 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
              {content.spmbTitle}
            </h2>
          </div>
          <p className="text-base md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {content.spmbDescription}
          </p>
        </div>

        {/* Programs Section */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-10 md:mb-16">
          {content.spmbPrograms.map((program, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center justify-center mb-4 md:mb-6">
                  <div className="p-3 md:p-4 bg-gray-50 dark:bg-gray-700 rounded-full">
                    {renderIcon(program.icon)}
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-center mb-2 md:mb-3 text-gray-900 dark:text-white">{program.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-4 md:mb-6 leading-relaxed text-sm md:text-base">{program.description}</p>
                
                <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                  <div className="flex justify-between items-center py-1 md:py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Usia</span>
                    <span className="font-semibold text-gray-900 dark:text-white text-xs md:text-sm">{program.age}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 md:py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Durasi</span>
                    <span className="font-semibold text-gray-900 dark:text-white text-xs md:text-sm">{program.duration}</span>
                  </div>
                </div>

                <div className="space-y-1 md:space-y-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-xs md:text-sm">Keunggulan Program:</h4>
                  {program.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                      <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <Card className="mb-10 md:mb-16 border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl">
          <CardContent className="p-8 md:p-12">
            <div className="text-center mb-6 md:mb-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">{buttonTexts.daftarSekarang}</h3>
              <p className="text-base md:text-xl text-blue-100 max-w-2xl mx-auto">
                Segera daftarkan putra/putri Anda untuk mendapatkan pendidikan berkualitas di Al-Hikmah
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6 max-w-3xl mx-auto">
              <Link to="/spmb" className="w-full md:w-auto">
                <Button
                  className="w-full md:w-auto bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 md:py-6 px-6 md:px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center space-x-2 md:space-x-3"
                >
                  <UserCheck className="h-5 w-5 md:h-6 md:w-6" />
                  <span className="text-base md:text-lg">Daftar Online</span>
                  <ArrowRight className="h-4 w-4 md:h-5 md:w-5 ml-1 md:ml-2" />
                </Button>
              </Link>
              
              <Button
                onClick={handleDownloadBrochure}
                className="w-full md:w-auto bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 md:py-6 px-6 md:px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center space-x-2 md:space-x-3"
              >
                <Download className="h-5 w-5 md:h-6 md:w-6" />
                <span className="text-base md:text-lg">{buttonTexts.downloadBrosur}</span>
              </Button>
              
              <Button
                onClick={handleContactAdmin}
                className="w-full md:w-auto bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 md:py-6 px-6 md:px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center space-x-2 md:space-x-3"
              >
                <MessageCircle className="h-5 w-5 md:h-6 md:w-6" />
                <span className="text-base md:text-lg">{buttonTexts.hubungiAdmin}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default SPMB;