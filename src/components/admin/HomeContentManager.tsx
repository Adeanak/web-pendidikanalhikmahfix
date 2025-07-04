import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Video, 
  Image as ImageIcon, 
  Type,
  Star,
  Award,
  Users,
  BookOpen,
  Save,
  Minus
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface ButtonAction {
  id: string;
  name: string;
  text: string;
  action: string;
  url?: string;
  enabled: boolean;
}

interface Feature {
  id: string;
  icon: string;
  text: string;
  color: string;
  bgColor: string;
}

interface Statistic {
  id: string;
  icon: string;
  label: string;
  value: string;
  color: string;
  bgColor: string;
}

interface Program {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  bgColor: string;
}

interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  image?: string;
  video?: string;
}

interface HomeContent {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroImage?: string;
  heroVideo?: string;
  features: Feature[];
  statistics: Statistic[];
  programs: Program[];
  achievements: Achievement[];
  buttonActions: ButtonAction[];
  aboutTitle?: string;
  aboutDescription?: string;
  aboutImage?: string;
  aboutValues?: any[];
  aboutStats?: any[];
  graduatesTitle?: string;
  graduatesDescription?: string;
  graduatesStats?: any[];
  graduatesAchievements?: any[];
  messagesTitle?: string;
  messagesDescription?: string;
  locationTitle?: string;
  locationDescription?: string;
  locationAddress?: string;
  locationPhone?: string;
  locationHours?: string;
  locationMapUrl?: string;
  spmbTitle?: string;
  spmbDescription?: string;
  spmbPrograms?: any[];
}

