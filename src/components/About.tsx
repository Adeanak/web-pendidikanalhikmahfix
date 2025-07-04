import { Heart, Target, Eye, Award, Users, BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface AboutContent {
  aboutTitle: string;
  aboutDescription: string;
  aboutImage?: string;
  aboutValues: {
    id: string;
    icon: string;
    title: string;
    description: string;
  }[];
  aboutStats: {
    id: string;
    number: string;
    label: string;
  }[];
}

const About = () => {
  const [content, setContent] = useState<AboutContent>({
    aboutTitle: 'Yayasan Pendidikan Al-Hikmah',
    aboutDescription: 'Sejak tahun 2009, Yayasan Pendidikan Al-Hikmah telah menjadi rumah kedua bagi ribuan anak dalam perjalanan pendidikan mereka. Kami berkomitmen untuk membentuk generasi yang tidak hanya cerdas secara akademis, tetapi juga berkarakter mulia berdasarkan nilai-nilai Islam.',
    aboutValues: [
      { id: '1', icon: 'Heart', title: 'Kasih Sayang', description: 'Mendidik dengan penuh kasih sayang dan kesabaran' },
      { id: '2', icon: 'BookOpen', title: 'Kualitas', description: 'Memberikan pendidikan berkualitas tinggi' },
      { id: '3', icon: 'Users', title: 'Kebersamaan', description: 'Membangun komunitas yang solid dan saling mendukung' },
      { id: '4', icon: 'Award', title: 'Prestasi', description: 'Menghasilkan lulusan yang berprestasi dan berakhlak mulia' }
    ],
    aboutStats: [
      { id: '1', number: '15+', label: 'Tahun Pengalaman' },
      { id: '2', number: '500+', label: 'Alumni Sukses' },
      { id: '3', number: '350+', label: 'Siswa Aktif' },
      { id: '4', number: '25+', label: 'Tenaga Pengajar' }
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
        console.log('Using default about content');
        return;
      }
      
      if (data && data.settings && data.settings.homeContent) {
        const homeContent = data.settings.homeContent;
        setContent({
          aboutTitle: homeContent.aboutTitle || content.aboutTitle,
          aboutDescription: homeContent.aboutDescription || content.aboutDescription,
          aboutImage: homeContent.aboutImage || content.aboutImage,
          aboutValues: homeContent.aboutValues || content.aboutValues,
          aboutStats: homeContent.aboutStats || content.aboutStats
        });
      }
    } catch (error) {
      console.error('Error loading about content:', error);
    }
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Heart': return <Heart className="h-8 w-8 md:h-10 md:w-10 text-white" />;
      case 'BookOpen': return <BookOpen className="h-8 w-8 md:h-10 md:w-10 text-white" />;
      case 'Users': return <Users className="h-8 w-8 md:h-10 md:w-10 text-white" />;
      case 'Award': return <Award className="h-8 w-8 md:h-10 md:w-10 text-white" />;
      case 'Eye': return <Eye className="h-8 w-8 md:h-10 md:w-10 text-white" />;
      case 'Target': return <Target className="h-8 w-8 md:h-10 md:w-10 text-white" />;
      default: return <Heart className="h-8 w-8 md:h-10 md:w-10 text-white" />;
    }
  };

  return (
    <section id="about" className="py-12 md:py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center px-3 py-1 md:px-4 md:py-2 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-full text-xs md:text-sm font-medium text-green-700 dark:text-green-400 mb-4 md:mb-6">
              🏛️ Tentang Kami
            </div>
            
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">
              {content.aboutTitle}
            </h2>
            
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-6 md:mb-8 leading-relaxed">
              {content.aboutDescription}
            </p>

            {/* Vision & Mission */}
            <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
              <div className="flex items-start space-x-3 md:space-x-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Eye className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-1 md:mb-2">Visi</h3>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
                    Menjadi lembaga pendidikan Islam terdepan yang menghasilkan generasi Qurani, 
                    berakhlak mulia, dan berprestasi.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 md:space-x-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Target className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-1 md:mb-2">Misi</h3>
                  <ul className="text-sm md:text-base text-gray-600 dark:text-gray-300 space-y-1">
                    <li>• Menyelenggarakan pendidikan Islam yang berkualitas</li>
                    <li>• Membentuk karakter anak berdasarkan Al-Quran dan Sunnah</li>
                    <li>• Mengembangkan potensi akademik dan non-akademik siswa</li>
                    <li>• Menciptakan lingkungan belajar yang kondusif dan menyenangkan</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {content.aboutStats.map((achievement, index) => (
                <div key={index} className="text-center p-3 md:p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl">
                  <div className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">{achievement.number}</div>
                  <div className="text-xs md:text-sm text-gray-600 dark:text-gray-300 font-medium">{achievement.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content */}
          <div className="relative mt-8 lg:mt-0">
            {/* Main Image Card */}
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 md:p-8 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="space-y-4 md:space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 mx-auto gradient-primary rounded-2xl flex items-center justify-center mb-3 md:mb-4">
                    <Heart className="h-8 w-8 md:h-10 md:w-10 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">Pendidikan dengan Hati</h3>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
                    Setiap anak adalah amanah yang berharga. Kami mendidik dengan penuh kasih sayang 
                    dan memahami keunikan setiap individu.
                  </p>
                </div>
                
                {/* Values Grid */}
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  {content.aboutValues.map((value, index) => (
                    <div key={index} className="text-center p-3 md:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div className="w-8 h-8 md:w-10 md:h-10 mx-auto gradient-secondary rounded-lg flex items-center justify-center mb-2">
                        {renderIcon(value.icon)}
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-xs md:text-sm mb-1">{value.title}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300">{value.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-6 h-6 md:w-8 md:h-8 bg-yellow-400 rounded-full opacity-80 animate-bounce-gentle"></div>
            <div className="absolute -bottom-6 -left-6 w-4 h-4 md:w-6 md:h-6 bg-pink-400 rounded-full opacity-80 animate-bounce-gentle" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-1/3 -left-4 md:-left-8 w-3 h-3 md:w-4 md:h-4 bg-green-400 rounded-full opacity-80 animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;