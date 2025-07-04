import React, { useState, useEffect } from 'react';
import { GraduationCap, Award, BookOpen, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useButtonActions } from '@/hooks/useButtonActions';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

interface GraduatesContent {
  graduatesTitle: string;
  graduatesDescription: string;
  graduatesStats: {
    id: string;
    icon: string;
    label: string;
    value: string;
    color: string;
  }[];
  graduatesAchievements: {
    id: string;
    year: string;
    title: string;
    student: string;
    description: string;
  }[];
}

const Graduates = () => {
  const { handleContactAdmin } = useButtonActions();
  const [selectedYear, setSelectedYear] = useState('2024');
  const [content, setContent] = useState<GraduatesContent>({
    graduatesTitle: 'Prestasi Lulusan Kami',
    graduatesDescription: 'Bangga dengan pencapaian para alumni yang telah menunjukkan keunggulan di berbagai bidang',
    graduatesStats: [
      { id: '1', icon: 'GraduationCap', label: 'Total Lulusan', value: '500+', color: 'from-blue-500 to-cyan-500' },
      { id: '2', icon: 'Award', label: 'Prestasi Tingkat Nasional', value: '25+', color: 'from-green-500 to-emerald-500' },
      { id: '3', icon: 'BookOpen', label: 'Melanjutkan ke Jenjang Tinggi', value: '95%', color: 'from-purple-500 to-pink-500' },
      { id: '4', icon: 'Users', label: 'Alumni Aktif', value: '300+', color: 'from-orange-500 to-red-500' }
    ],
    graduatesAchievements: [
      {
        id: '1',
        year: '2024',
        title: 'Juara 1 Lomba Tahfidz Tingkat Provinsi',
        student: 'Ahmad Fadil Ramadhan',
        description: 'Meraih prestasi gemilang dalam kompetisi hafalan Al-Quran 15 Juz'
      },
      {
        id: '2',
        year: '2024',
        title: 'Juara 2 Olimpiade Matematika Kabupaten',
        student: 'Siti Aisyah Nurhaliza',
        description: 'Menunjukkan kemampuan luar biasa dalam bidang matematika'
      },
      {
        id: '3',
        year: '2023',
        title: 'Juara 1 Lomba Pidato Bahasa Arab',
        student: 'Muhammad Ikhsan Fauzi',
        description: 'Kemampuan berbahasa Arab yang sangat mengesankan'
      },
      {
        id: '4',
        year: '2023',
        title: 'Juara 3 Festival Seni Islam Tingkat Nasional',
        student: 'Fatimah Az-Zahra',
        description: 'Karya seni kaligrafi yang memukau juri nasional'
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
        console.log('Using default graduates content');
        return;
      }
      
      if (data && data.settings && data.settings.homeContent) {
        const homeContent = data.settings.homeContent;
        setContent({
          graduatesTitle: homeContent.graduatesTitle || content.graduatesTitle,
          graduatesDescription: homeContent.graduatesDescription || content.graduatesDescription,
          graduatesStats: homeContent.graduatesStats || content.graduatesStats,
          graduatesAchievements: homeContent.graduatesAchievements || content.graduatesAchievements
        });
      }
    } catch (error) {
      console.error('Error loading graduates content:', error);
    }
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap': return <GraduationCap className="h-5 w-5 md:h-6 md:w-6 text-white" />;
      case 'Award': return <Award className="h-5 w-5 md:h-6 md:w-6 text-white" />;
      case 'BookOpen': return <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-white" />;
      case 'Users': return <Users className="h-5 w-5 md:h-6 md:w-6 text-white" />;
      default: return <GraduationCap className="h-5 w-5 md:h-6 md:w-6 text-white" />;
    }
  };

  const years = ['2024', '2023', '2022', '2021'];
  const filteredAchievements = content.graduatesAchievements.filter(achievement => achievement.year === selectedYear);

  return (
    <section id="graduates" className="py-16 md:py-20 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-indigo-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center px-3 py-1 md:px-4 md:py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-full text-xs md:text-sm font-medium text-blue-700 dark:text-blue-300 mb-3 md:mb-4">
            🎓 Lulusan & Prestasi
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
            {content.graduatesTitle}
          </h2>
          <p className="text-base md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {content.graduatesDescription}
          </p>
        </div>

        {/* Graduate Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
          {content.graduatesStats.map((stat, index) => (
            <Card key={index} className="text-center bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
              <CardHeader className="pb-2 md:pb-4">
                <div className={`w-12 h-12 md:w-16 md:h-16 mx-auto bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mb-3 md:mb-4`}>
                  {renderIcon(stat.icon)}
                </div>
                <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 font-medium">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Achievements Section */}
        <div className="mb-12 md:mb-16">
          <div className="text-center mb-6 md:mb-8">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">Prestasi Terbaru</h3>
            <div className="flex justify-center flex-wrap gap-2 mb-4 md:mb-6">
              {years.map((year) => (
                <Button
                  key={year}
                  variant={selectedYear === year ? "default" : "outline"}
                  onClick={() => setSelectedYear(year)}
                  size="sm"
                >
                  {year}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {filteredAchievements.map((achievement, index) => (
              <Card key={index} className="bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">{achievement.year}</Badge>
                    <Award className="h-5 w-5 text-yellow-500" />
                  </div>
                  <CardTitle className="text-base md:text-lg font-bold text-gray-900 dark:text-white">{achievement.title}</CardTitle>
                  <CardDescription className="font-medium text-blue-600 dark:text-blue-400">{achievement.student}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">{achievement.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/lulusan">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 md:px-8 md:py-3">
              Lihat Semua Lulusan
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Graduates;