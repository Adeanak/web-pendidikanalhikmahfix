import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Image, Calendar, Camera } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import FloatingStats from '@/components/FloatingStats';

interface PhotoAlbum {
  id: string;
  title: string;
  description: string;
  date: string;
  cover_image: string;
  images: string[];
  category: string;
}

const AlbumPage = () => {
  const [albums, setAlbums] = useState<PhotoAlbum[]>([]);
  const [filteredAlbums, setFilteredAlbums] = useState<PhotoAlbum[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showFloatingStats, setShowFloatingStats] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState<PhotoAlbum | null>(null);
  const [showLightbox, setShowLightbox] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Sample data - in a real app, this would come from Supabase
  const sampleAlbums: PhotoAlbum[] = [
    {
      id: '1',
      title: 'Wisuda Angkatan 2025',
      description: 'Dokumentasi acara wisuda santri Al-Hikmah tahun 2025',
      date: '2025-06-15',
      cover_image: 'https://images.pexels.com/photos/5212703/pexels-photo-5212703.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      images: [
        'https://images.pexels.com/photos/5212703/pexels-photo-5212703.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/5905445/pexels-photo-5905445.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/5905710/pexels-photo-5905710.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/5905458/pexels-photo-5905458.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      ],
      category: 'Wisuda'
    },
    {
      id: '2',
      title: 'Lomba Tahfidz 2025',
      description: 'Kompetisi hafalan Al-Quran tingkat kabupaten',
      date: '2025-04-20',
      cover_image: 'https://images.pexels.com/photos/8471835/pexels-photo-8471835.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      images: [
        'https://images.pexels.com/photos/8471835/pexels-photo-8471835.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/8471788/pexels-photo-8471788.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/8471799/pexels-photo-8471799.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      ],
      category: 'Lomba'
    },
    {
      id: '3',
      title: 'Kegiatan Belajar PAUD',
      description: 'Aktivitas belajar sambil bermain di kelas PAUD',
      date: '2025-03-10',
      cover_image: 'https://images.pexels.com/photos/8535214/pexels-photo-8535214.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      images: [
        'https://images.pexels.com/photos/8535214/pexels-photo-8535214.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/8535227/pexels-photo-8535227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/8473456/pexels-photo-8473456.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/8473457/pexels-photo-8473457.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      ],
      category: 'Kegiatan Belajar'
    },
    {
      id: '4',
      title: 'Peringatan Maulid Nabi 2025',
      description: 'Perayaan Maulid Nabi Muhammad SAW',
      date: '2025-02-05',
      cover_image: 'https://images.pexels.com/photos/5905905/pexels-photo-5905905.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      images: [
        'https://images.pexels.com/photos/5905905/pexels-photo-5905905.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/5905904/pexels-photo-5905904.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/5905902/pexels-photo-5905902.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      ],
      category: 'Perayaan'
    },
    {
      id: '5',
      title: 'Kunjungan Edukatif 2025',
      description: 'Kunjungan ke museum dan tempat bersejarah',
      date: '2025-05-12',
      cover_image: 'https://images.pexels.com/photos/8364026/pexels-photo-8364026.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      images: [
        'https://images.pexels.com/photos/8364026/pexels-photo-8364026.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/8364070/pexels-photo-8364070.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/8364071/pexels-photo-8364071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      ],
      category: 'Kunjungan'
    },
    {
      id: '6',
      title: 'Pentas Seni Akhir Tahun 2024',
      description: 'Penampilan seni dan kreativitas santri',
      date: '2024-12-20',
      cover_image: 'https://images.pexels.com/photos/8535239/pexels-photo-8535239.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      images: [
        'https://images.pexels.com/photos/8535239/pexels-photo-8535239.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/8535238/pexels-photo-8535238.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/8535237/pexels-photo-8535237.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      ],
      category: 'Pentas Seni'
    }
  ];

  useEffect(() => {
    loadAlbums();
    loadSettings();
  }, []);

  useEffect(() => {
    filterAlbums();
  }, [albums, searchTerm, selectedCategory, selectedYear]);

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

  const loadAlbums = async () => {
    try {
      setIsLoading(true);
      
      // In a real app, this would fetch from Supabase
      // For now, we'll use the sample data
      setTimeout(() => {
        setAlbums(sampleAlbums);
        setFilteredAlbums(sampleAlbums);
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error loading albums:', error);
      setIsLoading(false);
    }
  };

  const filterAlbums = () => {
    let filtered = [...albums];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(album => 
        album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        album.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(album => album.category === selectedCategory);
    }
    
    // Filter by year
    if (selectedYear !== 'all') {
      filtered = filtered.filter(album => {
        const albumYear = new Date(album.date).getFullYear().toString();
        return albumYear === selectedYear;
      });
    }
    
    setFilteredAlbums(filtered);
  };

  const getCategories = () => {
    const categories = new Set(albums.map(album => album.category));
    return ['all', ...Array.from(categories)];
  };

  const getYears = () => {
    const years = new Set(albums.map(album => new Date(album.date).getFullYear().toString()));
    return ['all', ...Array.from(years).sort((a, b) => parseInt(b) - parseInt(a))];
  };

  const openAlbum = (album: PhotoAlbum) => {
    setSelectedAlbum(album);
  };

  const openLightbox = (album: PhotoAlbum, index: number) => {
    setSelectedAlbum(album);
    setCurrentImageIndex(index);
    setShowLightbox(true);
  };

  const nextImage = () => {
    if (!selectedAlbum) return;
    setCurrentImageIndex((prev) => (prev + 1) % selectedAlbum.images.length);
  };

  const prevImage = () => {
    if (!selectedAlbum) return;
    setCurrentImageIndex((prev) => (prev - 1 + selectedAlbum.images.length) % selectedAlbum.images.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-indigo-950 transition-colors duration-300">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300 mb-4">
              <Camera className="h-4 w-4 mr-2" />
              Album Foto
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Galeri Kegiatan
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Dokumentasi berbagai kegiatan dan momen berharga di Yayasan Al-Hikmah
            </p>
          </div>
          
          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-10 transition-colors duration-300">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
                  <Input
                    placeholder="Cari album..."
                    className="pl-10 h-12 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                  <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Kategori:</span>
                  <div className="flex flex-wrap gap-1">
                    {getCategories().map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className={selectedCategory === category ? 'gradient-primary' : ''}
                      >
                        {category === 'all' ? 'Semua' : category}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                  <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Tahun:</span>
                  <div className="flex flex-wrap gap-1">
                    {getYears().map((year) => (
                      <Button
                        key={year}
                        variant={selectedYear === year ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedYear(year)}
                        className={selectedYear === year ? 'gradient-primary' : ''}
                      >
                        {year === 'all' ? 'Semua' : year}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Albums Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="animate-pulse bg-white dark:bg-gray-800">
                  <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700"></div>
                  <CardContent className="p-6">
                    <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : filteredAlbums.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Image className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">Tidak ada album yang ditemukan</h3>
                <p className="text-gray-500 dark:text-gray-400">Coba ubah filter pencarian Anda</p>
              </div>
            ) : (
              filteredAlbums.map((album) => (
                <Card 
                  key={album.id} 
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  onClick={() => openAlbum(album)}
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img 
                      src={album.cover_image} 
                      alt={album.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-4 text-white">
                        <p className="text-sm font-medium">{album.images.length} Foto</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{album.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{new Date(album.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{album.description}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          
          {/* Album Detail Modal */}
          {selectedAlbum && (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedAlbum(null)}>
              <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden transition-colors duration-300" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedAlbum.title}</h2>
                  <p className="text-gray-500 dark:text-gray-400">{new Date(selectedAlbum.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 dark:text-gray-300 mb-6">{selectedAlbum.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedAlbum.images.map((image, index) => (
                      <div 
                        key={index} 
                        className="aspect-square relative overflow-hidden rounded-lg cursor-pointer"
                        onClick={() => openLightbox(selectedAlbum, index)}
                      >
                        <img 
                          src={image} 
                          alt={`${selectedAlbum.title} - ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex justify-end">
                  <Button variant="outline" onClick={() => setSelectedAlbum(null)}>
                    Tutup
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Lightbox */}
          {showLightbox && selectedAlbum && (
            <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" onClick={() => setShowLightbox(false)}>
              <div className="relative max-w-6xl w-full h-full flex items-center justify-center p-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 z-10"
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </Button>
                
                <img 
                  src={selectedAlbum.images[currentImageIndex]} 
                  alt={`${selectedAlbum.title} - ${currentImageIndex + 1}`}
                  className="max-w-full max-h-[80vh] object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 z-10"
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </Button>
                
                <div className="absolute bottom-4 left-0 right-0 text-center text-white">
                  <p>{currentImageIndex + 1} / {selectedAlbum.images.length}</p>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-4 right-4 text-white hover:bg-white/20"
                  onClick={(e) => { e.stopPropagation(); setShowLightbox(false); }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {showFloatingStats && <FloatingStats />}
      <Footer />
    </div>
  );
};

export default AlbumPage;