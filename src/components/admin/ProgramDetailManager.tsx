import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Save, 
  Plus, 
  Minus, 
  Upload, 
  Image as ImageIcon,
  DollarSign,
  School,
  Calendar,
  Users,
  CheckCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface ProgramDetail {
  id?: number;
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

const ProgramDetailManager = () => {
  const [activeProgram, setActiveProgram] = useState('paud');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [programDetails, setProgramDetails] = useState<Record<string, ProgramDetail>>({
    paud: {
      program_id: 'paud',
      title: 'Kober/PAUD',
      subtitle: 'Kelompok Bermain / Pendidikan Anak Usia Dini',
      description: 'Program pendidikan untuk anak usia dini yang menggabungkan pembelajaran akademik dengan nilai-nilai Islam dalam suasana yang menyenangkan.',
      features: [
        'Pembelajaran Dasar (Calistung)',
        'Pengenalan Huruf Hijaiyah',
        'Seni, Musik, dan Gerak',
        'Permainan Edukatif',
        'Pembentukan Karakter Islami'
      ],
      curriculum: [
        'Pengenalan Huruf dan Angka',
        'Membaca dan Menulis Dasar',
        'Berhitung Dasar',
        'Mengenal Huruf Hijaiyah',
        'Hafalan Doa Sehari-hari',
        'Seni dan Kreativitas',
        'Permainan Edukatif',
        'Pengembangan Motorik',
        'Pendidikan Karakter Islami'
      ],
      facilities: [
        'Ruang Kelas Nyaman',
        'Area Bermain Indoor',
        'Area Bermain Outdoor',
        'Perpustakaan Mini',
        'Alat Peraga Edukatif',
        'Toilet Anak',
        'Ruang Istirahat'
      ],
      schedule: 'Senin - Jumat, 08:00 - 11:00',
      age_range: '3-6 tahun',
      class_size: '15-20 anak per kelas',
      monthly_fee: 150000,
      registration_fee: 500000,
      uniform_fee: 250000,
      book_fee: 200000,
      images: [
        'https://images.pexels.com/photos/8535214/pexels-photo-8535214.jpeg',
        'https://images.pexels.com/photos/8535227/pexels-photo-8535227.jpeg',
        'https://images.pexels.com/photos/8473456/pexels-photo-8473456.jpeg'
      ]
    },
    'tka-tpa': {
      program_id: 'tka-tpa',
      title: 'TKA/TPA',
      subtitle: 'Taman Kanak-kanak Al-Quran / Taman Pendidikan Al-Quran',
      description: 'Program pendidikan Al-Quran untuk anak-anak usia 4-12 tahun dengan metode pembelajaran yang menyenangkan dan mudah dipahami.',
      features: [
        'Pembelajaran Al-Quran dengan Tajwid',
        'Hafalan Surat-surat Pendek',
        'Pendidikan Akhlak dan Adab',
        'Pembelajaran Bahasa Arab Dasar',
        'Kegiatan Seni dan Kreativitas'
      ],
      curriculum: [
        'Baca Tulis Al-Quran',
        'Tahsin dan Tajwid',
        'Tahfidz Juz 30',
        'Doa-doa Harian',
        'Hadits Pilihan',
        'Adab dan Akhlak Islami',
        'Bahasa Arab Dasar',
        'Praktek Ibadah',
        'Sirah Nabawiyah'
      ],
      facilities: [
        'Ruang Belajar Al-Quran',
        'Mushola Mini',
        'Perpustakaan Islam',
        'Alat Peraga Edukatif',
        'Audio Visual',
        'Area Bermain',
        'Toilet Bersih'
      ],
      schedule: 'Senin - Jumat, 15:30 - 17:00',
      age_range: '4-12 tahun',
      class_size: '10-15 anak per kelas',
      monthly_fee: 100000,
      registration_fee: 300000,
      uniform_fee: 200000,
      book_fee: 150000,
      images: [
        'https://images.pexels.com/photos/8471835/pexels-photo-8471835.jpeg',
        'https://images.pexels.com/photos/8471788/pexels-photo-8471788.jpeg',
        'https://images.pexels.com/photos/8471799/pexels-photo-8471799.jpeg'
      ]
    },
    diniyah: {
      program_id: 'diniyah',
      title: 'Madrasah Diniyah',
      subtitle: 'Pendidikan Agama Islam Formal',
      description: 'Program pendidikan agama Islam yang komprehensif untuk memberikan pemahaman mendalam tentang ajaran Islam kepada generasi muda.',
      features: [
        'Studi Al-Quran dan Tafsir',
        'Hadits dan Sirah Nabawiyah',
        'Fiqh dan Aqidah',
        'Bahasa Arab Lanjutan',
        'Sejarah Islam'
      ],
      curriculum: [
        'Al-Quran dan Tafsir',
        'Hadits dan Ilmu Hadits',
        'Fiqh Ibadah',
        'Aqidah Islamiyah',
        'Akhlak dan Adab',
        'Bahasa Arab',
        'Sirah Nabawiyah',
        'Sejarah Peradaban Islam',
        'Praktek Ibadah'
      ],
      facilities: [
        'Ruang Kelas Kondusif',
        'Perpustakaan Islam',
        'Laboratorium Bahasa Arab',
        'Mushola',
        'Ruang Diskusi',
        'Komputer dan Internet',
        'Kantin Halal'
      ],
      schedule: 'Senin - Kamis, 19:30 - 21:00',
      age_range: '7-17 tahun',
      class_size: '15-20 santri per kelas',
      monthly_fee: 125000,
      registration_fee: 350000,
      uniform_fee: 225000,
      book_fee: 175000,
      images: [
        'https://images.pexels.com/photos/5905905/pexels-photo-5905905.jpeg',
        'https://images.pexels.com/photos/5905904/pexels-photo-5905904.jpeg',
        'https://images.pexels.com/photos/5905902/pexels-photo-5905902.jpeg'
      ]
    }
  });

  useEffect(() => {
    loadProgramDetails();
  }, []);

  const loadProgramDetails = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('program_details')
        .select('*');
      
      if (error) {
        console.error('Error loading program details:', error);
        return;
      }
      
      if (data && data.length > 0) {
        const updatedDetails = { ...programDetails };
        
        data.forEach((program) => {
          if (updatedDetails[program.program_id]) {
            updatedDetails[program.program_id] = program;
          }
        });
        
        setProgramDetails(updatedDetails);
      }
    } catch (error) {
      console.error('Error loading program details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const currentProgram = programDetails[activeProgram];
      
      const { error } = await supabase
        .from('program_details')
        .upsert({
          program_id: currentProgram.program_id,
          title: currentProgram.title,
          subtitle: currentProgram.subtitle,
          description: currentProgram.description,
          features: currentProgram.features,
          curriculum: currentProgram.curriculum,
          facilities: currentProgram.facilities,
          schedule: currentProgram.schedule,
          age_range: currentProgram.age_range,
          class_size: currentProgram.class_size,
          monthly_fee: currentProgram.monthly_fee,
          registration_fee: currentProgram.registration_fee,
          uniform_fee: currentProgram.uniform_fee,
          book_fee: currentProgram.book_fee,
          images: currentProgram.images,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      toast({
        title: "Berhasil",
        description: `Detail program ${currentProgram.title} telah disimpan`,
      });
    } catch (error) {
      console.error('Error saving program details:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan detail program",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setProgramDetails(prev => ({
      ...prev,
      [activeProgram]: {
        ...prev[activeProgram],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    setProgramDetails(prev => {
      const newArray = [...prev[activeProgram][field]];
      newArray[index] = value;
      return {
        ...prev,
        [activeProgram]: {
          ...prev[activeProgram],
          [field]: newArray
        }
      };
    });
  };

  const handleAddArrayItem = (field: string) => {
    setProgramDetails(prev => ({
      ...prev,
      [activeProgram]: {
        ...prev[activeProgram],
        [field]: [...prev[activeProgram][field], '']
      }
    }));
  };

  const handleRemoveArrayItem = (field: string, index: number) => {
    setProgramDetails(prev => {
      const newArray = [...prev[activeProgram][field]];
      newArray.splice(index, 1);
      return {
        ...prev,
        [activeProgram]: {
          ...prev[activeProgram],
          [field]: newArray
        }
      };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `program-${activeProgram}-${Date.now()}.${fileExt}`;
      const filePath = `programs/${fileName}`;
      
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
        setProgramDetails(prev => ({
          ...prev,
          [activeProgram]: {
            ...prev[activeProgram],
            images: [...prev[activeProgram].images, data.publicUrl]
          }
        }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Gagal mengunggah gambar",
        variant: "destructive",
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setProgramDetails(prev => {
      const newImages = [...prev[activeProgram].images];
      newImages.splice(index, 1);
      return {
        ...prev,
        [activeProgram]: {
          ...prev[activeProgram],
          images: newImages
        }
      };
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const currentProgram = programDetails[activeProgram];

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Detail Program Pendidikan</h2>
          <p className="text-gray-600">Kelola informasi detail untuk setiap program pendidikan</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="gradient-primary"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Program</CardTitle>
              <CardDescription>Pilih program untuk diedit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant={activeProgram === 'paud' ? 'default' : 'outline'} 
                className={`w-full justify-start ${activeProgram === 'paud' ? 'bg-gradient-to-r from-green-600 to-teal-600' : ''}`}
                onClick={() => setActiveProgram('paud')}
              >
                <School className="h-4 w-4 mr-2" />
                Kober/PAUD
              </Button>
              <Button 
                variant={activeProgram === 'tka-tpa' ? 'default' : 'outline'} 
                className={`w-full justify-start ${activeProgram === 'tka-tpa' ? 'bg-gradient-to-r from-blue-600 to-cyan-600' : ''}`}
                onClick={() => setActiveProgram('tka-tpa')}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                TKA/TPA
              </Button>
              <Button 
                variant={activeProgram === 'diniyah' ? 'default' : 'outline'} 
                className={`w-full justify-start ${activeProgram === 'diniyah' ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}`}
                onClick={() => setActiveProgram('diniyah')}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Madrasah Diniyah
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Biaya Pendidikan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="monthly_fee">SPP Bulanan</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="monthly_fee"
                    type="number"
                    value={currentProgram.monthly_fee}
                    onChange={(e) => handleChange('monthly_fee', parseInt(e.target.value))}
                    className="pl-10"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">{formatCurrency(currentProgram.monthly_fee)}</p>
              </div>
              
              <div>
                <Label htmlFor="registration_fee">Biaya Pendaftaran</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="registration_fee"
                    type="number"
                    value={currentProgram.registration_fee}
                    onChange={(e) => handleChange('registration_fee', parseInt(e.target.value))}
                    className="pl-10"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">{formatCurrency(currentProgram.registration_fee)}</p>
              </div>
              
              <div>
                <Label htmlFor="uniform_fee">Biaya Seragam</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="uniform_fee"
                    type="number"
                    value={currentProgram.uniform_fee}
                    onChange={(e) => handleChange('uniform_fee', parseInt(e.target.value))}
                    className="pl-10"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">{formatCurrency(currentProgram.uniform_fee)}</p>
              </div>
              
              <div>
                <Label htmlFor="book_fee">Biaya Buku & Modul</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="book_fee"
                    type="number"
                    value={currentProgram.book_fee}
                    onChange={(e) => handleChange('book_fee', parseInt(e.target.value))}
                    className="pl-10"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">{formatCurrency(currentProgram.book_fee)}</p>
              </div>
              
              <div className="pt-2 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Awal:</span>
                  <span className="font-bold text-blue-600">
                    {formatCurrency(
                      currentProgram.registration_fee + 
                      currentProgram.uniform_fee + 
                      currentProgram.book_fee
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Dasar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Judul Program</Label>
                  <Input
                    id="title"
                    value={currentProgram.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="subtitle">Subtitle Program</Label>
                  <Input
                    id="subtitle"
                    value={currentProgram.subtitle}
                    onChange={(e) => handleChange('subtitle', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Deskripsi Program</Label>
                <Textarea
                  id="description"
                  value={currentProgram.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="schedule">Jadwal Belajar</Label>
                  <div className="relative mt-1">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="schedule"
                      value={currentProgram.schedule}
                      onChange={(e) => handleChange('schedule', e.target.value)}
                      className="pl-10"
                      placeholder="Contoh: Senin - Jumat, 08:00 - 11:00"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="age_range">Rentang Usia</Label>
                  <div className="relative mt-1">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="age_range"
                      value={currentProgram.age_range}
                      onChange={(e) => handleChange('age_range', e.target.value)}
                      className="pl-10"
                      placeholder="Contoh: 3-6 tahun"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="class_size">Ukuran Kelas</Label>
                  <div className="relative mt-1">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="class_size"
                      value={currentProgram.class_size}
                      onChange={(e) => handleChange('class_size', e.target.value)}
                      className="pl-10"
                      placeholder="Contoh: 15-20 anak per kelas"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="features" className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="features">Keunggulan</TabsTrigger>
              <TabsTrigger value="curriculum">Kurikulum</TabsTrigger>
              <TabsTrigger value="facilities">Fasilitas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="features" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Keunggulan Program</span>
                    <Button 
                      size="sm" 
                      onClick={() => handleAddArrayItem('features')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentProgram.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <Input
                          value={feature}
                          onChange={(e) => handleArrayChange('features', index, e.target.value)}
                          placeholder="Masukkan keunggulan program"
                        />
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleRemoveArrayItem('features', index)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="curriculum" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Kurikulum Pembelajaran</span>
                    <Button 
                      size="sm" 
                      onClick={() => handleAddArrayItem('curriculum')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentProgram.curriculum.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold flex-shrink-0">
                          {index + 1}
                        </div>
                        <Input
                          value={item}
                          onChange={(e) => handleArrayChange('curriculum', index, e.target.value)}
                          placeholder="Masukkan item kurikulum"
                        />
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleRemoveArrayItem('curriculum', index)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="facilities" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Fasilitas Pendukung</span>
                    <Button 
                      size="sm" 
                      onClick={() => handleAddArrayItem('facilities')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentProgram.facilities.map((facility, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
                        <Input
                          value={facility}
                          onChange={(e) => handleArrayChange('facilities', index, e.target.value)}
                          placeholder="Masukkan fasilitas"
                        />
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleRemoveArrayItem('facilities', index)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Galeri Foto</span>
                <div>
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Button as="div">
                      <Upload className="h-4 w-4 mr-2" />
                      Tambah Foto
                    </Button>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentProgram.images.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                  <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">Belum ada foto yang diunggah</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {currentProgram.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={image} 
                        alt={`${currentProgram.title} - ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleRemoveImage(index)}
                        >
                          Hapus
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetailManager;