import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Save, 
  RefreshCw,
  Home,
  Upload,
  Video,
  Image as ImageIcon
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import HomeContentManager from './HomeContentManager';
import BrandingSettings from './BrandingSettings';
import ColorSettings from './ColorSettings';
import ContentSettings from './ContentSettings';
import ContactSettings from './ContactSettings';
import LayoutSettings from './LayoutSettings';
import PreviewSection from './PreviewSection';
import ButtonTextSettings from './ButtonTextSettings';

interface WebsiteSettings {
  siteName: string;
  siteDescription: string;
  logo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  aboutTitle: string;
  aboutContent: string;
  footerText: string;
  contactEmail: string;
  contactPhone: string;
  contactPhone2: string;
  brochureUrl: string;
  videoProfileUrl: string;
  developerContact: string;
  adminContact: string;
  address: {
    kampung: string;
    rt: string;
    rw: string;
    desa: string;
    kecamatan: string;
    kabupaten: string;
  };
  socialMedia: {
    facebook: string;
    instagram: string;
    youtube: string;
    twitter: string;
  };
  buttonTexts: {
    hubungiAdmin: string;
    konsultasiGratis: string;
    jadwalKunjungan: string;
    hubungiKami: string;
    downloadBrosur: string;
    daftarSekarang: string;
  };
  showGraduates: boolean;
  showPPDB: boolean;
  enableDarkMode: boolean;
  showFloatingStats: boolean;
}

