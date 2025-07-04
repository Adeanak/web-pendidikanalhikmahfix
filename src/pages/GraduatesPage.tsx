import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GraduationCap, Award, Search, Filter } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Graduate } from '@/types';
import FloatingStats from '@/components/FloatingStats';

const GraduatesPage = () => {
  const [graduates, setGraduates] = useState<Graduate[]>([]);
  const [filteredGraduates, setFilteredGraduates] = useState<Graduate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedProgram, setSelectedProgram] = useState<string>('all');
  const [years, setYears] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFloatingStats, setShowFloatingStats] = useState(true);

  useEffect(() => {
    loadGraduates();
    loadSettings();
  }, []);

  useEffect(() => {
    filterGraduates();
  }, [graduates, searchTerm, selectedYear, selectedProgram]);

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

  const loadGraduates = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('graduates')
        .select('*')
        .order('graduation_year', { ascending: false })
        .order('name', { ascending: true });

      if (error) throw error;
      
      setGraduates(data || []);
      setFilteredGraduates(data || []);
      
      // Extract unique years for filtering
      const uniqueYears = Array.from(
        new Set((data || []).map(g => g.graduation_year.toString()))
      ).sort((a, b) => parseInt(b) - parseInt(a));
      
      setYears(['all', ...uniqueYears]);
    } catch (error) {
      console.error('Error loading graduates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterGraduates = () => {
    let filtered = [...graduates];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(graduate => 
        graduate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (graduate.achievement && graduate.achievement.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (graduate.current_school && graduate.current_school.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filter by year
    if (selectedYear !== 'all') {
      filtered = filtered.filter(graduate => graduate.graduation_year.toString() === selectedYear);
    }
    
    // Filter by program
    if (selectedProgram !== 'all') {
      filtered = filtered.filter(graduate => graduate.program === selectedProgram);
    }
    
    setFilteredGraduates(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-indigo-950 transition-colors duration-300">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300 mb-4">
              🎓 Lulusan Al-Hikmah
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Lulusan Kami
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Melihat perjalanan dan prestasi para alumni yang telah menyelesaikan pendidikan di Al-Hikmah
            </p>
          </div>
          
          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-10 transition-colors duration-300">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
                  <Input
                    placeholder="Cari nama, prestasi, atau sekolah lanjutan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                  <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Tahun:</span>
                  <div className="flex flex-wrap gap-1">
                    <Button
                      variant={selectedYear === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedYear('all')}
                      className={selectedYear === 'all' ? 'gradient-primary' : ''}
                    >
                      Semua
                    </Button>
                    {years.filter(y => y !== 'all').map((year) => (
                      <Button
                        key={year}
                        variant={selectedYear === year ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedYear(year)}
                        className={selectedYear === year ? 'gradient-primary' : ''}
                      >
                        {year}
                      </Button>
                    ))}
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
          </div>
          
          {/* Graduates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 bg-gray-200 rounded-full mb-4"></div>
                      <div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 w-20 bg-gray-200 rounded mb-4"></div>
                      <div className="space-y-2 w-full">
                        <div className="h-4 w-full bg-gray-200 rounded"></div>
                        <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : filteredGraduates.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <GraduationCap className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">Tidak ada lulusan yang ditemukan</h3>
                <p className="text-gray-500 dark:text-gray-400">Coba ubah filter pencarian Anda</p>
              </div>
            ) : (
              filteredGraduates.map((graduate) => (
                <Card key={graduate.id} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center">
                      {graduate.photo ? (
                        <img 
                          src={graduate.photo} 
                          alt={graduate.name}
                          className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-blue-100 dark:border-blue-800"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                          <GraduationCap className="h-10 w-10 text-white" />
                        </div>
                      )}
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 text-center">{graduate.name}</h3>
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="secondary">{graduate.program}</Badge>
                        <Badge variant="outline">{graduate.graduation_year}</Badge>
                      </div>
                      
                      {graduate.achievement && (
                        <div className="mb-3 w-full">
                          <div className="flex items-center mb-1">
                            <Award className="h-4 w-4 text-yellow-500 mr-1" />
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Prestasi:</p>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{graduate.achievement}</p>
                        </div>
                      )}
                      
                      {graduate.current_school && (
                        <div className="w-full">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Melanjutkan ke:</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{graduate.current_school}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          
          {/* Stats */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white mb-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Statistik Lulusan</h2>
              <p className="text-blue-100">Pencapaian lulusan Al-Hikmah dari tahun ke tahun</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-3xl font-bold mb-1">{graduates.length}+</div>
                <p className="text-sm">Total Lulusan</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-3xl font-bold mb-1">95%</div>
                <p className="text-sm">Melanjutkan Pendidikan</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-3xl font-bold mb-1">15+</div>
                <p className="text-sm">Tahun Pengalaman</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-3xl font-bold mb-1">25+</div>
                <p className="text-sm">Prestasi Nasional</p>
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

export default GraduatesPage;