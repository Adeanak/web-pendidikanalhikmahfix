import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Users, 
  BookOpen, 
  CheckCircle, 
  DollarSign, 
  School, 
  Image as ImageIcon,
  ArrowLeft,
  Download
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useButtonActions } from '@/hooks/useButtonActions';
import { useButtonTexts } from '@/hooks/useButtonTexts';
import FloatingStats from '@/components/FloatingStats';

interface ProgramDetail {
  id: number;
  program_id: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  curriculum: string[];
  facilities: string[];
  schedule: string;
  age_range: string;
  class_size: string;
  monthly_fee: number;
  registration_fee: number;
  uniform_fee: number;
  book_fee: number;
  images: string[];
}

const ProgramDetailPage = () => {
  const { programId } = useParams<{ programId: string }>();
  const [program, setProgram] = useState<ProgramDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFloatingStats, setShowFloatingStats] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { handleDownloadBrochure, handleContactAdmin } = useButtonActions();
  const { buttonTexts } = useButtonTexts();

  useEffect(() => {
    loadSettings();
    loadProgramDetail();
  }, [programId]);

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

  const loadProgramDetail = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('program_details')
        .select('*')
        .eq('program_id', programId)
        .single();
      
      if (error) {
        console.error('Error loading program details:', error);
        return;
      }
      
      setProgram(data);
      
      // Set the first image as selected
      if (data && data.images && data.images.length > 0) {
        setSelectedImage(data.images[0]);
      }
    } catch (error) {
      console.error('Error loading program details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-indigo-950">
        <Header />
        <main className="pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-indigo-950">
        <Header />
        <main className="pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-20">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Program Tidak Ditemukan</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Maaf, program yang Anda cari tidak ditemukan.
              </p>
              <Link to="/program">
                <Button className="gradient-primary">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali ke Daftar Program
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-indigo-950">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-8">
            <Link to="/program">
              <Button variant="outline" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Kembali ke Daftar Program</span>
              </Button>
            </Link>
          </div>
          
          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300 mb-4">
              <BookOpen className="h-4 w-4 mr-2" />
              Detail Program
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {program.title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl">
              {program.subtitle}
            </p>
          </div>
          
          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Left Column - Images */}
            <div className="lg:col-span-2">
              {/* Main Image */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-6">
                <div className="aspect-video w-full">
                  <img 
                    src={selectedImage || program.images[0]} 
                    alt={program.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Thumbnails */}
              {program.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4 mb-8">
                  {program.images.map((image, index) => (
                    <div 
                      key={index}
                      className={`aspect-video rounded-lg overflow-hidden cursor-pointer border-2 ${
                        selectedImage === image ? 'border-blue-500' : 'border-transparent'
                      }`}
                      onClick={() => setSelectedImage(image)}
                    >
                      <img 
                        src={image} 
                        alt={`${program.title} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
              
              {/* Description */}
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Deskripsi Program</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                    {program.description}
                  </p>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Keunggulan Program</h3>
                  <div className="grid md:grid-cols-2 gap-3 mb-6">
                    {program.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Informasi Jadwal</h3>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Jadwal Belajar</p>
                        <p className="font-medium text-gray-900 dark:text-white">{program.schedule}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Ukuran Kelas</p>
                        <p className="font-medium text-gray-900 dark:text-white">{program.class_size}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Curriculum */}
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Kurikulum Pembelajaran</h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    Kurikulum kami dirancang untuk memberikan pendidikan yang komprehensif dan seimbang antara ilmu agama dan keterampilan hidup.
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    {program.curriculum.map((item, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold mb-2">
                          {index + 1}
                        </div>
                        <p className="font-medium text-gray-900 dark:text-white">{item}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Metode Pembelajaran</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      Kami menerapkan metode pembelajaran yang interaktif dan menyenangkan, dengan pendekatan:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">Belajar sambil bermain</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">Pendekatan personal sesuai kemampuan anak</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">Penggunaan alat peraga dan media interaktif</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">Evaluasi berkala untuk memantau perkembangan</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              {/* Facilities */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Fasilitas Pendukung</h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    Kami menyediakan berbagai fasilitas untuk mendukung proses belajar mengajar yang optimal.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-8">
                    {program.facilities.map((facility, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{facility}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Lingkungan Belajar</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      Kami menciptakan lingkungan belajar yang:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 dark:text-gray-300">Aman dan nyaman bagi anak-anak</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 dark:text-gray-300">Kondusif untuk proses belajar mengajar</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 dark:text-gray-300">Islami dan menjunjung tinggi adab</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 dark:text-gray-300">Bersih dan terawat dengan baik</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right Column - Info & CTA */}
            <div className="space-y-6">
              {/* Quick Info */}
              <Card className="bg-white dark:bg-gray-800 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Informasi Program</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Jadwal</p>
                        <p className="font-medium text-gray-900 dark:text-white">{program.schedule}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Usia</p>
                        <p className="font-medium text-gray-900 dark:text-white">{program.age_range}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <School className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Ukuran Kelas</p>
                        <p className="font-medium text-gray-900 dark:text-white">{program.class_size}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Fees */}
              <Card className="bg-white dark:bg-gray-800 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Biaya Pendidikan</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-blue-500" />
                        <span className="text-gray-700 dark:text-gray-300">SPP Bulanan</span>
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(program.monthly_fee)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <span className="text-gray-700 dark:text-gray-300">Biaya Pendaftaran</span>
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(program.registration_fee)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-purple-500" />
                        <span className="text-gray-700 dark:text-gray-300">Seragam</span>
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(program.uniform_fee)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-orange-500" />
                        <span className="text-gray-700 dark:text-gray-300">Buku & Modul</span>
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(program.book_fee)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 bg-blue-50 dark:bg-blue-900/20 px-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-700 dark:text-blue-300">Total Awal</span>
                      </div>
                      <span className="font-bold text-blue-700 dark:text-blue-300">
                        {formatCurrency(program.registration_fee + program.uniform_fee + program.book_fee)}
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      * Biaya dapat berubah sewaktu-waktu. Silakan hubungi admin untuk informasi terbaru.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              {/* CTA */}
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Tertarik dengan Program Ini?</h3>
                  <p className="text-blue-100 mb-6">
                    Daftarkan putra/putri Anda sekarang dan berikan mereka pendidikan terbaik
                  </p>
                  
                  <div className="space-y-3">
                    <Link to="/spmb" className="block w-full">
                      <Button className="w-full bg-white text-blue-600 hover:bg-blue-50">
                        {buttonTexts.daftarSekarang}
                      </Button>
                    </Link>
                    
                    <Button 
                      variant="outline" 
                      className="w-full border-white text-white hover:bg-white/10"
                      onClick={handleDownloadBrochure}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {buttonTexts.downloadBrosur}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full border-white text-white hover:bg-white/10"
                      onClick={handleContactAdmin}
                    >
                      {buttonTexts.hubungiAdmin}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Gallery Preview */}
              <Card className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Galeri</h3>
                    <Badge variant="outline" className="text-gray-500">
                      {program.images.length} Foto
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {program.images.slice(0, 6).map((image, index) => (
                      <div 
                        key={index} 
                        className="aspect-square rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => setSelectedImage(image)}
                      >
                        <img 
                          src={image} 
                          alt={`${program.title} - ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white mb-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Daftarkan Putra/Putri Anda Sekarang</h2>
              <p className="text-blue-100 max-w-2xl mx-auto">
                Berikan pendidikan terbaik untuk anak Anda di Yayasan Al-Hikmah. Kuota terbatas!
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <Link to="/spmb">
                <Button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  {buttonTexts.daftarSekarang}
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 font-semibold py-3 px-8 rounded-xl"
                onClick={handleContactAdmin}
              >
                {buttonTexts.konsultasiGratis}
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      {/* Lightbox for images */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-6xl w-full h-full flex items-center justify-center">
            <img 
              src={selectedImage} 
              alt="Preview"
              className="max-w-full max-h-[80vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={() => setSelectedImage(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </Button>
          </div>
        </div>
      )}
      
      {showFloatingStats && <FloatingStats />}
      <Footer />
    </div>
  );
};

export default ProgramDetailPage;