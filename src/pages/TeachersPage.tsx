import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Users, Search, Filter, User, BookOpen, GraduationCap } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Teacher } from '@/types';
import { useButtonTexts } from '@/hooks/useButtonTexts';
import FloatingStats from '@/components/FloatingStats';

const TeachersPage = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgram, setSelectedProgram] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showFloatingStats, setShowFloatingStats] = useState(true);
  const { buttonTexts } = useButtonTexts();

  useEffect(() => {
    loadTeachers();
    loadSettings();
  }, []);

  useEffect(() => {
    filterTeachers();
  }, [teachers, searchTerm, selectedProgram]);

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

  const loadTeachers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      
      setTeachers(data || []);
      setFilteredTeachers(data || []);
    } catch (error) {
      console.error('Error loading teachers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterTeachers = () => {
    let filtered = [...teachers];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(teacher => 
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.education.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by program
    if (selectedProgram !== 'all') {
      filtered = filtered.filter(teacher => 
        teacher.program === selectedProgram || teacher.program === 'All'
      );
    }
    
    setFilteredTeachers(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-indigo-950">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300 mb-6 shadow-lg">
              <Users className="h-5 w-5 mr-2" />
              Tim Pengajar Profesional
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 dark:from-blue-400 dark:to-purple-400">
              Tenaga Pengajar Berkualitas
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Didukung oleh tenaga pengajar yang berpengalaman dan berdedikasi tinggi dalam membimbing generasi Islami yang berakhlak mulia
            </p>
          </div>
          
          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-10">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Cari nama pengajar, posisi, atau pendidikan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Program:</span>
                <div className="flex flex-wrap gap-1">
                  <Button
                    variant={selectedProgram === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedProgram('all')}
                    className={selectedProgram === 'all' ? 'gradient-primary' : ''}
                  >
                    Semua
                  </Button>
                  <Button
                    variant={selectedProgram === 'TKA/TPA' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedProgram('TKA/TPA')}
                    className={selectedProgram === 'TKA/TPA' ? 'gradient-primary' : ''}
                  >
                    TKA/TPA
                  </Button>
                  <Button
                    variant={selectedProgram === 'PAUD/KOBER' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedProgram('PAUD/KOBER')}
                    className={selectedProgram === 'PAUD/KOBER' ? 'gradient-primary' : ''}
                  >
                    PAUD/KOBER
                  </Button>
                  <Button
                    variant={selectedProgram === 'Diniyah' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedProgram('Diniyah')}
                    className={selectedProgram === 'Diniyah' ? 'gradient-primary' : ''}
                  >
                    Diniyah
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Teachers Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <div className="aspect-square bg-gray-200 dark:bg-gray-700"></div>
                  <CardContent className="p-6">
                    <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : filteredTeachers.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="w-24 h-24 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">Belum Ada Pengajar</h3>
                <p className="text-gray-500 dark:text-gray-400">Data pengajar akan ditampilkan di sini</p>
              </div>
            ) : (
              filteredTeachers.map((teacher) => (
                <Card key={teacher.id} className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
                  <div className="aspect-square bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 flex items-center justify-center relative overflow-hidden">
                    {teacher.photo ? (
                      <img 
                        src={teacher.photo} 
                        alt={teacher.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white text-3xl font-bold">
                          {teacher.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{teacher.name}</h3>
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm">{teacher.position}</p>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 font-medium">{teacher.program}</p>
                    <div className="space-y-1">
                      <p className="text-gray-500 dark:text-gray-400 text-xs flex items-center">
                        <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                        {teacher.education}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs flex items-center">
                        <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                        Pengalaman: {teacher.experience}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          
          {/* Stats */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white mb-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Tim Pengajar Kami</h2>
              <p className="text-blue-100">Profesional dan berdedikasi dalam mendidik generasi Islam</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-3xl font-bold mb-1">{teachers.length}+</div>
                <p className="text-sm">Total Pengajar</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-3xl font-bold mb-1">S1/S2</div>
                <p className="text-sm">Kualifikasi Akademik</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-3xl font-bold mb-1">10+</div>
                <p className="text-sm">Tahun Pengalaman</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-3xl font-bold mb-1">100%</div>
                <p className="text-sm">Bersertifikasi</p>
              </div>
            </div>
          </div>
          
          {/* CTA */}
          <Card className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 max-w-4xl mx-auto">
            <CardContent className="p-0 text-center">
              <GraduationCap className="h-16 w-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Bergabung dengan Tim Pengajar
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                Kami selalu mencari pendidik berbakat dan berdedikasi untuk bergabung dengan tim kami. 
                Jika Anda memiliki passion dalam pendidikan Islam, hubungi kami.
              </p>
              <Button 
                onClick={() => window.location.href = '/#contact'}
                className="gradient-primary text-white font-semibold px-8 py-3 rounded-xl hover:scale-105 transition-transform duration-200"
              >
                {buttonTexts.hubungiKami}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      
      {showFloatingStats && <FloatingStats />}
      <Footer />
    </div>
  );
};

export default TeachersPage;