const WebsiteCustomizer = () => {
  const [settings, setSettings] = useState<WebsiteSettings>({
    siteName: 'Yayasan Al-Hikmah',
    siteDescription: 'Lembaga Pendidikan Islam Terpadu',
    logo: '/logo.png',
    favicon: '/logo.png',
    primaryColor: '#4F46E5',
    secondaryColor: '#06B6D4',
    accentColor: '#F59E0B',
    fontFamily: 'Poppins',
    heroTitle: 'Yayasan Al-Hikmah',
    heroSubtitle: 'Membentuk Generasi Qurani yang Berakhlak Mulia',
    heroImage: '',
    aboutTitle: 'Tentang Kami',
    aboutContent: 'Yayasan Al-Hikmah adalah lembaga pendidikan Islam yang berkomitmen untuk membentuk generasi Qurani yang berakhlak mulia.',
    footerText: '© 2025 Yayasan Al-Hikmah. Semua hak dilindungi.',
    contactEmail: 'info@alhikmah.ac.id',
    contactPhone: '089677921985',
    contactPhone2: '0812-3456-7890',
    brochureUrl: '',
    videoProfileUrl: '',
    developerContact: 'https://wa.me/6285324142332',
    adminContact: 'https://wa.me/6289677921985',
    address: {
      kampung: 'Kp. Tanjung',
      rt: '03',
      rw: '07',
      desa: 'Desa Tanjungsari',
      kecamatan: 'Kecamatan Cangkuang',
      kabupaten: 'Kabupaten Bandung'
    },
    socialMedia: {
      facebook: '',
      instagram: '',
      youtube: '',
      twitter: ''
    },
    buttonTexts: {
      hubungiAdmin: 'Hubungi Admin',
      konsultasiGratis: 'Konsultasi Gratis',
      jadwalKunjungan: 'Jadwal Kunjungan',
      hubungiKami: 'Hubungi Kami',
      downloadBrosur: 'Download Brosur',
      daftarSekarang: 'Daftar Sekarang'
    },
    showGraduates: true,
    showPPDB: true,
    enableDarkMode: false,
    showFloatingStats: true
  });

  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingBrochure, setIsUploadingBrochure] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // Check if website_settings table exists
      const { data, error } = await supabase
        .from('website_settings')
        .select('settings')
        .eq('id', 1)
        .single();
      
      if (error) {
        console.log('Creating website_settings table...');
        await createSettingsTable();
        return;
      }
      
      if (data && data.settings) {
        setSettings({ ...settings, ...data.settings });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createSettingsTable = async () => {
    try {
      // Create the table
      await supabase.rpc('create_website_settings_table');
      
      // Insert default settings
      await supabase
        .from('website_settings')
        .insert({
          id: 1,
          settings: settings
        });
    } catch (error) {
      console.error('Error creating settings table:', error);
    }
  };

  const saveSettings = async () => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('website_settings')
        .upsert({
          id: 1,
          settings: settings,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      // Apply changes to CSS variables
      const root = document.documentElement;
      root.style.setProperty('--primary-color', settings.primaryColor);
      root.style.setProperty('--secondary-color', settings.secondaryColor);
      root.style.setProperty('--accent-color', settings.accentColor);
      
      toast({
        title: "Berhasil",
        description: "Pengaturan tampilan website telah disimpan",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan pengaturan",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (field: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      try {
        setIsLoading(true);
        
        // Create a unique file name
        const fileExt = file.name.split('.').pop();
        const fileName = `website-${field}-${Date.now()}.${fileExt}`;
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
          if (field === 'logo' || field === 'favicon') {
            setSettings(prev => ({
              ...prev,
              [field]: data.publicUrl
            }));
          } else if (field === 'heroImage') {
            setSettings(prev => ({
              ...prev,
              heroImage: data.publicUrl
            }));
          }
          
          toast({
            title: "Berhasil",
            description: "Gambar berhasil diunggah",
          });
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          title: "Error",
          description: "Gagal mengunggah gambar",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    input.click();
  };

  const handleBrochureUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/pdf';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      try {
        setIsUploadingBrochure(true);
        
        // Create a unique file name
        const fileExt = file.name.split('.').pop();
        const fileName = `brochure-${Date.now()}.${fileExt}`;
        const filePath = `brochures/${fileName}`;
        
        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file);
        
        if (uploadError) throw uploadError;
        
        // Get the public URL
        const { data } = supabase.storage
          .from('documents')
          .getPublicUrl(filePath);
        
        if (data) {
          setSettings(prev => ({
            ...prev,
            brochureUrl: data.publicUrl
          }));
          
          toast({
            title: "Berhasil",
            description: "Brosur berhasil diunggah",
          });
        }
      } catch (error) {
        console.error('Error uploading brochure:', error);
        toast({
          title: "Error",
          description: "Gagal mengunggah brosur",
          variant: "destructive",
        });
      } finally {
        setIsUploadingBrochure(false);
      }
    };
    
    input.click();
  };

  const handleVideoUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      try {
        setIsUploadingVideo(true);
        
        // Create a unique file name
        const fileExt = file.name.split('.').pop();
        const fileName = `video-profile-${Date.now()}.${fileExt}`;
        const filePath = `videos/${fileName}`;
        
        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('videos')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (uploadError) throw uploadError;
        
        // Get the public URL
        const { data } = supabase.storage
          .from('videos')
          .getPublicUrl(filePath);
        
        if (data) {
          setSettings(prev => ({
            ...prev,
            videoProfileUrl: data.publicUrl
          }));
          
          toast({
            title: "Berhasil",
            description: "Video profil berhasil diunggah",
          });
        }
      } catch (error) {
        console.error('Error uploading video:', error);
        toast({
          title: "Error",
          description: "Gagal mengunggah video profil",
          variant: "destructive",
        });
      } finally {
        setIsUploadingVideo(false);
      }
    };
    
    input.click();
  };

  const resetToDefault = async () => {
    if (window.confirm('Apakah Anda yakin ingin mereset ke pengaturan default?')) {
      try {
        setIsLoading(true);
        
        const defaultSettings = {
          siteName: 'Yayasan Al-Hikmah',
          siteDescription: 'Lembaga Pendidikan Islam Terpadu',
          logo: '/logo.png',
      favicon: '/logo.png',
          primaryColor: '#4F46E5',
          secondaryColor: '#06B6D4',
          accentColor: '#F59E0B',
          fontFamily: 'Poppins',
          heroTitle: 'Yayasan Al-Hikmah',
          heroSubtitle: 'Membentuk Generasi Qurani yang Berakhlak Mulia',
          heroImage: '',
          aboutTitle: 'Tentang Kami',
          aboutContent: 'Yayasan Al-Hikmah adalah lembaga pendidikan Islam yang berkomitmen untuk membentuk generasi Qurani yang berakhlak mulia.',
          footerText: '© 2025 Yayasan Al-Hikmah. Semua hak dilindungi.',
          contactEmail: 'info@alhikmah.ac.id',
          contactPhone: '089677921985',
          contactPhone2: '0812-3456-7890',
          brochureUrl: '',
          videoProfileUrl: '',
          developerContact: 'https://wa.me/6285324142332',
          adminContact: 'https://wa.me/6289677921985',
          address: {
            kampung: 'Kp. Tanjung',
            rt: '03',
            rw: '07',
            desa: 'Desa Tanjungsari',
            kecamatan: 'Kecamatan Cangkuang',
            kabupaten: 'Kabupaten Bandung'
          },
          socialMedia: {
            facebook: '',
            instagram: '',
            youtube: '',
            twitter: ''
          },
          buttonTexts: {
            hubungiAdmin: 'Hubungi Admin',
            konsultasiGratis: 'Konsultasi Gratis',
            jadwalKunjungan: 'Jadwal Kunjungan',
            hubungiKami: 'Hubungi Kami',
            downloadBrosur: 'Download Brosur',
            daftarSekarang: 'Daftar Sekarang'
          },
          showGraduates: true,
          showPPDB: true,
          enableDarkMode: false,
          showFloatingStats: true
        };
        
        setSettings(defaultSettings);
        
        // Update in database
        const { error } = await supabase
          .from('website_settings')
          .update({
            settings: defaultSettings,
            updated_at: new Date().toISOString()
          })
          .eq('id', 1);
        
        if (error) throw error;
        
        toast({
          title: "Berhasil",
          description: "Pengaturan telah direset ke default",
        });
      } catch (error) {
        console.error('Error resetting settings:', error);
        toast({
          title: "Error",
          description: "Gagal mereset pengaturan",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getFullAddress = () => {
    const { kampung, rt, rw, desa, kecamatan, kabupaten } = settings.address;
    return `${kampung} RT ${rt} RW ${rw}, ${desa}, ${kecamatan}, ${kabupaten}`;
  };

  const handleSettingsChange = (updates: Partial<WebsiteSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Kustomisasi Website</h2>
          <p className="text-gray-600">Kelola tampilan dan konten website</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetToDefault} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={saveSettings} disabled={isLoading} className="gradient-primary">
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="homepage" className="w-full">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="homepage">Halaman Utama</TabsTrigger>
          <TabsTrigger value="branding">Brand</TabsTrigger>
          <TabsTrigger value="colors">Warna</TabsTrigger>
          <TabsTrigger value="content">Konten</TabsTrigger>
          <TabsTrigger value="contact">Kontak</TabsTrigger>
          <TabsTrigger value="buttons">Tombol</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="homepage" className="space-y-4">
          <HomeContentManager />
        </TabsContent>

        <TabsContent value="branding" className="space-y-4">
          <BrandingSettings
            settings={settings}
            onSettingsChange={handleSettingsChange}
            onImageUpload={handleImageUpload}
          />
          
          {/* Brochure Upload Section */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Brosur Yayasan</h3>
            <p className="text-gray-600 mb-4">
              Unggah file PDF brosur yang akan tersedia untuk diunduh oleh pengunjung website.
            </p>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={handleBrochureUpload}
                disabled={isUploadingBrochure}
                className="flex items-center"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploadingBrochure ? 'Mengunggah...' : 'Unggah Brosur (PDF)'}
              </Button>
              
              {settings.brochureUrl && (
                <div className="flex items-center space-x-2">
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                    Brosur tersedia
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => window.open(settings.brochureUrl, '_blank')}
                  >
                    Lihat
                  </Button>
                </div>
              )}
            </div>
            
            {settings.brochureUrl && (
              <p className="text-xs text-gray-500 mt-2 break-all">
                URL: {settings.brochureUrl}
              </p>
            )}
          </div>

          {/* Video Profile Upload Section */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Video Profil</h3>
            <p className="text-gray-600 mb-4">
              Unggah video profil yayasan yang akan ditampilkan kepada pengunjung website.
            </p>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={handleVideoUpload}
                disabled={isUploadingVideo}
                className="flex items-center"
              >
                <Video className="h-4 w-4 mr-2" />
                {isUploadingVideo ? 'Mengunggah...' : 'Unggah Video'}
              </Button>
              
              {settings.videoProfileUrl && (
                <div className="flex items-center space-x-2">
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                    Video tersedia
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => window.open(settings.videoProfileUrl, '_blank')}
                  >
                    Lihat
                  </Button>
                </div>
              )}
            </div>
            
            {settings.videoProfileUrl && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2 break-all">
                  URL: {settings.videoProfileUrl}
                </p>
                <div className="aspect-video w-full max-w-md bg-black rounded-lg overflow-hidden">
                  <video 
                    src={settings.videoProfileUrl} 
                    controls 
                    className="w-full h-full object-contain"
                  ></video>
                </div>
              </div>
            )}
          </div>
          
          {/* Developer Contact Section */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Kontak Developer</h3>
            <p className="text-gray-600 mb-4">
              Atur link WhatsApp untuk kontak developer yang ditampilkan di footer.
            </p>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="developerContact">Link WhatsApp Developer</Label>
                <Input
                  id="developerContact"
                  value={settings.developerContact}
                  onChange={(e) => handleSettingsChange({ developerContact: e.target.value })}
                  placeholder="https://wa.me/628123456789"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: https://wa.me/628123456789 (tanpa tanda + di depan nomor)
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="colors" className="space-y-4">
          <ColorSettings
            settings={settings}
            onSettingsChange={handleSettingsChange}
          />
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <ContentSettings
            settings={settings}
            onSettingsChange={handleSettingsChange}
            onImageUpload={handleImageUpload}
          />
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <ContactSettings
            settings={settings}
            onSettingsChange={handleSettingsChange}
            getFullAddress={getFullAddress}
          />
        </TabsContent>

        <TabsContent value="buttons" className="space-y-4">
          <ButtonTextSettings
            settings={settings}
            onSettingsChange={handleSettingsChange}
          />
        </TabsContent>

        <TabsContent value="layout" className="space-y-4">
          <LayoutSettings
            settings={settings}
            onSettingsChange={handleSettingsChange}
          />
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <PreviewSection
            settings={settings}
            previewMode={previewMode}
            onPreviewModeChange={setPreviewMode}
            getFullAddress={getFullAddress}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebsiteCustomizer;