import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, BookOpen, MapPin, Download, MessageCircle } from 'lucide-react';
import { useButtonActions } from '@/hooks/useButtonActions';
import { useButtonTexts } from '@/hooks/useButtonTexts';
import SPMBForm from '@/components/SPMBForm';
import FloatingStats from '@/components/FloatingStats';
import { supabase } from '@/lib/supabase';

interface TestSchedule {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  program: string;
}

const SPMBPage = () => {
  const { handleDownloadBrochure, handleContactAdmin } = useButtonActions();
  const { buttonTexts } = useButtonTexts();
  const [testSchedules, setTestSchedules] = useState<TestSchedule[]>([]);
  const [registrationPeriod, setRegistrationPeriod] = useState({
    isOpen: true,
    startDate: '',
    endDate: '',
    academicYear: '2025/2026'
  });
  const [showFloatingStats, setShowFloatingStats] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTestSchedules();
    loadRegistrationPeriod();
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

  const loadTestSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from('spmb_test_schedules')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('Error loading test schedules:', error);
        return;
      }
      
      setTestSchedules(data || []);
    } catch (error) {
      console.error('Error loading test schedules:', error);
    }
  };

  const loadRegistrationPeriod = async () => {
    try {
      const { data, error } = await supabase
        .from('spmb_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) {
        console.error('Error loading registration period:', error);
        return;
      }
      
      if (data) {
        setRegistrationPeriod({
          isOpen: data.is_open,
          startDate: data.start_date,
          endDate: data.end_date,
          academicYear: data.academic_year
        });
      }
    } catch (error) {
      console.error('Error loading registration period:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const programs = [
    {
      title: "TKA/TPA",
      description: "Taman Kanak-kanak Al-Qur'an & Taman Pendidikan Al-Qur'an",
      age: "4-12 tahun",
      duration: "2 tahun",
      icon: <BookOpen className="h-8 w-8 text-blue-600" />,
      features: ["Hafalan Juz 30", "Baca Tulis Al-Qur'an", "Akhlak Islami", "Sholat Berjamaah"]
    },
    {
      title: "PAUD/Kober",
      description: "Pendidikan Anak Usia Dini & Kelompok Bermain",
      age: "3-6 tahun",
      duration: "3 tahun", 
      icon: <Users className="h-8 w-8 text-green-600" />,
      features: ["Stimulasi Motorik", "Pengenalan Huruf Hijaiyah", "Bermain Edukatif", "Pembentukan Karakter"]
    },
    {
      title: "Diniyah",
      description: "Madrasah Diniyah - Pendidikan Agama Islam",
      age: "7-15 tahun", 
      duration: "6 tahun",
      icon: <Calendar className="h-8 w-8 text-purple-600" />,
      features: ["Fiqh & Aqidah", "Bahasa Arab", "Sejarah Islam", "Praktek Ibadah"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300 mb-4">
              <Calendar className="h-4 w-4 mr-2" />
              SPMB {registrationPeriod.academicYear}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Sistem Penerimaan Murid Baru
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Bergabunglah dengan keluarga besar Yayasan Al-Hikmah dalam mendidik generasi Qurani yang berakhlak mulia
            </p>
          </div>
          
          {/* Registration Period */}
          <Card className="mb-12 border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl">
            <CardContent className="p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Periode Pendaftaran</h2>
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-6">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 min-w-48">
                    <p className="text-sm text-blue-100 mb-1">Tahun Ajaran</p>
                    <p className="text-2xl font-bold">{registrationPeriod.academicYear}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 min-w-48">
                    <p className="text-sm text-blue-100 mb-1">Tanggal Mulai</p>
                    <p className="text-2xl font-bold">
                      {registrationPeriod.startDate 
                        ? new Date(registrationPeriod.startDate).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})
                        : 'Segera'}
                    </p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 min-w-48">
                    <p className="text-sm text-blue-100 mb-1">Tanggal Selesai</p>
                    <p className="text-2xl font-bold">
                      {registrationPeriod.endDate 
                        ? new Date(registrationPeriod.endDate).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})
                        : 'Hingga kuota terpenuhi'}
                    </p>
                  </div>
                </div>
                <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
                  <p className="text-lg font-semibold">
                    Status: {registrationPeriod.isOpen ? 'DIBUKA' : 'DITUTUP'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Programs Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Program Pendidikan</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {programs.map((program, index) => (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-center mb-6">
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-full">
                        {program.icon}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-center mb-3 text-gray-900 dark:text-white">{program.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-center mb-6 leading-relaxed">{program.description}</p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Usia</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{program.age}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Durasi</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{program.duration}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Keunggulan Program:</h4>
                      {program.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Test Schedules */}
          {testSchedules.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-center mb-8">Jadwal Tes Masuk</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testSchedules.map((schedule) => (
                  <Card key={schedule.id} className="hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <CardTitle>{schedule.title}</CardTitle>
                      <CardDescription>
                        Program: {schedule.program}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <Calendar className="h-5 w-5 text-blue-500 mt-0.5" />
                          <div>
                            <p className="font-medium">Tanggal & Waktu</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {new Date(schedule.date).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{schedule.time}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
                          <div>
                            <p className="font-medium">Lokasi</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{schedule.location}</p>
                          </div>
                        </div>
                        
                        {schedule.description && (
                          <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-300">{schedule.description}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Registration Form */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Formulir Pendaftaran</h2>
            <SPMBForm />
          </div>

          {/* Information & Consultation Section */}
          <Card className="mb-16 border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl">
            <CardContent className="p-12">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold mb-4">Informasi & Konsultasi</h3>
                <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                  Dapatkan informasi lengkap tentang program pendidikan kami dan konsultasi gratis dengan tim ahli
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <Button
                  onClick={handleDownloadBrochure}
                  className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-6 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center space-x-3"
                >
                  <Download className="h-6 w-6" />
                  <span className="text-lg">{buttonTexts.downloadBrosur}</span>
                </Button>
                
                <Button
                  onClick={handleContactAdmin}
                  className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-6 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center space-x-3"
                >
                  <MessageCircle className="h-6 w-6" />
                  <span className="text-lg">{buttonTexts.hubungiAdmin}</span>
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

export default SPMBPage;