const HomeContentManager = () => {
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
    achievements: [
      { id: '1', icon: '🏆', title: 'Juara 1 Lomba Tahfidz Tingkat Kabupaten', description: 'Prestasi gemilang santri kami dalam kompetisi hafalan Al-Quran' },
      { id: '2', icon: '⭐', title: 'Akreditasi A dari Kemenag', description: 'Pengakuan resmi atas kualitas pendidikan yang kami berikan' },
      { id: '3', icon: '🌟', title: '15 Tahun Mengabdi', description: 'Dedikasi panjang dalam mencerdaskan generasi bangsa' },
    ],
    buttonActions: [
      { id: '1', name: 'daftar_sekarang', text: 'Daftar Sekarang', action: 'navigate', url: '/spmb', enabled: true },
      { id: '2', name: 'video_profil', text: 'Video Profil', action: 'modal', enabled: true },
      { id: '3', name: 'konsultasi_gratis', text: 'Konsultasi Gratis', action: 'contact', enabled: true },
      { id: '4', name: 'jadwal_kunjungan', text: 'Jadwal Kunjungan', action: 'contact', enabled: true },
      { id: '5', name: 'daftar_online', text: 'Daftar Online', action: 'navigate', url: '/spmb', enabled: true },
      { id: '6', name: 'download_brosur', text: 'Download Brosur', action: 'download', enabled: true },
      { id: '7', name: 'hubungi_alumni', text: 'Hubungi Alumni', action: 'contact', enabled: true },
    ],
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
    ],
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
    ],
    messagesTitle: 'Pesan & Rating',
    messagesDescription: 'Apa kata orang tua tentang Yayasan Al-Hikmah',
    locationTitle: 'Lokasi Yayasan',
    locationDescription: 'Kunjungi kami di lokasi berikut',
    locationAddress: 'Kp. Tanjung RT 03 RW 07, Desa Tanjungsari, Kecamatan Cangkuang, Kabupaten Bandung',
    locationPhone: '089677921985',
    locationHours: '08:00 - 16:00 WIB',
    locationMapUrl: 'https://maps.app.goo.gl/yZpSwizJDcgAuFL78',
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

  const [activeSection, setActiveSection] = useState('hero');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('website_settings')
        .select('settings')
        .eq('id', 1)
        .single();
      
      if (error) {
        console.log('Using default home content');
        setIsLoading(false);
        return;
      }
      
      if (data && data.settings && data.settings.homeContent) {
        setContent({ ...content, ...data.settings.homeContent });
      }
    } catch (error) {
      console.error('Error loading home content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveContent = async () => {
    setIsLoading(true);
    try {
      // Get current settings
      const { data, error: fetchError } = await supabase
        .from('website_settings')
        .select('settings')
        .eq('id', 1)
        .single();
      
      let settings = {};
      if (!fetchError && data) {
        settings = data.settings || {};
      }
      
      // Update homeContent in settings
      settings = {
        ...settings,
        homeContent: content
      };
      
      // Save updated settings
      const { error } = await supabase
        .from('website_settings')
        .upsert({
          id: 1,
          settings: settings,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      toast({
        title: "Berhasil",
        description: "Konten halaman utama telah disimpan",
      });
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan konten",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (type: 'image' | 'video', callback: (url: string) => void) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'image' ? 'image/*' : 'video/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          setIsLoading(true);
          
          // Create a unique file name
          const fileExt = file.name.split('.').pop();
          const fileName = `home-${type}-${Date.now()}.${fileExt}`;
          const filePath = `website/${fileName}`;
          
          // Upload to Supabase Storage
          const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(filePath, file);
          
          if (uploadError) throw uploadError;
          
          // Get the public URL
          const { data } = supabase.storage
            .from('images')
            .getPublicUrl(filePath);
          
          if (data) {
            callback(data.publicUrl);
            
            toast({
              title: "Berhasil",
              description: `${type === 'image' ? 'Gambar' : 'Video'} berhasil diunggah`,
            });
          }
        } catch (error) {
          console.error(`Error uploading ${type}:`, error);
          toast({
            title: "Error",
            description: `Gagal mengunggah ${type === 'image' ? 'gambar' : 'video'}`,
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    input.click();
  };

  const addItem = (section: string) => {
    const newItem = {
      id: Date.now().toString(),
      icon: section === 'features' ? 'CheckCircle' : section === 'statistics' ? 'Star' : section === 'programs' ? '📚' : section === 'buttonActions' ? 'Button' : '🎉',
      text: section === 'features' ? 'Fitur Baru' : section === 'buttonActions' ? 'Tombol Baru' : '',
      title: section !== 'features' && section !== 'buttonActions' ? 'Judul Baru' : '',
      label: section === 'statistics' ? 'Label' : '',
      value: section === 'statistics' ? '0' : '',
      subtitle: section === 'programs' ? 'Subtitle' : '',
      description: section === 'programs' || section === 'achievements' ? 'Deskripsi' : '',
      name: section === 'buttonActions' ? 'button_baru' : '',
      action: section === 'buttonActions' ? 'navigate' : '',
      enabled: section === 'buttonActions' ? true : '',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    };

    setContent(prev => ({
      ...prev,
      [section]: [...prev[section as keyof HomeContent] as any[], newItem]
    }));
  };

  const updateItem = (section: string, id: string, updates: any) => {
    setContent(prev => ({
      ...prev,
      [section]: (prev[section as keyof HomeContent] as any[]).map((item: any) => 
        item.id === id ? { ...item, ...updates } : item
      )
    }));
  };

  const deleteItem = (section: string, id: string) => {
    setContent(prev => ({
      ...prev,
      [section]: (prev[section as keyof HomeContent] as any[]).filter((item: any) => item.id !== id)
    }));
  };

  const sections = [
    { id: 'hero', name: 'Hero Section', icon: Star },
    { id: 'features', name: 'Fitur Unggulan', icon: Award },
    { id: 'statistics', name: 'Statistik', icon: Users },
    { id: 'programs', name: 'Program', icon: BookOpen },
    { id: 'achievements', name: 'Prestasi & Unggulan', icon: Award },
    { id: 'buttonActions', name: 'Aksi Tombol', icon: Type },
    { id: 'about', name: 'Tentang Kami', icon: Users },
    { id: 'graduates', name: 'Lulusan', icon: Award },
    { id: 'messages', name: 'Pesan & Rating', icon: Type },
    { id: 'location', name: 'Lokasi', icon: Type },
    { id: 'ppdb', name: 'SPMB', icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Kelola Konten Halaman Utama</h3>
          <p className="text-gray-600">Edit semua konten yang ditampilkan di halaman utama</p>
        </div>
        <Button onClick={saveContent} disabled={isLoading} className="gradient-primary">
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Menyimpan...' : 'Simpan Semua'}
        </Button>
      </div>

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {sections.map((section) => (
          <Button
            key={section.id}
            variant={activeSection === section.id ? 'default' : 'outline'}
            onClick={() => setActiveSection(section.id)}
            className="flex items-center space-x-2"
          >
            <section.icon className="h-4 w-4" />
            <span>{section.name}</span>
          </Button>
        ))}
      </div>

      {/* Hero Section */}
      {activeSection === 'hero' && (
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="heroTitle">Judul Utama</Label>
                <Input
                  id="heroTitle"
                  value={content.heroTitle}
                  onChange={(e) => setContent(prev => ({ ...prev, heroTitle: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="heroSubtitle">Subtitle</Label>
                <Input
                  id="heroSubtitle"
                  value={content.heroSubtitle}
                  onChange={(e) => setContent(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="heroDescription">Deskripsi</Label>
              <Textarea
                id="heroDescription"
                value={content.heroDescription}
                onChange={(e) => setContent(prev => ({ ...prev, heroDescription: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Gambar Hero</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Button
                    variant="outline"
                    onClick={() => handleFileUpload('image', (url) => setContent(prev => ({ ...prev, heroImage: url })))}
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Upload Gambar
                  </Button>
                  {content.heroImage && (
                    <img src={content.heroImage} alt="Hero" className="h-16 w-24 object-cover rounded" />
                  )}
                </div>
              </div>
              <div>
                <Label>Video Hero</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Button
                    variant="outline"
                    onClick={() => handleFileUpload('video', (url) => setContent(prev => ({ ...prev, heroVideo: url })))}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Upload Video
                  </Button>
                  {content.heroVideo && (
                    <Badge variant="secondary">Video tersimpan</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* About Section */}
      {activeSection === 'about' && (
        <Card>
          <CardHeader>
            <CardTitle>Tentang Kami</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="aboutTitle">Judul Tentang Kami</Label>
              <Input
                id="aboutTitle"
                value={content.aboutTitle || ''}
                onChange={(e) => setContent(prev => ({ ...prev, aboutTitle: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="aboutDescription">Deskripsi Tentang Kami</Label>
              <Textarea
                id="aboutDescription"
                value={content.aboutDescription || ''}
                onChange={(e) => setContent(prev => ({ ...prev, aboutDescription: e.target.value }))}
                rows={4}
              />
            </div>
            <div>
              <Label>Gambar Tentang Kami</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Button
                  variant="outline"
                  onClick={() => handleFileUpload('image', (url) => setContent(prev => ({ ...prev, aboutImage: url })))}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Upload Gambar
                </Button>
                {content.aboutImage && (
                  <img src={content.aboutImage} alt="About" className="h-16 w-24 object-cover rounded" />
                )}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Nilai-nilai Kami</Label>
                <Button 
                  size="sm" 
                  onClick={() => {
                    const newValues = [...(content.aboutValues || [])];
                    newValues.push({
                      id: Date.now().toString(),
                      icon: 'Heart',
                      title: 'Nilai Baru',
                      description: 'Deskripsi nilai baru'
                    });
                    setContent(prev => ({ ...prev, aboutValues: newValues }));
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Nilai
                </Button>
              </div>
              
              <div className="space-y-3">
                {(content.aboutValues || []).map((value, index) => (
                  <div key={value.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{value.title}</div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const newValues = [...(content.aboutValues || [])];
                            newValues.splice(index, 1);
                            setContent(prev => ({ ...prev, aboutValues: newValues }));
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div>
                        <Label>Icon</Label>
                        <select
                          value={value.icon}
                          onChange={(e) => {
                            const newValues = [...(content.aboutValues || [])];
                            newValues[index] = { ...newValues[index], icon: e.target.value };
                            setContent(prev => ({ ...prev, aboutValues: newValues }));
                          }}
                          className="w-full p-2 border rounded"
                        >
                          <option value="Heart">Heart</option>
                          <option value="BookOpen">BookOpen</option>
                          <option value="Users">Users</option>
                          <option value="Award">Award</option>
                        </select>
                      </div>
                      <div>
                        <Label>Judul</Label>
                        <Input
                          value={value.title}
                          onChange={(e) => {
                            const newValues = [...(content.aboutValues || [])];
                            newValues[index] = { ...newValues[index], title: e.target.value };
                            setContent(prev => ({ ...prev, aboutValues: newValues }));
                          }}
                        />
                      </div>
                      <div>
                        <Label>Deskripsi</Label>
                        <Input
                          value={value.description}
                          onChange={(e) => {
                            const newValues = [...(content.aboutValues || [])];
                            newValues[index] = { ...newValues[index], description: e.target.value };
                            setContent(prev => ({ ...prev, aboutValues: newValues }));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Statistik Tentang Kami</Label>
                <Button 
                  size="sm" 
                  onClick={() => {
                    const newStats = [...(content.aboutStats || [])];
                    newStats.push({
                      id: Date.now().toString(),
                      number: '0+',
                      label: 'Label Baru'
                    });
                    setContent(prev => ({ ...prev, aboutStats: newStats }));
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Statistik
                </Button>
              </div>
              
              <div className="space-y-3">
                {(content.aboutStats || []).map((stat, index) => (
                  <div key={stat.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{stat.label}</div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const newStats = [...(content.aboutStats || [])];
                            newStats.splice(index, 1);
                            setContent(prev => ({ ...prev, aboutStats: newStats }));
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <Label>Angka</Label>
                        <Input
                          value={stat.number}
                          onChange={(e) => {
                            const newStats = [...(content.aboutStats || [])];
                            newStats[index] = { ...newStats[index], number: e.target.value };
                            setContent(prev => ({ ...prev, aboutStats: newStats }));
                          }}
                        />
                      </div>
                      <div>
                        <Label>Label</Label>
                        <Input
                          value={stat.label}
                          onChange={(e) => {
                            const newStats = [...(content.aboutStats || [])];
                            newStats[index] = { ...newStats[index], label: e.target.value };
                            setContent(prev => ({ ...prev, aboutStats: newStats }));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Graduates Section */}
      {activeSection === 'graduates' && (
        <Card>
          <CardHeader>
            <CardTitle>Lulusan & Prestasi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="graduatesTitle">Judul Lulusan</Label>
              <Input
                id="graduatesTitle"
                value={content.graduatesTitle || ''}
                onChange={(e) => setContent(prev => ({ ...prev, graduatesTitle: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="graduatesDescription">Deskripsi Lulusan</Label>
              <Textarea
                id="graduatesDescription"
                value={content.graduatesDescription || ''}
                onChange={(e) => setContent(prev => ({ ...prev, graduatesDescription: e.target.value }))}
                rows={3}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Statistik Lulusan</Label>
                <Button 
                  size="sm" 
                  onClick={() => {
                    const newStats = [...(content.graduatesStats || [])];
                    newStats.push({
                      id: Date.now().toString(),
                      icon: 'Award',
                      label: 'Label Baru',
                      value: '0+',
                      color: 'from-blue-500 to-cyan-500'
                    });
                    setContent(prev => ({ ...prev, graduatesStats: newStats }));
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Statistik
                </Button>
              </div>
              
              <div className="space-y-3">
                {(content.graduatesStats || []).map((stat, index) => (
                  <div key={stat.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{stat.label}</div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const newStats = [...(content.graduatesStats || [])];
                            newStats.splice(index, 1);
                            setContent(prev => ({ ...prev, graduatesStats: newStats }));
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div>
                        <Label>Icon</Label>
                        <select
                          value={stat.icon}
                          onChange={(e) => {
                            const newStats = [...(content.graduatesStats || [])];
                            newStats[index] = { ...newStats[index], icon: e.target.value };
                            setContent(prev => ({ ...prev, graduatesStats: newStats }));
                          }}
                          className="w-full p-2 border rounded"
                        >
                          <option value="GraduationCap">GraduationCap</option>
                          <option value="Award">Award</option>
                          <option value="BookOpen">BookOpen</option>
                          <option value="Users">Users</option>
                        </select>
                      </div>
                      <div>
                        <Label>Label</Label>
                        <Input
                          value={stat.label}
                          onChange={(e) => {
                            const newStats = [...(content.graduatesStats || [])];
                            newStats[index] = { ...newStats[index], label: e.target.value };
                            setContent(prev => ({ ...prev, graduatesStats: newStats }));
                          }}
                        />
                      </div>
                      <div>
                        <Label>Nilai</Label>
                        <Input
                          value={stat.value}
                          onChange={(e) => {
                            const newStats = [...(content.graduatesStats || [])];
                            newStats[index] = { ...newStats[index], value: e.target.value };
                            setContent(prev => ({ ...prev, graduatesStats: newStats }));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Prestasi Lulusan</Label>
                <Button 
                  size="sm" 
                  onClick={() => {
                    const newAchievements = [...(content.graduatesAchievements || [])];
                    newAchievements.push({
                      id: Date.now().toString(),
                      year: new Date().getFullYear().toString(),
                      title: 'Prestasi Baru',
                      student: 'Nama Siswa',
                      description: 'Deskripsi prestasi'
                    });
                    setContent(prev => ({ ...prev, graduatesAchievements: newAchievements }));
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Prestasi
                </Button>
              </div>
              
              <div className="space-y-3">
                {(content.graduatesAchievements || []).map((achievement, index) => (
                  <div key={achievement.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{achievement.title}</div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const newAchievements = [...(content.graduatesAchievements || [])];
                            newAchievements.splice(index, 1);
                            setContent(prev => ({ ...prev, graduatesAchievements: newAchievements }));
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <Label>Tahun</Label>
                        <Input
                          value={achievement.year}
                          onChange={(e) => {
                            const newAchievements = [...(content.graduatesAchievements || [])];
                            newAchievements[index] = { ...newAchievements[index], year: e.target.value };
                            setContent(prev => ({ ...prev, graduatesAchievements: newAchievements }));
                          }}
                        />
                      </div>
                      <div>
                        <Label>Judul Prestasi</Label>
                        <Input
                          value={achievement.title}
                          onChange={(e) => {
                            const newAchievements = [...(content.graduatesAchievements || [])];
                            newAchievements[index] = { ...newAchievements[index], title: e.target.value };
                            setContent(prev => ({ ...prev, graduatesAchievements: newAchievements }));
                          }}
                        />
                      </div>
                      <div>
                        <Label>Nama Siswa</Label>
                        <Input
                          value={achievement.student}
                          onChange={(e) => {
                            const newAchievements = [...(content.graduatesAchievements || [])];
                            newAchievements[index] = { ...newAchievements[index], student: e.target.value };
                            setContent(prev => ({ ...prev, graduatesAchievements: newAchievements }));
                          }}
                        />
                      </div>
                      <div>
                        <Label>Deskripsi</Label>
                        <Input
                          value={achievement.description}
                          onChange={(e) => {
                            const newAchievements = [...(content.graduatesAchievements || [])];
                            newAchievements[index] = { ...newAchievements[index], description: e.target.value };
                            setContent(prev => ({ ...prev, graduatesAchievements: newAchievements }));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Messages Section */}
      {activeSection === 'messages' && (
        <Card>
          <CardHeader>
            <CardTitle>Pesan & Rating</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="messagesTitle">Judul Pesan & Rating</Label>
              <Input
                id="messagesTitle"
                value={content.messagesTitle || ''}
                onChange={(e) => setContent(prev => ({ ...prev, messagesTitle: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="messagesDescription">Deskripsi Pesan & Rating</Label>
              <Textarea
                id="messagesDescription"
                value={content.messagesDescription || ''}
                onChange={(e) => setContent(prev => ({ ...prev, messagesDescription: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600">
                Pesan dan rating dikelola melalui menu "Pesan" di panel admin. Pesan yang disetujui akan ditampilkan di halaman utama.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Location Section */}
      {activeSection === 'location' && (
        <Card>
          <CardHeader>
            <CardTitle>Lokasi Yayasan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="locationTitle">Judul Lokasi</Label>
              <Input
                id="locationTitle"
                value={content.locationTitle || ''}
                onChange={(e) => setContent(prev => ({ ...prev, locationTitle: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="locationDescription">Deskripsi Lokasi</Label>
              <Input
                id="locationDescription"
                value={content.locationDescription || ''}
                onChange={(e) => setContent(prev => ({ ...prev, locationDescription: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="locationAddress">Alamat Lengkap</Label>
              <Textarea
                id="locationAddress"
                value={content.locationAddress || ''}
                onChange={(e) => setContent(prev => ({ ...prev, locationAddress: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="locationPhone">Nomor Telepon</Label>
                <Input
                  id="locationPhone"
                  value={content.locationPhone || ''}
                  onChange={(e) => setContent(prev => ({ ...prev, locationPhone: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="locationHours">Jam Operasional</Label>
                <Input
                  id="locationHours"
                  value={content.locationHours || ''}
                  onChange={(e) => setContent(prev => ({ ...prev, locationHours: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="locationMapUrl">URL Google Maps</Label>
              <Input
                id="locationMapUrl"
                value={content.locationMapUrl || ''}
                onChange={(e) => setContent(prev => ({ ...prev, locationMapUrl: e.target.value }))}
                placeholder="https://maps.app.goo.gl/..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Masukkan URL Google Maps untuk lokasi yayasan
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SPMB Section */}
        {activeSection === 'ppdb' && (
          <Card>
            <CardHeader>
              <CardTitle>SPMB (Seleksi Penerimaan Mahasiswa Baru)</CardTitle>
            </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="spmbTitle">Judul SPMB</Label>
              <Input
                id="spmbTitle"
                value={content.spmbTitle || ''}
                onChange={(e) => setContent(prev => ({ ...prev, spmbTitle: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="spmbDescription">Deskripsi SPMB</Label>
              <Textarea
                id="spmbDescription"
                value={content.spmbDescription || ''}
                onChange={(e) => setContent(prev => ({ ...prev, spmbDescription: e.target.value }))}
                rows={3}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Program SPMB</Label>
                <Button 
                  size="sm" 
                  onClick={() => {
                    const newPrograms = [...(content.spmbPrograms || [])];
                    newPrograms.push({
                      id: Date.now().toString(),
                      title: 'Program Baru',
                      description: 'Deskripsi program',
                      age: '0-0 tahun',
                      duration: '0 tahun',
                      icon: 'BookOpen',
                      features: ['Fitur 1', 'Fitur 2', 'Fitur 3', 'Fitur 4']
                    });
                    setContent(prev => ({ ...prev, spmbPrograms: newPrograms }));
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Program
                </Button>
              </div>
              
              <div className="space-y-3">
                {(content.spmbPrograms || []).map((program, index) => (
                  <div key={program.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{program.title}</div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const newPrograms = [...(content.spmbPrograms || [])];
                            newPrograms.splice(index, 1);
                            setContent(prev => ({ ...prev, spmbPrograms: newPrograms }));
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <Label>Judul Program</Label>
                        <Input
                          value={program.title}
                          onChange={(e) => {
                            const newPrograms = [...(content.spmbPrograms || [])];
                            newPrograms[index] = { ...newPrograms[index], title: e.target.value };
                            setContent(prev => ({ ...prev, spmbPrograms: newPrograms }));
                          }}
                        />
                      </div>
                      <div>
                        <Label>Deskripsi</Label>
                        <Input
                          value={program.description}
                          onChange={(e) => {
                            const newPrograms = [...(content.spmbPrograms || [])];
                            newPrograms[index] = { ...newPrograms[index], description: e.target.value };
                            setContent(prev => ({ ...prev, spmbPrograms: newPrograms }));
                          }}
                        />
                      </div>
                      <div>
                        <Label>Usia</Label>
                        <Input
                          value={program.age}
                          onChange={(e) => {
                            const newPrograms = [...(content.spmbPrograms || [])];
                            newPrograms[index] = { ...newPrograms[index], age: e.target.value };
                            setContent(prev => ({ ...prev, spmbPrograms: newPrograms }));
                          }}
                        />
                      </div>
                      <div>
                        <Label>Durasi</Label>
                        <Input
                          value={program.duration}
                          onChange={(e) => {
                            const newPrograms = [...(content.spmbPrograms || [])];
                            newPrograms[index] = { ...newPrograms[index], duration: e.target.value };
                            setContent(prev => ({ ...prev, spmbPrograms: newPrograms }));
                          }}
                        />
                      </div>
                      <div>
                        <Label>Icon</Label>
                        <select
                          value={program.icon}
                          onChange={(e) => {
                            const newPrograms = [...(content.spmbPrograms || [])];
                            newPrograms[index] = { ...newPrograms[index], icon: e.target.value };
                            setContent(prev => ({ ...prev, spmbPrograms: newPrograms }));
                          }}
                          className="w-full p-2 border rounded"
                        >
                          <option value="BookOpen">BookOpen</option>
                          <option value="Users">Users</option>
                          <option value="Calendar">Calendar</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="mb-2 block">Keunggulan Program</Label>
                      {program.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2 mb-2">
                          <Input
                            value={feature}
                            onChange={(e) => {
                              const newPrograms = [...(content.spmbPrograms || [])];
                              const newFeatures = [...newPrograms[index].features];
                              newFeatures[featureIndex] = e.target.value;
                              newPrograms[index] = { ...newPrograms[index], features: newFeatures };
                              setContent(prev => ({ ...prev, spmbPrograms: newPrograms }));
                            }}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newPrograms = [...(content.spmbPrograms || [])];
                              const newFeatures = [...newPrograms[index].features];
                              newFeatures.splice(featureIndex, 1);
                              newPrograms[index] = { ...newPrograms[index], features: newFeatures };
                              setContent(prev => ({ ...prev, spmbPrograms: newPrograms }));
                            }}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newPrograms = [...(content.spmbPrograms || [])];
                          const newFeatures = [...newPrograms[index].features, 'Fitur Baru'];
                          newPrograms[index] = { ...newPrograms[index], features: newFeatures };
                          setContent(prev => ({ ...prev, spmbPrograms: newPrograms }));
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Fitur
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dynamic Sections */}
      {['features', 'statistics', 'programs', 'achievements', 'buttonActions'].includes(activeSection) && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                {sections.find(s => s.id === activeSection)?.name}
              </CardTitle>
              <Button onClick={() => addItem(activeSection)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(content[activeSection as keyof HomeContent] as any[])?.map((item: any) => (
                <div key={item.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">{item.title || item.text || item.label || item.name}</Badge>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingItem({ section: activeSection, item })}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteItem(activeSection, item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {activeSection === 'features' && (
                      <>
                        <div>
                          <strong>Text:</strong> {item.text}
                        </div>
                        <div>
                          <strong>Warna:</strong> <span className={item.color}>●</span> {item.color}
                        </div>
                      </>
                    )}
                    
                    {activeSection === 'statistics' && (
                      <>
                        <div>
                          <strong>Label:</strong> {item.label}
                        </div>
                        <div>
                          <strong>Nilai:</strong> {item.value}
                        </div>
                      </>
                    )}
                    
                    {activeSection === 'programs' && (
                      <>
                        <div>
                          <strong>Judul:</strong> {item.title}
                        </div>
                        <div>
                          <strong>Subtitle:</strong> {item.subtitle}
                        </div>
                        <div className="md:col-span-2">
                          <strong>Deskripsi:</strong> {item.description}
                        </div>
                      </>
                    )}
                    
                    {activeSection === 'achievements' && (
                      <>
                        <div>
                          <strong>Judul:</strong> {item.title}
                        </div>
                        <div className="md:col-span-2">
                          <strong>Deskripsi:</strong> {item.description}
                        </div>
                      </>
                    )}

                    {activeSection === 'buttonActions' && (
                      <>
                        <div>
                          <strong>Nama:</strong> {item.name}
                        </div>
                        <div>
                          <strong>Text:</strong> {item.text}
                        </div>
                        <div>
                          <strong>Aksi:</strong> {item.action}
                        </div>
                        <div>
                          <strong>Status:</strong> {item.enabled ? 'Aktif' : 'Nonaktif'}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Simple Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Edit Item</h3>
            <div className="space-y-3">
              {editingItem.section === 'features' && (
                <>
                  <div>
                    <Label>Text</Label>
                    <Input
                      value={editingItem.item.text || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        item: { ...editingItem.item, text: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label>Icon</Label>
                    <select
                      value={editingItem.item.icon || 'CheckCircle'}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        item: { ...editingItem.item, icon: e.target.value }
                      })}
                      className="w-full p-2 border rounded"
                    >
                      <option value="CheckCircle">CheckCircle</option>
                      <option value="Star">Star</option>
                      <option value="Award">Award</option>
                      <option value="Heart">Heart</option>
                    </select>
                  </div>
                  <div>
                    <Label>Warna Text</Label>
                    <select
                      value={editingItem.item.color || 'text-blue-600'}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        item: { ...editingItem.item, color: e.target.value }
                      })}
                      className="w-full p-2 border rounded"
                    >
                      <option value="text-blue-600">Biru</option>
                      <option value="text-green-600">Hijau</option>
                      <option value="text-purple-600">Ungu</option>
                      <option value="text-orange-600">Oranye</option>
                    </select>
                  </div>
                  <div>
                    <Label>Warna Background</Label>
                    <select
                      value={editingItem.item.bgColor || 'bg-blue-100'}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        item: { ...editingItem.item, bgColor: e.target.value }
                      })}
                      className="w-full p-2 border rounded"
                    >
                      <option value="bg-blue-100">Biru</option>
                      <option value="bg-green-100">Hijau</option>
                      <option value="bg-purple-100">Ungu</option>
                      <option value="bg-orange-100">Oranye</option>
                    </select>
                  </div>
                </>
              )}

              {editingItem.section === 'statistics' && (
                <>
                  <div>
                    <Label>Label</Label>
                    <Input
                      value={editingItem.item.label || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        item: { ...editingItem.item, label: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label>Nilai</Label>
                    <Input
                      value={editingItem.item.value || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        item: { ...editingItem.item, value: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label>Icon</Label>
                    <select
                      value={editingItem.item.icon || 'Users'}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        item: { ...editingItem.item, icon: e.target.value }
                      })}
                      className="w-full p-2 border rounded"
                    >
                      <option value="Users">Users</option>
                      <option value="BookOpen">BookOpen</option>
                      <option value="Award">Award</option>
                      <option value="Heart">Heart</option>
                    </select>
                  </div>
                  <div>
                    <Label>Warna Gradient</Label>
                    <select
                      value={editingItem.item.color || 'from-blue-500 to-cyan-500'}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        item: { ...editingItem.item, color: e.target.value }
                      })}
                      className="w-full p-2 border rounded"
                    >
                      <option value="from-blue-500 to-cyan-500">Biru</option>
                      <option value="from-green-500 to-emerald-500">Hijau</option>
                      <option value="from-purple-500 to-pink-500">Ungu</option>
                      <option value="from-orange-500 to-red-500">Oranye</option>
                    </select>
                  </div>
                </>
              )}

              {editingItem.section === 'programs' && (
                <>
                  <div>
                    <Label>Icon</Label>
                    <Input
                      value={editingItem.item.icon || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        item: { ...editingItem.item, icon: e.target.value }
                      })}
                      placeholder="Emoji atau icon (🎨, 📖, 🕌)"
                    />
                  </div>
                  <div>
                    <Label>Judul</Label>
                    <Input
                      value={editingItem.item.title || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        item: { ...editingItem.item, title: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label>Subtitle</Label>
                    <Input
                      value={editingItem.item.subtitle || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        item: { ...editingItem.item, subtitle: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label>Deskripsi</Label>
                    <Textarea
                      value={editingItem.item.description || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        item: { ...editingItem.item, description: e.target.value }
                      })}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>ID Program</Label>
                    <Input
                      value={editingItem.item.id || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        item: { ...editingItem.item, id: e.target.value }
                      })}
                      placeholder="paud, tka-tpa, diniyah"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      ID digunakan untuk link ke halaman detail program
                    </p>
                  </div>
                </>
              )}

              {editingItem.section === 'achievements' && (
                <>
                  <div>
                    <Label>Icon</Label>
                    <Input
                      value={editingItem.item.icon || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        item: { ...editingItem.item, icon: e.target.value }
                      })}
                      placeholder="Emoji atau icon (🏆, ⭐, 🌟)"
                    />
                  </div>
                  <div>
                    <Label>Judul</Label>
                    <Input
                      value={editingItem.item.title || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        item: { ...editingItem.item, title: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label>Deskripsi</Label>
                    <Textarea
                      value={editingItem.item.description || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        item: { ...editingItem.item, description: e.target.value }
                      })}
                      rows={3}
                    />
                  </div>
                </>
              )}

              {editingItem.section === 'buttonActions' && (
                <>
                  <div>
                    <Label>Nama</Label>
                    <Input
                      value={editingItem.item.name || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        item: { ...editingItem.item, name: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label>Text Button</Label>
                    <Input
                      value={editingItem.item.text || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        item: { ...editingItem.item, text: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label>Aksi</Label>
                    <select
                      value={editingItem.item.action || 'navigate'}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        item: { ...editingItem.item, action: e.target.value }
                      })}
                      className="w-full p-2 border rounded"
                    >
                      <option value="navigate">Navigate</option>
                      <option value="modal">Modal</option>
                      <option value="contact">Contact</option>
                      <option value="download">Download</option>
                    </select>
                  </div>
                  {editingItem.item.action === 'navigate' && (
                    <div>
                      <Label>URL</Label>
                      <Input
                        value={editingItem.item.url || ''}
                        onChange={(e) => setEditingItem({
                          ...editingItem,
                          item: { ...editingItem.item, url: e.target.value }
                        })}
                      />
                    </div>
                  )}
                  <div>
                    <Label>Status</Label>
                    <select
                      value={editingItem.item.enabled ? 'true' : 'false'}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        item: { ...editingItem.item, enabled: e.target.value === 'true' }
                      })}
                      className="w-full p-2 border rounded"
                    >
                      <option value="true">Aktif</option>
                      <option value="false">Nonaktif</option>
                    </select>
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setEditingItem(null)}>
                Batal
              </Button>
              <Button onClick={() => {
                updateItem(editingItem.section, editingItem.item.id, editingItem.item);
                setEditingItem(null);
              }}>
                Simpan
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeContentManager;