import { Users, Award, Heart, Star, CheckCircle, BookOpen, Play, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useButtonActions } from '@/hooks/useButtonActions';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface HomeContent {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroImage?: string;
  heroVideo?: string;
  features: {
    id: string;
    icon: string;
    text: string;
    color: string;
    bgColor: string;
  }[];
  statistics: {
    id: string;
    icon: string;
    label: string;
    value: string;
    color: string;
    bgColor: string;
  }[];
  programs: {
    id: string;
    icon: string;
    title: string;
    subtitle: string;
    description: string;
    color: string;
    bgColor: string;
  }[];
  buttonActions: {
    id: string;
    name: string;
    text: string;
    action: string;
    url?: string;
    enabled: boolean;
  }[];
}

const Hero = () => {
  const { handleVideoProfile } = useButtonActions();
  const [content, setContent] = useState<HomeContent>({
    heroTitle: 'Yayasan Al-Hikmah',
    heroSubtitle: 'Pendidikan Islam Berkualitas',
    heroDescription: 'Membentuk generasi Qurani yang berakhlak mulia melalui pendidikan berkualitas dengan penuh kasih sayang',
    features: [
      { id: '1', icon: 'CheckCircle', text: 'Kurikulum Terintegrasi Al-Quran', color: 'text-green-600', bgColor: 'bg-green-100' },
      { id: '2', icon: 'CheckCircle', text: 'Tenaga Pengajar Bersertifikat', color: 'text-blue-600', bgColor: 'bg-blue-100' },
      { id: '3', icon: 'CheckCircle', text: 'Fasilitas Lengkap & Modern', color: 'text-purple-600', bgColor: 'bg-purple-100' },
      { id: '4', icon: 'CheckCircle', text: 'Lingkungan Islami & Kondusif', color: 'text-orange-600', bgColor: 'bg-orange-100' },
    ],
    statistics: [
      { id: '1', icon: 'Users', label: 'Siswa Aktif', value: '350+', color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-50' },
      { id: '2', icon: 'BookOpen', label: 'Program', value: '3', color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-50' },
      { id: '3', icon: 'Award', label: 'Lulusan', value: '500+', color: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-50' },
      { id: '4', icon: 'Heart', label: 'Tahun Pengalaman', value: '15+', color: 'from-orange-500 to-red-500', bgColor: 'bg-orange-50' },
    ],
    programs: [
      { id: 'paud', icon: '🎨', title: 'PAUD/KOBER', subtitle: 'Pendidikan Anak Usia Dini', description: 'Program pembelajaran untuk anak usia 2-5 tahun dengan metode bermain sambil belajar', color: 'from-green-400 to-emerald-500', bgColor: 'bg-green-50' },
      { id: 'tka-tpa', icon: '📖', title: 'TKA/TPA', subtitle: 'Taman Kanak-kanak Al-Quran', description: 'Pendidikan Al-Quran untuk anak dengan metode tahfidz dan pemahaman makna', color: 'from-blue-400 to-cyan-500', bgColor: 'bg-blue-50' },
      { id: 'diniyah', icon: '🕌', title: 'DINIYAH', subtitle: 'Madrasah Diniyah', description: 'Program pendidikan agama Islam dengan kurikulum yang komprehensif', color: 'from-purple-400 to-pink-500', bgColor: 'bg-purple-50' },
    ],
    buttonActions: [
      { id: '1', name: 'daftar_sekarang', text: 'Daftar Sekarang', action: 'navigate', url: '/spmb', enabled: true },
      { id: '2', name: 'video_profil', text: 'Video Profil', action: 'modal', enabled: true },
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
        console.log('Using default hero content');
        return;
      }
      
      if (data && data.settings && data.settings.homeContent) {
        setContent(data.settings.homeContent);
      }
    } catch (error) {
      console.error('Error loading hero content:', error);
    }
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Users': return <Users className="h-5 w-5" />;
      case 'Award': return <Award className="h-5 w-5" />;
      case 'Heart': return <Heart className="h-5 w-5" />;
      case 'Star': return <Star className="h-5 w-5" />;
      case 'CheckCircle': return <CheckCircle className="h-5 w-5" />;
      case 'BookOpen': return <BookOpen className="h-5 w-5" />;
      default: return <Star className="h-5 w-5" />;
    }
  };

  const handleButtonAction = (action: string, url?: string) => {
    switch (action) {
      case 'navigate':
        if (url) window.location.href = url;
        break;
      case 'modal':
        handleVideoProfile();
        break;
      case 'contact':
        window.location.href = '#contact';
        break;
      case 'download':
        // This will be handled by useButtonActions
        break;
      default:
        break;
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-16 md:pt-0">
      {/* Enhanced Modern Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 transition-colors duration-300"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-40 md:w-96 h-40 md:h-96 bg-gradient-to-r from-blue-200/30 to-cyan-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 left-10 w-40 md:w-80 h-40 md:h-80 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-gradient-to-r from-yellow-100/20 to-orange-100/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-center">
          {/* Left Content - 7 columns */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6 md:space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 rounded-full text-xs md:text-sm font-semibold text-blue-700 dark:text-blue-300 mb-4 md:mb-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Star className="h-3 w-3 md:h-4 md:w-4 mr-2 text-yellow-500" />
              🌟 Pendidikan Islam Terdepan di Bandung
            </div>
            
            <div className="space-y-4 md:space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="block text-gray-900 dark:text-white mb-2">{content.heroTitle}</span>
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-purple-400 dark:to-cyan-400">
                  {content.heroSubtitle}
                </span>
              </h1>
              
              <p className="text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl font-light">
                {content.heroDescription}
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 my-6 md:my-10">
                {content.features.map((feature, index) => (
                  <div key={index} className={`flex items-center space-x-3 p-3 md:p-4 rounded-xl ${feature.bgColor} dark:bg-opacity-20 hover:shadow-md transition-all duration-300 transform hover:scale-105`}>
                    <div className={`p-2 rounded-lg ${feature.bgColor.replace('100', '200')}`}>
                      <CheckCircle className={`h-4 w-4 md:h-5 md:w-5 ${feature.color}`} />
                    </div>
                    <span className="text-gray-800 dark:text-gray-200 font-medium text-xs md:text-sm">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {content.buttonActions.filter(btn => btn.enabled).map((button, index) => (
                button.action === 'navigate' ? (
                  <Link key={button.id} to={button.url || '/'}>
                    <Button 
                      size="lg" 
                      className={index === 0 ? "gradient-primary text-white font-semibold px-6 md:px-8 py-3 md:py-4 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group w-full sm:w-auto" : "border-2 border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-500 font-semibold px-6 md:px-8 py-3 md:py-4 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 hover:scale-105 group w-full sm:w-auto"}
                    >
                      <span>{button.text}</span>
                      {index === 0 && <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" />}
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    key={button.id}
                    size="lg" 
                    variant={index === 0 ? "default" : "outline"}
                    onClick={() => handleButtonAction(button.action, button.url)}
                    className={index === 0 ? "gradient-primary text-white font-semibold px-6 md:px-8 py-3 md:py-4 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group w-full sm:w-auto" : "border-2 border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-500 font-semibold px-6 md:px-8 py-3 md:py-4 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 hover:scale-105 group w-full sm:w-auto"}
                  >
                    {button.action === 'modal' && <Play className="mr-2 h-4 w-4 md:h-5 md:w-5" />}
                    <span>{button.text}</span>
                    {index === 0 && button.action === 'navigate' && <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" />}
                  </Button>
                )
              ))}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-8 md:mt-12">
              {content.statistics.map((stat, index) => (
                <div key={index} className={`${stat.bgColor} dark:bg-opacity-20 p-4 md:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-white/50 dark:border-gray-700`}>
                  <div className={`w-8 h-8 md:w-12 md:h-12 mx-auto mb-2 md:mb-4 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    {renderIcon(stat.icon)}
                  </div>
                  <div className="text-center">
                    <div className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                    <div className="text-xs md:text-sm text-gray-600 dark:text-gray-300 font-medium">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - 5 columns */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0">
            <div className="relative z-10">
              {/* Main Card */}
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-8 border border-white/20 dark:border-gray-700/20 transform hover:scale-105 transition-all duration-500">
                <div className="text-center mb-6 md:mb-8">
                  <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 relative">
                    <img 
                      src="/logo.png" 
                      alt="Al-Hikmah Logo" 
                      className="w-full h-full object-contain drop-shadow-lg"
                    />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400 mb-2 md:mb-3">
                    Program Unggulan
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base">Dengan metode pembelajaran inovatif dan menyenangkan</p>
                </div>
                
                {/* Programs Grid */}
                <div className="grid grid-cols-1 gap-3 md:gap-4 mb-6 md:mb-8">
                  {content.programs.map((program, index) => (
                    <div key={index} className={`${program.bgColor} dark:bg-opacity-20 rounded-xl p-4 md:p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-white/50 dark:border-gray-700/50`}>
                      <div className="flex items-center space-x-3 md:space-x-4">
                        <div className="text-2xl md:text-3xl">{program.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-bold text-base md:text-lg text-gray-900 dark:text-white">{program.title}</h4>
                          <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300 mb-1 md:mb-2">{program.subtitle}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">{program.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Contact Info */}
                <div className="text-center pt-4 md:pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">📍 Lokasi Yayasan</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    Kp. Tanjung RT 03 RW 07<br />
                    Desa Tanjungsari, Kecamatan Cangkuang<br />
                    <span className="font-medium">Kabupaten Bandung, Jawa Barat</span>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Enhanced Floating Elements */}
            <div className="absolute -top-6 -left-6 w-12 h-12 md:w-20 md:h-20 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full opacity-80 animate-bounce shadow-xl"></div>
            <div className="absolute -bottom-4 -right-4 w-10 h-10 md:w-16 md:h-16 bg-gradient-to-r from-pink-400 to-red-400 rounded-full opacity-80 animate-bounce shadow-xl" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-1/2 -right-4 md:-right-8 w-8 h-8 md:w-12 md:h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-80 animate-bounce shadow-xl" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/4 -left-2 w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-80 animate-bounce shadow-xl" style={{ animationDelay: '1.5s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;